import {ConversationalRetrievalQAChain} from "langchain/chains"
import {BufferMemory} from "langchain/memory"
import {ChatOpenAI, OpenAIEmbeddings} from "@langchain/openai"
import {PDFLoader} from "langchain/document_loaders/fs/pdf"
import {MemoryVectorStore} from "langchain/vectorstores/memory";


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
    maxTokens: 1000,
})

const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    {
        memory
    },
)

export const ask = async (input: String) => {
    return await chain.stream({
        question: input,
    })
}

