import * as grpc from "@grpc/grpc-js";
import * as cat from "./../codegen/cat";
import { catterDefinition, ICatter } from "./../codegen/cat.grpc-server";

function registerCat(call: grpc.ServerUnaryCall<cat.CreateCatRequest, cat.CreateCatResponse>, callback: grpc.sendUnaryData<cat.CreateCatResponse>): void {
    call.on('error', args => {
        console.log("grpc-server registerCat() got error:", args)
    })

    const catResp = cat.CreateCatResponse.create({
        id: BigInt(3),
    });

    callback(null, catResp);
}

class CatService implements ICatter {
    constructor() {
        // TODO: db logic
    }
    [name: string]: grpc.UntypedHandleCall;

    registerCat(call: grpc.ServerUnaryCall<cat.CreateCatRequest, cat.CreateCatResponse>, callback: grpc.sendUnaryData<cat.CreateCatResponse>): void {
        call.on('error', args => {
            console.log("grpc-server registerCat() got error:", args)
        })
        const catResp = cat.CreateCatResponse.create({
            id: BigInt(3),
        });
        callback(null, catResp);
    }
}

if (require.main === module) {
    let grpcServer = new grpc.Server();

    let catService: ICatter = new CatService();

    grpcServer.addService(catterDefinition, catService);

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
