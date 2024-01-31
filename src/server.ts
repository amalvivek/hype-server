import "dotenv/config";
import express from 'express';
import routes from './routes.ts'
import cors from 'cors'


const app = express();
const port = 3000;

app.use(cors())
routes(app)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
