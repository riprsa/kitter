import cors from 'cors';
import express from "express";
import { TwirpContext } from "twirp-ts";
import { GetCatRequest, GetCatResponse } from "./../generated/cat";
import { createCatterServer } from "./../generated/cat.twirp";


const server = createCatterServer({
    async GetCat(ctx: TwirpContext, request: GetCatRequest): Promise<GetCatResponse> {
        // ctx.res.setHeader('Access-Control-Allow-Origin', '*');
        let cat = GetCatResponse.create({
            id: 1,
            name: "kitten",
            username: "kitten1",
            bio: "silly cat!1",
        });
        console.log(request.id);
        return cat;
    },
});

server.withPrefix("/api");

const app = express();

app.use(cors({
    origin: "*",
}));

app.post(server.matchingPath(), server.httpHandler());

app.listen(8080, () => {
    console.log('Express server listening on port 8080');
});

