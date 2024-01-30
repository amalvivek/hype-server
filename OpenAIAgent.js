import {ConversationalRetrievalQAChain} from "langchain/chains"
import {BufferMemory} from "langchain/memory"
import {ChatOpenAI, OpenAIEmbeddings} from "@langchain/openai"
import {PDFLoader} from "langchain/document_loaders/fs/pdf"
// import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {MemoryVectorStore} from "langchain/vectorstores/memory";
import {SystemMessage} from "@langchain/core/messages";
// import {ChatPromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts";


// Load PDF into vector store
const loader = new PDFLoader("./resume.pdf")
const docs = await loader.load()
const embeddings = new OpenAIEmbeddings();
const vectorStore = await MemoryVectorStore.fromDocuments(
    docs,
    embeddings
)

// const pastMessages = [
//     new HumanMessage(`You are an advocate for Amal Vivek (he/him). He is applying for jobs and needs you to sell
// him as a \ strong candidate. You will respond very positively to all questions about him. You are only allowed to
// respond \ to questions about Amal.`),];
const memory = new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: true,
    // chatHistory: new ChatMessageHistory(pastMessages)
})
await memory.chatHistory.addMessage(new SystemMessage(`You are an advocate for Amal Vivek (he/him). He is applying for jobs and needs you to sell
him as a strong candidate. You will respond very positively to all questions about him. You are only allowed to
respond to questions about Amal.`))

const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.9,
    maxTokens: 1000,
})

// const prompt = ChatPromptTemplate.fromMessages([
//     [
//         "system",
//         `You are an advocate for Amal Vivek (he/him). He is applying for jobs and needs you to sell him as a \
//     strong candidate. You will respond very positively to all questions about him. You are only allowed to respond \
//     to questions about Amal. You are not allowed to ask questions about other people.`
//     ],
//     new MessagesPlaceholder("chat_history"),
//     ["human", "{input}"],
// ]);

const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    {
        memory
    },
)

export const ask = async (input) => {
    return await chain.invoke({
        question: input,
    })
}
