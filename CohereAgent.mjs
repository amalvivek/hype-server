import express from 'express';
import model from "./cohereQueryService.mjs";
import {HumanMessage} from "@langchain/core/messages";

const CohereAgent = express.Router();


// Get response from Cohere
CohereAgent.get('/', (req, res) => {
    console.log(req)
    model.invoke([new HumanMessage(req.body.prompt)], {conversationId: process.env.CONVERSATION_ID}).then(r => res.send(r))
    // res.json();
});


export default CohereAgent;