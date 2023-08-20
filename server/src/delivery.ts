import * as grpc from "@grpc/grpc-js";
import * as cat from "../codegen/cat";
import { ICatter } from "../codegen/cat.grpc-server";
import * as google from "../codegen/google/protobuf/empty";
import { Storage } from "./db";

const storage = new Storage();

async function registerCat(call: grpc.ServerUnaryCall<cat.CreateCatRequest, cat.CreateCatResponse>, callback: grpc.sendUnaryData<cat.CreateCatResponse>): Promise<void> {
    call.on('error', args => {
        console.log("grpc-server registerCat() got error:", args)
    })

    const id = await storage.insertCat(call.request).catch(
        (error) =>
            callback({ code: grpc.status.INTERNAL, details: 'database error' })
    );

    if (id) return callback(null, { id: id });

    return callback({ code: grpc.status.INTERNAL, details: 'id is not right, unlikely case' });
}

// async function getCat(call: grpc.ServerUnaryCall<cat.GetCatRequest, cat.GetCatResponse>, callback: grpc.sendUnaryData<cat.GetCatResponse>): Promise<void> {
//     call.on('error', args => {
//         console.log("grpc-server updateCatName() got error:", args)
//     })

//     let resp = await storage.selectCat(call.request.id).catch(error => {
//         console.log("grpc-server getCat() got error:", error)
//         return callback({ code: grpc.status.INTERNAL, details: 'database error' });
//     });

//     if (resp) return callback(null, resp);

//     console.log("grpc-server getCat() is OK:", resp)

//     callback({ code: grpc.status.INTERNAL, details: 'GetCatResponse is not right, unlikely case' });
// }

// async function updateCatName(call: grpc.ServerUnaryCall<cat.UpdateCatFieldRequest, google.Empty>, callback: grpc.sendUnaryData<google.Empty>): Promise<void> {
//     call.on('error', args => {
//         console.log("grpc-server updateCatName() got error:", args)
//     })
//     callback({ code: grpc.status.UNIMPLEMENTED, details: 'updateCatName is not ready' });
// }

async function updateCatBio(call: grpc.ServerUnaryCall<cat.UpdateCatFieldRequest, google.Empty>, callback: grpc.sendUnaryData<google.Empty>): Promise<void> {
    call.on('error', args => {
        console.log("grpc-server updateCatName() got error:", args)
    })
    callback({ code: grpc.status.UNIMPLEMENTED, details: 'updateCatBio is not ready' });
}

export const gRPCCatService: ICatter = {
    registerCat,
    updateCatName,
    updateCatBio,
    getCat,
};