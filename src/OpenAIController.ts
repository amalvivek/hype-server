import express from 'express';
import {ask} from "./OpenAIAgent.ts";

const OpenAIRouter = express.Router();


// Get response from ChatGPT
OpenAIRouter.get('/', (req, res) => {

    ask(req.body.input).then(async stream => {
        for await (const chunk of stream) {
            res.write(chunk.text)
        }
        res.end()
    }).catch(e => console.log(e))
});


export default OpenAIRouter;