import { fetch } from 'cross-fetch';
import * as mc from 'model-core';
import { KV } from '..';
import { KVStore } from 'model-core';

const kv = KVStore.current('model-client');

export type QueryParams = KV;
export type HeaderParams = KV;

const logger = mc.getLogger('fetch-util');

export const DefaultHeaderParams: HeaderParams = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

export type HttpMethod = ('GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD');

export const tryToQueryParamString = (queryParams: QueryParams): string => {
  return ((queryParams) ? (new URLSearchParams(queryParams)).toString() : '');
}

export abstract class RequestParams {
  private readonly _method: HttpMethod;
  private readonly _url: string;
  private readonly _queryString: QueryParams;
  private readonly _headers: HeaderParams;
  private readonly _throwOnError: boolean;
  private readonly _bodyParams: any;

  protected constructor(method: HttpMethod, url: string, bodyParams: any = null, queryStringParams: QueryParams, headerParams: HeaderParams = DefaultHeaderParams, throwError = true) {
    this._method = method;
    this._url = url;
    this._bodyParams = bodyParams;
    this._queryString = queryStringParams;
    this._headers = headerParams;
    this._throwOnError = throwError;
  }

  public get url(): string {
    const baseUrl = ((kv.isTesting) ? `http://localhost:3000${this._url}` : this._url);

    if (this.hasQueryString) {
      return `${baseUrl}?${tryToQueryParamString(this.queryString)}`;
    }

    return baseUrl;
  }

  public get method(): HttpMethod {
    return (this._method || null);
  }

  public get isGet(): boolean {
    return (this.method === 'GET');
  }

  public get isPost(): boolean {
    return (this.method === 'POST');
  }

  public get isPut(): boolean {
    return (this.method === 'PUT');
  }

  public get isPatch(): boolean {
    return (this.method === 'PATCH');
  }

  public get isHead(): boolean {
    return (this.method === 'HEAD');
  }

  public get bodyParams(): any {
    return this._bodyParams;
  }

  public get hasBody(): boolean {
    return Boolean(this.bodyParams);
  }

  public get body(): any {
    return (this.bodyParams || null);
  }

  public get bodyString(): any {
    return (this.bodyParams ? JSON.stringify(this.body) : '');
  }

  public get headers(): HeaderParams {
    return (this._headers || DefaultHeaderParams);
  }

  public get hasQueryString(): boolean {
    return Boolean((Object.keys(this._queryString || {})).length);
  }

  public get queryString(): QueryParams {
    return ((this.hasQueryString) ? this._queryString : {});
  }

  public get throwOnError(): boolean {
    return Boolean(this._throwOnError);
  }

  public toString(): string {
    return `method:=${this.method}, url:=${this.url}`;
  }
}

export class GetRequestParams extends RequestParams {
  constructor(url: string, queryStringParams: QueryParams = null, headerParams: HeaderParams = DefaultHeaderParams, throwError = true) {
    super('GET', url, null, queryStringParams, headerParams, throwError);
  }

  public static fromUrl(url: string): GetRequestParams {
    return (new GetRequestParams(url))
  }
}

export class HeadRequestParams extends RequestParams {
  constructor(url: string, queryStringParams: QueryParams = null, headerParams: HeaderParams = DefaultHeaderParams, throwError = true) {
    super('HEAD', url, null, queryStringParams, headerParams, throwError);
  }

  public static fromUrl(url: string): HeadRequestParams {
    return (new HeadRequestParams(url))
  }
}

export class PostRequestParams extends RequestParams {
  constructor(url: string, bodyParams: any = null, headerParams: HeaderParams = DefaultHeaderParams, throwError = true) {
    super('POST', url, bodyParams, null, headerParams, throwError)
  }
}

export class PutRequestParams extends RequestParams {
  constructor(url: string, bodyParams: any = null, headerParams: HeaderParams = DefaultHeaderParams, throwError = true) {
    super('PUT', url, bodyParams, null, headerParams, throwError)
  }
}

export class PatchRequestParams extends RequestParams {
  constructor(url: string, bodyParams: any = null, headerParams: HeaderParams = DefaultHeaderParams, throwError = true) {
    super('PATCH', url, bodyParams, null, headerParams, throwError)
  }
}

export class ExecResponse {
  constructor(public params: PostRequestParams, public value: Response, public error: any = null) {
  }
}

export const exec = async (params: RequestParams): Promise<ExecResponse> => {
  if (!params) {
    throw new Error('Failed to provide request parameters.');
  }

  const requestInit: RequestInit = {
    method: params.method,
    headers: params.headers
  };

  try {
    if ((params.isPost) && (params.hasBody)) {
      requestInit.body = (params as PostRequestParams).bodyString;
    }

    logger(`submitting request [${params.toString()}] ...`);

    const response: Response = (await fetch(params.url, requestInit));
        
    if ((!response.ok) && (params.throwOnError)) {
      const message = `Request failed (${params.toString()}).  A non-success error code (${response.status}) was returned!`;
      logger(message);
      throw new Error(message);
    }

    logger(`request succeeded [${params.toString()}]!`);

    return (new ExecResponse(params, response));
  }
  catch (ex) {
    if (!params.throwOnError) {
      return (new ExecResponse(params, null, ex));
    }
    
    throw ex;
  }
};