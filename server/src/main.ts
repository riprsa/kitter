import cors from 'cors';
import express from "express";
import { TwirpContext } from "twirp-ts";
import { CreateCatRequest, GetCatRequest, GetCatResponse } from "./../generated/cat";
import { createCatterServer } from "./../generated/cat.twirp";
import { Storage } from "./db";

let storage = new Storage();

const server = createCatterServer({
    async GetCat(ctx: TwirpContext, request: GetCatRequest): Promise<GetCatResponse> {
        let resp = await storage.selectCat(request.id);
        console.log(resp);
        return resp;
    },

    async RegisterCat(ctx: TwirpContext, request: CreateCatRequest): Promise<GetCatResponse> {
        let resp = await storage.insertCat(request);
        console.log(resp);
        return GetCatResponse.create({
            id: resp,
        });
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

