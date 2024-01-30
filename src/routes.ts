import express, {Express} from "express";
import OpenAIRouter from "./OpenAIController.ts";
import {NextFunction, Request, Response} from "express-serve-static-core";

export default function (app: Express) {

    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('Hello World');
    });

    app.use("/openai", OpenAIRouter)

    app.get('*', (req, res) => {
        res.status(404).send('<h1>error 404 not found</h1>');
    })

    app.use((error: any, req: Request, res: Response, next: NextFunction) => {
        if (error) {
            res.send('500 OOPS :( Something went wrong... Please try again. ')
        }
    })
}
