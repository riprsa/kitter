import { TwirpError, TwirpErrorCode } from "twirp-ts";
import * as gen from "./../generated/cat";
import { createCatterServer } from "./../generated/cat.twirp";
import { Storage } from "./db";

const storage = new Storage();

export const server = createCatterServer({
    async GetCat(ctx, request: gen.GetCatRequest): Promise<gen.GetCatResponse> {
        try {
            var dbCat = await storage.selectCat(request.id);
        } catch (error) {
            throw new TwirpError(TwirpErrorCode.NotFound, error);
        }

        if (!dbCat) {
            throw new TwirpError(TwirpErrorCode.Internal, "impossible database record");
        }

        return gen.GetCatResponse.create({
            id: dbCat.id,
            name: dbCat.name,
            username: dbCat.username,
            bio: dbCat.bio
        });
    },

    async Register(ctx, request: gen.RegisterCatRequest): Promise<gen.RegisterCatResponse> {
        try {
            var id = await storage.insertCat(request);
        } catch (error) {
            throw new TwirpError(TwirpErrorCode.NotFound, error);
        }

        if (id < 1) {
            throw new TwirpError(TwirpErrorCode.Internal, "impossible database record");
        }

        return gen.GetCatResponse.create({
            id: id,
        });
    },

    async Login(ctx, request: gen.LoginCatRequest): Promise<gen.LoginCatResponse> {
        try {
            var dbCat = await storage.findCat(request.username);
        } catch (error) {
            throw new TwirpError(TwirpErrorCode.NotFound, error);
        }

        if (!dbCat || dbCat.password != request.password) {
            throw new TwirpError(TwirpErrorCode.PermissionDenied, "wrong password");
        }

        if (dbCat.id <= 0) {
            throw new TwirpError(TwirpErrorCode.Internal, "impossible database record");
        }

        return gen.LoginCatResponse.create({
            id: dbCat.id
        });
    },

    async CreateKitt(ctx, request: gen.CreateKittRequest): Promise<gen.CreateKittResponse> {
        try {
            var id = await storage.insertKitt({
                content: request.content,
                cat_id: request.catId,
            });
        } catch (error) {
            throw new TwirpError(TwirpErrorCode.NotFound, error);
        }

        return gen.GetKittResponse.create({
            id: id,
        });
    },

    async GetKitt(ctx, request: gen.GetKittRequest): Promise<gen.GetKittResponse> {
        try {
            var dbKitt = await storage.selectKitt(request.id)
        } catch (error) {
            throw new TwirpError(TwirpErrorCode.NotFound, error);
        }

        if (!dbKitt) {
            throw new TwirpError(TwirpErrorCode.Internal, "impossible database record");
        }

        return gen.GetKittResponse.create({
            id: dbKitt.id,
            content: dbKitt.content,
            createdAt: dbKitt.created_at,
            catId: dbKitt.cat_id,
        });
    },

    async ListKitts(ctx, request: gen.ListKittsRequest): Promise<gen.ListKittsResponse> {
        try {
            var dbKitts = await storage.selectKittsByCatId(request.catId);
        } catch (error) {
            throw new TwirpError(TwirpErrorCode.NotFound, error);
        }

        if (!dbKitts) {
            throw new TwirpError(TwirpErrorCode.Internal, "impossible database record");
        }

        let kittList: gen.GetKittResponse[] = [];

        dbKitts.forEach(element => {
            let kitt = gen.GetKittResponse.create({
                id: element.id,
                content: element.content,
                createdAt: element.created_at,
                catId: element.cat_id,
            });
            kittList.push(kitt);
        });

        return gen.ListKittsResponse.create({
            kitts: kittList,
        });
    }
});

server.withPrefix("/api");