import { ChannelCredentials } from "@grpc/grpc-js";
import { CreateCatRequest } from "../codegen/cat";
import { CatterClient, ICatterClient } from "./../codegen/cat.grpc-client";

class Client {
    client: ICatterClient;
    constructor(host: string) {
        this.client = new CatterClient(
            host,
            ChannelCredentials.createInsecure(),
            {},
            {}
        );
    }

    registerCat(req: CreateCatRequest) {
        console.log(`### calling method "registerCat"...`)

        const call = this.client.registerCat(
            req,
            (err, value) => {
                if (err) {
                    console.log("got err: ", err.message)
                }
                if (value) {
                    console.log("got response message: ", value)
                }
            },
        );

        call.on('metadata', arg1 => {
            console.log("got response headers: ", arg1)
        });

        call.on('status', arg1 => {
            console.log("got status: ", arg1)
        });

        return new Promise<void>(resolve => {
            call.on('status', () => resolve());
        });
    }
}

async function main() {
    const client = new Client("localhost:8080");

    let cat = CreateCatRequest.create({
        name: "duwevo",
        username: "duwevo",
        bio: "cool cat a cat",
    });

    await client.registerCat(cat);
}

if (require.main === module) {
    main().catch(e => console.error(e)).finally(() => process.exit());
}

