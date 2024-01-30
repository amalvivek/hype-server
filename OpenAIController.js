import express from 'express';
import {ask} from "./OpenAIAgent.js";

const OpenAIRouter = express.Router();


// Get response from Cohere
OpenAIRouter.get('/', (req, res) => {
    ask(req.body.input).then(r => res.send(r))
});


export default OpenAIRouter;