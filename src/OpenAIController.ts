import express from 'express';
import {ask} from "./OpenAIAgent.ts";

const OpenAIRouter = express.Router();


// Get response from ChatGPT
OpenAIRouter.post('/', (req, res) => {

    ask(req.body.input).then(async stream => {
        res.setHeader('Content-Type', 'text/event-stream');
        let i = 0
        for await (const chunk of stream) {
            i += 1
            console.log('[LOGGING] Chunk ' + i + ' - ', chunk.text)
            res.write(chunk.text)
        }
        res.end()
    }).catch(e => console.log(e))
});


export default OpenAIRouter;