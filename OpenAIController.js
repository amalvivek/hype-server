import express from 'express';
import {ask} from "./OpenAIAgent.js";

const OpenAIRouter = express.Router();


// Get response from Cohere
OpenAIRouter.get('/', (req, res) => {

    ask(req.body.input).then(async stream => {
        // let streamedResult = "";
        for await (const chunk of stream) {
            // streamedResult += chunk;
            console.log(chunk);
            res.write(chunk)
        }
        res.end()
    }).catch(e => console.log(e))
    res.json()
});


export default OpenAIRouter;