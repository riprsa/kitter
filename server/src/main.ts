import cors from 'cors';
import express from "express";
import { server } from './server';

if (require.main === module) {
    const app = express();

    app.use(cors({
        origin: "*",
    }));

    app.post(server.matchingPath(), server.httpHandler());

    app.listen(8080, () => {
        console.log('Express server listening on port 8080');
    });
}