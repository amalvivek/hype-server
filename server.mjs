import "dotenv/config";
import express from "express";
import routes from "./routes.mjs"


const app = express();
const port = 3000;

routes(app)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
