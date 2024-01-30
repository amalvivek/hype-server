import express from "express";
import CohereAgent from "./CohereAgent.mjs";
import OpenAIRouter from "./OpenAIController.js";

export default function (app) {

    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('Hello World');
    });

    app.use("/cohere", CohereAgent);

    app.use("/openai", OpenAIRouter)

    app.get('*', (req, res) => {
        res.status(404).send('<h1>error 404 not found</h1>');
    })

    app.use((error, req, res, next) => {
        if (error) {
            res.send('500 OOPS :( Something went wrong... Please try again. ')
        }
    })

}
