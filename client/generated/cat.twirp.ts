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
import { GetCatRequest, GetCatResponse } from "./cat";

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
  GetCat(request: GetCatRequest): Promise<GetCatResponse>;
}

export class CatterClientJSON implements CatterClient {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.GetCat.bind(this);
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
    this.GetCat.bind(this);
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
  GetCat(ctx: T, request: GetCatRequest): Promise<GetCatResponse>;
}

export enum CatterMethod {
  GetCat = "GetCat",
}

export const CatterMethodList = [CatterMethod.GetCat];

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
