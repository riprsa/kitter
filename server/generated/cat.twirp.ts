import {
  TwirpContext,
  TwirpServer,
  RouterEvents,
  TwirpError,
  TwirpErrorCode,
  Interceptor,
  TwirpContentType,
  chainInterceptors,
} from "twirp-ts";
import {
  CreateCatRequest,
  CreateCatResponse,
  GetCatRequest,
  GetCatResponse,
} from "./cat";

//==================================//
//          Client Code             //
//==================================//

interface Rpc {
  request(
    service: string,
    method: string,
    contentType: "application/json" | "application/protobuf",
    data: object | Uint8Array
  ): Promise<object | Uint8Array>;
}

export interface CatterClient {
  RegisterCat(request: CreateCatRequest): Promise<CreateCatResponse>;
  GetCat(request: GetCatRequest): Promise<GetCatResponse>;
}

export class CatterClientJSON implements CatterClient {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.RegisterCat.bind(this);
    this.GetCat.bind(this);
  }
  RegisterCat(request: CreateCatRequest): Promise<CreateCatResponse> {
    const data = CreateCatRequest.toJson(request, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    });
    const promise = this.rpc.request(
      "spec.Catter",
      "RegisterCat",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      CreateCatResponse.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }

  GetCat(request: GetCatRequest): Promise<GetCatResponse> {
    const data = GetCatRequest.toJson(request, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    });
    const promise = this.rpc.request(
      "spec.Catter",
      "GetCat",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      GetCatResponse.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }
}

export class CatterClientProtobuf implements CatterClient {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.RegisterCat.bind(this);
    this.GetCat.bind(this);
  }
  RegisterCat(request: CreateCatRequest): Promise<CreateCatResponse> {
    const data = CreateCatRequest.toBinary(request);
    const promise = this.rpc.request(
      "spec.Catter",
      "RegisterCat",
      "application/protobuf",
      data
    );
    return promise.then((data) =>
      CreateCatResponse.fromBinary(data as Uint8Array)
    );
  }

  GetCat(request: GetCatRequest): Promise<GetCatResponse> {
    const data = GetCatRequest.toBinary(request);
    const promise = this.rpc.request(
      "spec.Catter",
      "GetCat",
      "application/protobuf",
      data
    );
    return promise.then((data) =>
      GetCatResponse.fromBinary(data as Uint8Array)
    );
  }
}

//==================================//
//          Server Code             //
//==================================//

export interface CatterTwirp<T extends TwirpContext = TwirpContext> {
  RegisterCat(ctx: T, request: CreateCatRequest): Promise<CreateCatResponse>;
  GetCat(ctx: T, request: GetCatRequest): Promise<GetCatResponse>;
}

export enum CatterMethod {
  RegisterCat = "RegisterCat",
  GetCat = "GetCat",
}

export const CatterMethodList = [CatterMethod.RegisterCat, CatterMethod.GetCat];

export function createCatterServer<T extends TwirpContext = TwirpContext>(
  service: CatterTwirp<T>
) {
  return new TwirpServer<CatterTwirp, T>({
    service,
    packageName: "spec",
    serviceName: "Catter",
    methodList: CatterMethodList,
    matchRoute: matchCatterRoute,
  });
}

function matchCatterRoute<T extends TwirpContext = TwirpContext>(
  method: string,
  events: RouterEvents<T>
) {
  switch (method) {
    case "RegisterCat":
      return async (
        ctx: T,
        service: CatterTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, CreateCatRequest, CreateCatResponse>[]
      ) => {
        ctx = { ...ctx, methodName: "RegisterCat" };
        await events.onMatch(ctx);
        return handleCatterRegisterCatRequest(ctx, service, data, interceptors);
      };
    case "GetCat":
      return async (
        ctx: T,
        service: CatterTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, GetCatRequest, GetCatResponse>[]
      ) => {
        ctx = { ...ctx, methodName: "GetCat" };
        await events.onMatch(ctx);
        return handleCatterGetCatRequest(ctx, service, data, interceptors);
      };
    default:
      events.onNotFound();
      const msg = `no handler found`;
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleCatterRegisterCatRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: CatterTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, CreateCatRequest, CreateCatResponse>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleCatterRegisterCatJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleCatterRegisterCatProtobuf<T>(
        ctx,
        service,
        data,
        interceptors
      );
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleCatterGetCatRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: CatterTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, GetCatRequest, GetCatResponse>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleCatterGetCatJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleCatterGetCatProtobuf<T>(ctx, service, data, interceptors);
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}
async function handleCatterRegisterCatJSON<
  T extends TwirpContext = TwirpContext
>(
  ctx: T,
  service: CatterTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, CreateCatRequest, CreateCatResponse>[]
) {
  let request: CreateCatRequest;
  let response: CreateCatResponse;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = CreateCatRequest.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the json request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      CreateCatRequest,
      CreateCatResponse
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.RegisterCat(ctx, inputReq);
    });
  } else {
    response = await service.RegisterCat(ctx, request!);
  }

  return JSON.stringify(
    CreateCatResponse.toJson(response, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    }) as string
  );
}

async function handleCatterGetCatJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: CatterTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, GetCatRequest, GetCatResponse>[]
) {
  let request: GetCatRequest;
  let response: GetCatResponse;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = GetCatRequest.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the json request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      GetCatRequest,
      GetCatResponse
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.GetCat(ctx, inputReq);
    });
  } else {
    response = await service.GetCat(ctx, request!);
  }

  return JSON.stringify(
    GetCatResponse.toJson(response, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    }) as string
  );
}
async function handleCatterRegisterCatProtobuf<
  T extends TwirpContext = TwirpContext
>(
  ctx: T,
  service: CatterTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, CreateCatRequest, CreateCatResponse>[]
) {
  let request: CreateCatRequest;
  let response: CreateCatResponse;

  try {
    request = CreateCatRequest.fromBinary(data);
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the protobuf request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      CreateCatRequest,
      CreateCatResponse
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.RegisterCat(ctx, inputReq);
    });
  } else {
    response = await service.RegisterCat(ctx, request!);
  }

  return Buffer.from(CreateCatResponse.toBinary(response));
}

async function handleCatterGetCatProtobuf<
  T extends TwirpContext = TwirpContext
>(
  ctx: T,
  service: CatterTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, GetCatRequest, GetCatResponse>[]
) {
  let request: GetCatRequest;
  let response: GetCatResponse;

  try {
    request = GetCatRequest.fromBinary(data);
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the protobuf request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      GetCatRequest,
      GetCatResponse
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.GetCat(ctx, inputReq);
    });
  } else {
    response = await service.GetCat(ctx, request!);
  }

  return Buffer.from(GetCatResponse.toBinary(response));
}
