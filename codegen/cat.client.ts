// @generated by protobuf-ts 2.9.1 with parameter server_grpc1
// @generated from protobuf file "cat.proto" (package "spec", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Catter } from "./cat";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { CreateCatResponse } from "./cat";
import type { CreateCatRequest } from "./cat";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service spec.Catter
 */
export interface ICatterClient {
    /**
     * RegisterCat creates a cat by CreateCatRequest data
     *
     * @generated from protobuf rpc: RegisterCat(spec.CreateCatRequest) returns (spec.CreateCatResponse);
     */
    registerCat(input: CreateCatRequest, options?: RpcOptions): UnaryCall<CreateCatRequest, CreateCatResponse>;
}
/**
 * @generated from protobuf service spec.Catter
 */
export class CatterClient implements ICatterClient, ServiceInfo {
    typeName = Catter.typeName;
    methods = Catter.methods;
    options = Catter.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * RegisterCat creates a cat by CreateCatRequest data
     *
     * @generated from protobuf rpc: RegisterCat(spec.CreateCatRequest) returns (spec.CreateCatResponse);
     */
    registerCat(input: CreateCatRequest, options?: RpcOptions): UnaryCall<CreateCatRequest, CreateCatResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<CreateCatRequest, CreateCatResponse>("unary", this._transport, method, opt, input);
    }
}
