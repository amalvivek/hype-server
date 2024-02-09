import {BufferMemory} from "langchain/memory"
import {ChatOpenAI, OpenAIEmbeddings} from "@langchain/openai"
import {PDFLoader} from "langchain/document_loaders/fs/pdf"
import {MemoryVectorStore} from "langchain/vectorstores/memory";
import {PromptTemplate} from "@langchain/core/prompts";
import {RunnableSequence} from "@langchain/core/runnables";
import {formatDocumentsAsString} from "langchain/util/document";
import {StringOutputParser} from "@langchain/core/output_parsers";
import {FileData} from "./shared.types.js";
import {getFileLoader} from "./helper.utils.js";
import {Document} from "@langchain/core/documents";


// Load PDF into vector store
const loader = new PDFLoader("./resume.pdf")
const docs = await loader.load()
const embeddings = new OpenAIEmbeddings();
const vectorStore = await MemoryVectorStore.fromDocuments(
    docs,
    embeddings
)

const memory = new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: true,
})

const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.9,
    maxTokens: 300,
    streaming: true,
})

const questionPrompt = PromptTemplate.fromTemplate(
    `You are an advocate for Amal Vivek. You are trying to sell him as an impressive candidate to prospective \
    employers. Answer questions briefly and try not to repeat yourself. You may receive additional documents like job \
    ads or job specs which you may also be questioned about and you should analyse its relevance to Amal. Respond \
    informally and make sure to paint him in a positive light.
----------
CONTEXT: {context}
----------
CHAT HISTORY: {chatHistory}
----------
QUESTION: {question}
----------
Helpful Answer:`
);


const chain = RunnableSequence.from([
    {
        question: (input: { question: string; chatHistory?: string }) =>
            input.question,
        chatHistory: (input: { question: string; chatHistory?: string }) =>
            input.chatHistory ?? "",
        context: async (input: { question: string; chatHistory?: string }) => {
            const relevantDocs = await vectorStore.asRetriever().getRelevantDocuments(input.question);
            return formatDocumentsAsString(relevantDocs);
        },
    },
    questionPrompt,
    model,
    new StringOutputParser(),
]);


export const ask = async (input: string) => {
    return await chain.stream({
        question: input,
    })
}

export const addFileContext = async (fileData: FileData[]) => {
    const promises: Promise<Document[]>[] = [];

    fileData.forEach((file) => {
        promises.push(getFileLoader(file.contentType, file.data)?.load(file.data))
    });

    return Promise.all(promises)
        .then((documents: Document[][]) => {
            vectorStore.addDocuments(documents.flat());
        }).then(() => {
            return ask('Did you receive any extra documents? Reply by saying "I received documents about ..."');
        })
};
