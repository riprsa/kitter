# Cats Twitter

The purpose of this project is to demonstrate how to use gRPC with TypeScript. I have no experience with gRPC and TypeScript, so I would like to learn both technologies on the same project. As database I choose SQLite, because it is easy to use and removes pain with database management.

## How to run?

To generate the gRPC server, use following:

```bash
npx protoc --ts_opt=server_grpc1 --ts_out codegen/ --proto_path protos protos/cat.proto
```

To generate the gRPC client, use following:

```bash
npx protoc --ts_opt=client_grpc1 --ts_out codegen/ --proto_path protos protos/cat.proto
```
