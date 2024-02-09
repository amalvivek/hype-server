import express, {Express, Request, Response} from 'express';
import {addFileContext, ask} from "./OpenAIAgent.js";
import {FileData} from "./shared.types.js";
import multer from "multer";

const OpenAIRouter = express.Router();


// Get response from ChatGPT
OpenAIRouter.post('/', (req, res) => {
    ask(req.body.input).then(async stream => {
        res.setHeader('Content-Type', 'text/event-stream');
        let i = 0
        for await (const chunk of stream) {
            i += 1
            console.log('[LOGGING] Chunk ' + i + ' - ', chunk)
            res.write(chunk)
        }
        res.end()
    }).catch(e => console.log(e))
});

const upload = multer();
// Endpoint for handling file uploads
OpenAIRouter.post('/upload', upload.array('files'), (req: Request, res: Response) => {
    console.log(req.files)
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const fileData: FileData[] = (req.files as Express.Multer.File[]).map((file: Express.Multer.File) => ({
        data: file.buffer,
        contentType: file.mimetype
    }));


    addFileContext(fileData).then(async stream => {
        res.setHeader('Content-Type', 'text/event-stream');
        let i = 0
        for await (const chunk of stream) {
            i += 1
            console.log('[LOGGING] Chunk ' + i + ' - ', chunk)
            res.write(chunk)
        }
        res.end()
    }).catch(e => console.log(e))
});


export default OpenAIRouter;