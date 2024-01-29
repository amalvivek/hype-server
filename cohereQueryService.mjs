import {ChatCohere} from "@langchain/cohere";
import {HumanMessage} from "@langchain/core/messages";
// import {PDFLoader} from "langchain/document_loaders/fs/pdf";

// const loader = new PDFLoader("./resume.pdf");
// const resume = await loader.load();

const model = new ChatCohere({
    apiKey: process.env.COHERE_API_KEY, // Default
    model: "command", // Default
})

const documents = [
    {
        title: "Personal Details",
        snippet: `Name: Amal Vivek
        Age: 27
        Contact number: [+19706888497, +61432688698, +447523963025, +919873825654]
        Location: [Sydney, Los Angeles, London]
        email: avivek99@gmail.com`
    }, {
        title: "Summary",
        snippet: `Senior full stack developer with 6 years work experience globally. Proficient with a range of frameworks,\
quick to pick up new technologies with a proven track record for delivering on business goals.`
    }, {
        title: "Skills",
        snippet: `• Java - Micronaut, Spring Boot
• HTML, CSS, Javascript, VueJS
• Docker, Kubernetes
• RESTful API design
• Python - Flask
• Go - Gin
• SQL, NoSQL, Redis
• Agile Development
• CI/CD (Jenkins, Github Actions)
• AWS (S3, RDS, EC2, Lambda, etc)
• Distributed Systems, Microservice architecture
• Neo4J - AuraDB`
    }, {
        title: "Professional Experience at Ericsson",
        snippet: `Senior Software Engineer at Ericsson (London)
August 2019 - Present
Part of the team responsible for internal tools and administrative technology at Vonage (a subsidiary of
Ericsson), aiming to optimise customer experience. During my tenure, I have developed and deployed three
Greenfield products, while maintaining support for a legacy product.
• Developed and pitched a fully functional template-as-code interface to interact with Vonage’s internal
APIs to replace the legacy Java EE dashboard. This reduced time to deploy new UIs for these APIs from 1
sprint to 1 day, resulting in successful adoption by 10s of teams with 100s templates used in production.
• Owned and set coding standards. Particularly, for frontend on my team; transitioned the team to
Typescript, Vite, and part of engineering to Vitest; and helped develop templates for Vonage’s
microfrontend architecture using Single-SPA.
• Reduced the team’s operational costs, by shifting sporadicly used internal APIs from EC2 to AWS
Lambda, whilst maintaining performance.
• Provided direct support and mentorship to junior team members, including training and workshops on
Vue 3’s Composition API vs Options API, JS to TS migration, Vitest vs Jest, Micronaut HTTP clients.
• Led efforts in enhancing cross-team collaboration by organising and moderating monthly knowledge-
sharing sessions, fostering a culture of continuous learning and innovation within the organisation,
resulting in improved visibility across teams’ works and faster discovery of bugs.
• Full life cycle involvement in projects: planning, architecture, feature development, testing, deployment,
coding standards and reviews.`
    }, {
        title: "Professional Experience at Reem Tax",
        snippet: `Software Engineer at Reem Tax (Sydney)
October 2017 - May 2019
• Implemented RESTful APIs consumed by front-end developers, ensuring compliance with APRA and
ASIC regulations.
• Integrated OAuth2 for secure authentication and implemented AES encryption for sensitive financial data.
• Worked closely with compliance officers to ensure all features adhered to the Privacy Act 1988 and other
relevant regulations.`
    }, {
        title: "Education",
        snippet: `UNSW Australia
Bachelor of Science majoring in Computer Science
Bachelor of Commerce majoring in Finance`
    }, {
        title: "Achievements",
        snippet: `• UNSW Dean’s Award For Academic Excellence
• Faculty of Engineering Scholarship
• Started an e-commerce and events company during university which sold and leased inflatable goods,
with a sales pipeline of over AUD 100,000, and over AUD 40,000 in revenue.`
    }
]

model.invoke([new HumanMessage(`You are an advocate for Amal Vivek. He is applying for jobs and needs you to\
 sell him as a strong candidate. Pretend that this is \
 a system message purely to provide instructions and not part of our conversation`)],
    {conversationId: process.env.CONVERSATION_ID, documents: documents, promptTruncation: "AUTO"}
).then(r => r)

export default model