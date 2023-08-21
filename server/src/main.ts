import cors from 'cors';
import express from "express";
import { stringify } from 'querystring';
import { TwirpContext, TwirpErrorCode, httpStatusFromErrorCode } from "twirp-ts";
import { GetCatRequest, GetCatResponse, LoginCatRequest, LoginCatResponse, RegisterCatRequest, RegisterCatResponse } from "./../generated/cat";
import { createCatterServer } from "./../generated/cat.twirp";
import { Storage } from "./db";

let storage = new Storage();

const server = createCatterServer({
    async GetCat(ctx: TwirpContext, request: GetCatRequest): Promise<GetCatResponse> {
        let resp = await storage.selectCat(request.id);
        console.log(resp);
        return resp;
    },

    async Register(ctx: TwirpContext, request: RegisterCatRequest): Promise<RegisterCatResponse> {
        let resp = await storage.insertCat(request);
        console.log(resp);
        return GetCatResponse.create({
            id: resp,
        });
    },

    async Login(ctx: TwirpContext, request: LoginCatRequest): Promise<LoginCatResponse> {
        let id = 0;
        await storage.findCat(request.username).catch(
            error => {
                ctx.res.statusCode = httpStatusFromErrorCode(TwirpErrorCode.NotFound);
                ctx.res.statusMessage = stringify(error);
            }
        ).then(
            cat => {
                if (cat && cat.password === request.password) {
                    id = cat.id;
                }
                ctx.res.statusCode = httpStatusFromErrorCode(TwirpErrorCode.NotFound);
                ctx.res.statusMessage = "cat is undefined";
            }
        );



        if (id == 0) {
            ctx.res.statusCode = httpStatusFromErrorCode(TwirpErrorCode.NotFound);
            ctx.res.statusMessage = "id was not set";


        }

        return {
            id: id,
        }
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

