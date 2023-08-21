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
  RegisterCatRequest,
  RegisterCatResponse,
  LoginCatRequest,
  LoginCatResponse,
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
  Register(request: RegisterCatRequest): Promise<RegisterCatResponse>;
  Login(request: LoginCatRequest): Promise<LoginCatResponse>;
  GetCat(request: GetCatRequest): Promise<GetCatResponse>;
}

export class CatterClientJSON implements CatterClient {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Register.bind(this);
    this.Login.bind(this);
    this.GetCat.bind(this);
  }
  Register(request: RegisterCatRequest): Promise<RegisterCatResponse> {
    const data = RegisterCatRequest.toJson(request, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    });
    const promise = this.rpc.request(
      "spec.Catter",
      "Register",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      RegisterCatResponse.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }

  Login(request: LoginCatRequest): Promise<LoginCatResponse> {
    const data = LoginCatRequest.toJson(request, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    });
    const promise = this.rpc.request(
      "spec.Catter",
      "Login",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      LoginCatResponse.fromJson(data as any, { ignoreUnknownFields: true })
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
    this.Register.bind(this);
    this.Login.bind(this);
    this.GetCat.bind(this);
  }
  Register(request: RegisterCatRequest): Promise<RegisterCatResponse> {
    const data = RegisterCatRequest.toBinary(request);
    const promise = this.rpc.request(
      "spec.Catter",
      "Register",
      "application/protobuf",
      data
    );
    return promise.then((data) =>
      RegisterCatResponse.fromBinary(data as Uint8Array)
    );
  }

  Login(request: LoginCatRequest): Promise<LoginCatResponse> {
    const data = LoginCatRequest.toBinary(request);
    const promise = this.rpc.request(
      "spec.Catter",
      "Login",
      "application/protobuf",
      data
    );
    return promise.then((data) =>
      LoginCatResponse.fromBinary(data as Uint8Array)
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
  Register(ctx: T, request: RegisterCatRequest): Promise<RegisterCatResponse>;
  Login(ctx: T, request: LoginCatRequest): Promise<LoginCatResponse>;
  GetCat(ctx: T, request: GetCatRequest): Promise<GetCatResponse>;
}

export enum CatterMethod {
  Register = "Register",
  Login = "Login",
  GetCat = "GetCat",
}

export const CatterMethodList = [
  CatterMethod.Register,
  CatterMethod.Login,
  CatterMethod.GetCat,
];

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
    case "Register":
      return async (
        ctx: T,
        service: CatterTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, RegisterCatRequest, RegisterCatResponse>[]
      ) => {
        ctx = { ...ctx, methodName: "Register" };
        await events.onMatch(ctx);
        return handleCatterRegisterRequest(ctx, service, data, interceptors);
      };
    case "Login":
      return async (
        ctx: T,
        service: CatterTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, LoginCatRequest, LoginCatResponse>[]
      ) => {
        ctx = { ...ctx, methodName: "Login" };
        await events.onMatch(ctx);
        return handleCatterLoginRequest(ctx, service, data, interceptors);
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

function handleCatterRegisterRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: CatterTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, RegisterCatRequest, RegisterCatResponse>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleCatterRegisterJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleCatterRegisterProtobuf<T>(ctx, service, data, interceptors);
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleCatterLoginRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: CatterTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, LoginCatRequest, LoginCatResponse>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleCatterLoginJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleCatterLoginProtobuf<T>(ctx, service, data, interceptors);
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
async function handleCatterRegisterJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: CatterTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, RegisterCatRequest, RegisterCatResponse>[]
) {
  let request: RegisterCatRequest;
  let response: RegisterCatResponse;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = RegisterCatRequest.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the json request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      RegisterCatRequest,
      RegisterCatResponse
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.Register(ctx, inputReq);
    });
  } else {
    response = await service.Register(ctx, request!);
  }

  return JSON.stringify(
    RegisterCatResponse.toJson(response, {
      useProtoFieldName: true,
      emitDefaultValues: false,
    }) as string
  );
}

async function handleCatterLoginJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: CatterTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, LoginCatRequest, LoginCatResponse>[]
) {
  let request: LoginCatRequest;
  let response: LoginCatResponse;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = LoginCatRequest.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the json request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      LoginCatRequest,
      LoginCatResponse
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.Login(ctx, inputReq);
    });
  } else {
    response = await service.Login(ctx, request!);
  }

  return JSON.stringify(
    LoginCatResponse.toJson(response, {
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
async function handleCatterRegisterProtobuf<
  T extends TwirpContext = TwirpContext
>(
  ctx: T,
  service: CatterTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, RegisterCatRequest, RegisterCatResponse>[]
) {
  let request: RegisterCatRequest;
  let response: RegisterCatResponse;

  try {
    request = RegisterCatRequest.fromBinary(data);
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the protobuf request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      RegisterCatRequest,
      RegisterCatResponse
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.Register(ctx, inputReq);
    });
  } else {
    response = await service.Register(ctx, request!);
  }

  return Buffer.from(RegisterCatResponse.toBinary(response));
}

async function handleCatterLoginProtobuf<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: CatterTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, LoginCatRequest, LoginCatResponse>[]
) {
  let request: LoginCatRequest;
  let response: LoginCatResponse;

  try {
    request = LoginCatRequest.fromBinary(data);
  } catch (e) {
    if (e instanceof Error) {
      const msg = "the protobuf request could not be decoded";
      throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
    }
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      LoginCatRequest,
      LoginCatResponse
    >;
    response = await interceptor(ctx, request!, (ctx, inputReq) => {
      return service.Login(ctx, inputReq);
    });
  } else {
    response = await service.Login(ctx, request!);
  }

  return Buffer.from(LoginCatResponse.toBinary(response));
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
