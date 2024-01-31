import {BufferMemory} from "langchain/memory"
import {ChatOpenAI, OpenAIEmbeddings} from "@langchain/openai"
import {PDFLoader} from "langchain/document_loaders/fs/pdf"
import {MemoryVectorStore} from "langchain/vectorstores/memory";
import {PromptTemplate} from "@langchain/core/prompts";
import {RunnableSequence} from "@langchain/core/runnables";
import {formatDocumentsAsString} from "langchain/util/document";
import {StringOutputParser} from "@langchain/core/output_parsers";


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
    maxTokens: 100,
    streaming: true,
})

const questionPrompt = PromptTemplate.fromTemplate(
    `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
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

