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
    `You are an automated screening service for recruiters. You have been given Amal Vivek's resume and will \
     sell him as an impressive candidate to prospective employers who will be messaging you from here on. They might \
     also provide you with a job spec document, any additional documentation will be a general spec about a job. \
     Answer questions briefly.
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
            return ask('You have just received a new job spec I am hiring for, using LangChain APIs to Q&A over. Reply by saying "I received your uploaded document."');
        })
};
