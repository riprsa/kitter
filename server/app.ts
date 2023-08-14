import * as grpc from "@grpc/grpc-js";
import * as cat from "./../codegen/cat";
import { catterDefinition, ICatter } from "./../codegen/cat.grpc-server";
import { Storage } from "./db";

const storage = new Storage();

async function registerCat(call: grpc.ServerUnaryCall<cat.CreateCatRequest, cat.CreateCatResponse>, callback: grpc.sendUnaryData<cat.CreateCatResponse>): Promise<void> {
    call.on('error', args => {
        console.log("grpc-server registerCat() got error:", args)
    })

    let id = await storage.insertCat(call.request)
        .catch(error => { callback(error, null) });

    if (id) return callback(null, { id: BigInt(id) });
    return callback({ code: grpc.status.INTERNAL, details: 'id is not right, unlikely case' });
}

function updateCatName(call: grpc.ServerUnaryCall<cat.UpdateCatFieldRequest, cat.Response>, callback: grpc.sendUnaryData<cat.Response>): void {
    call.on('error', args => {
        console.log("grpc-server updateCatName() got error:", args)
    })
    const resp = cat.Response.create({
        code: 500,
        message: "not implemented",
    });
    callback(null, resp);
}

function updateCatBio(call: grpc.ServerUnaryCall<cat.UpdateCatFieldRequest, cat.Response>, callback: grpc.sendUnaryData<cat.Response>): void {
    call.on('error', args => {
        console.log("grpc-server updateCatBio() got error:", args)
    })
    const resp = cat.Response.create({
        code: 500,
        message: "not implemented",
    });
    callback(null, resp);
}

const CatService: ICatter = {
    registerCat,
    updateCatName,
    updateCatBio,
};

if (require.main === module) {
    let grpcServer = new grpc.Server();

    grpcServer.addService(catterDefinition, CatService);

    grpcServer.bindAsync(
        '127.0.0.1:8080',
        grpc.ServerCredentials.createInsecure(),
        (err: Error | null, port: number) => {
            if (err) {
                console.error(`Server error: ${err.message}`);
            } else {
                console.log(`Server bound on port: ${port}`);
                grpcServer.start();
            }
        },
    );
}
