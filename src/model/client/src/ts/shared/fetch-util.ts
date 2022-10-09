import { fetch } from 'cross-fetch';
import { KV, KVStore, getLogger } from '..';

const kv = KVStore.current('model-client');

export type QueryParams = KV;
export type HeaderParams = KV;

const logger = getLogger('fetch-util');

export const DefaultHeaderParams: HeaderParams = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

export type HttpMethod = ('GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE');
export type HttpMethodPersist = ('POST' | 'PUT' | 'PATCH' | 'DELETE');

const tryToRecord = (params: QueryParams | null): Record<string, string> => {
  const rec: Record<string, string> = {};

  if (!params) {
    return rec;
  }

  Object.keys((params || {})).forEach((k) => {
    const val = params[k];
    rec[k] = ((val != null) ? val.toString() : '');
  });

  return rec;
}

export const tryToQueryParamString = (queryParams: QueryParams): (string | '') => {
  if (!queryParams) {
    return '';
  }

  return (new URLSearchParams(tryToRecord(queryParams)).toString());
};

export abstract class RequestParams {
  private readonly _method: HttpMethod;
  private readonly _url: string;
  private readonly _queryString: QueryParams;
  private readonly _headers: HeaderParams;
  private readonly _throwOnError: boolean;
  private readonly _bodyParams: any;

  protected constructor(method: HttpMethod, url: string, bodyParams: any = null, queryStringParams: (QueryParams | null), headerParams: HeaderParams = DefaultHeaderParams, throwError = true) {
    this._method = method;
    this._url = url;
    this._bodyParams = bodyParams;
    this._queryString = (queryStringParams || {});
    this._headers = headerParams;
    this._throwOnError = throwError;
  }

  public get url(): string {
    const baseUrl = kv.isTesting ? `http://localhost:3000${this._url}` : this._url;

    if (this.hasQueryString) {
      return `${baseUrl}?${tryToQueryParamString(this.queryString)}`;
    }

    return baseUrl;
  }

  public get method(): HttpMethod {
    return this._method || null;
  }

  public get isGet(): boolean {
    return this.method === 'GET';
  }

  public get isPost(): boolean {
    return this.method === 'POST';
  }

  public get isPut(): boolean {
    return this.method === 'PUT';
  }

  public get isPatch(): boolean {
    return this.method === 'PATCH';
  }

  public get isBodyApplicable(): boolean {
    return this.isPost || this.isPatch || this.isPut;
  }

  public get isHead(): boolean {
    return this.method === 'HEAD';
  }

  public get bodyParams(): any {
    return this._bodyParams;
  }

  public get hasBody(): boolean {
    return Boolean(this.bodyParams);
  }

  public get body(): any {
    return this.bodyParams || null;
  }

  public get bodyString(): any {
    return this.bodyParams ? JSON.stringify(this.body) : '';
  }

  public get headers(): HeaderParams {
    return this._headers || DefaultHeaderParams;
  }

  public get hasQueryString(): boolean {
    return Boolean(Object.keys(this._queryString || {}).length);
  }

  public get queryString(): QueryParams {
    return this.hasQueryString ? this._queryString : {};
  }

  public get throwOnError(): boolean {
    return Boolean(this._throwOnError);
  }

  public static createModParams(method: HttpMethodPersist, url: string, bodyParams: any = null): RequestParams {
    if (method === 'POST') {
      return (new PostRequestParams(url, bodyParams));
    }

    if (method === 'PUT') {
      return (new PutRequestParams(url, bodyParams));
    }

    if (method === 'PATCH') {
      return (new PatchRequestParams(url, bodyParams));
    }

    if (method === 'DELETE') {
      return (new DeleteRequestParams(url, bodyParams));
    }

    throw new Error(`Failed to create 'RequestParams' given the method (${method}) provided.`);
  }

  public static createQueryParams(method: ('GET'), url: string, queryStringParams: QueryParams = {}): RequestParams {
    if (method === 'GET') {
      return (new GetRequestParams(url, queryStringParams));
    }

    throw new Error(`Failed to create 'RequestParams' given the method (${method}) provided.`);
  }

  public toString(): string {
    return `method:=${this.method}, url:=${this.url}, body:=${this.bodyString}`;
  }
}

export class GetRequestParams extends RequestParams {
  constructor(url: string, queryStringParams: (QueryParams | null) = null, headerParams: HeaderParams = DefaultHeaderParams, throwError = true) {
    super('GET', url, null, queryStringParams, headerParams, throwError);
  }

  public static fromUrl(url: string): GetRequestParams {
    return new GetRequestParams(url);
  }
}

export class HeadRequestParams extends RequestParams {
  constructor(url: string, queryStringParams: (QueryParams | null) = null, headerParams: HeaderParams = DefaultHeaderParams, throwError = true) {
    super('HEAD', url, null, queryStringParams, headerParams, throwError);
  }

  public static fromUrl(url: string): HeadRequestParams {
    return new HeadRequestParams(url);
  }
}

export class PostRequestParams extends RequestParams {
  constructor(url: string, bodyParams: any = null, headerParams: HeaderParams = DefaultHeaderParams, throwError = true) {
    super('POST', url, bodyParams, null, headerParams, throwError);
  }
}

export class PutRequestParams extends RequestParams {
  constructor(url: string, bodyParams: any = null, headerParams: HeaderParams = DefaultHeaderParams, throwError = true) {
    super('PUT', url, bodyParams, null, headerParams, throwError);
  }
}

export class PatchRequestParams extends RequestParams {
  constructor(url: string, bodyParams: any = null, headerParams: HeaderParams = DefaultHeaderParams, throwError = true) {
    super('PATCH', url, bodyParams, null, headerParams, throwError);
  }
}

export class DeleteRequestParams extends RequestParams {
  constructor(url: string, bodyParams: any = null, headerParams: HeaderParams = DefaultHeaderParams, throwError = true) {
    super('DELETE', url, bodyParams, null, headerParams, throwError)
  }
}

export class ExecResponse {
  constructor(public params: PostRequestParams, public value: Response, public error: any = null) { }
}

export const exec = async (params: RequestParams): Promise<ExecResponse> => {
  if (!params) {
    throw new Error('Failed to provide request parameters.');
  }

  const requestInit: RequestInit = {
    method: params.method,
    headers: tryToRecord(params.headers)
  };

  try {
    if (params.isBodyApplicable && params.hasBody) {
      const bodyString = (params as PostRequestParams).bodyString;
      logger(`setting body of request [${bodyString}] ...`);
      requestInit.body = bodyString;
    }

    logger(`submitting request [${params.toString()}] ...`);

    const response: Response = await fetch(params.url, requestInit);

    if (!response.ok && params.throwOnError) {
      const message = `Request failed (${params.toString()}).  A non-success error code (${response.status}) was returned!`;
      logger(message);
      throw new Error(message);
    }

    logger(`request succeeded [headers:=${JSON.stringify(response.headers)}, params:=${params.toString()}]!`);

    return new ExecResponse(params, response);
  }
  catch (ex) {
    if (!params.throwOnError) {
      return new ExecResponse(params, new Response(), ex);
    }

    throw ex;
  }
}

// function async toJson<T>(response: ExecResponse, url: string): Promise<T> {
//   try {
//     logger(`converting response to json (url:=${url}) ...`);
//     const json = (await response.value.json());
//     return (json as T);
//   }
//   catch (error) {
//     logger(`failed to convert response to JSON (url:=${url}, error:=${error})`);
//     throw error;
//   }
// }

async function toJson<T>(response: ExecResponse, url: string): Promise<T> {
  try {
    if (!response) {
      throw new Error(`response is null or undefined`);
    }

    logger(`converting response to json (url:=${url}) ...`);
    const json = (await response.value?.json());
    return (json as T);
  }
  catch (error) {
    logger(`failed to convert response to JSON (url:=${url}, error:=${error})`);
    throw error;
  }
}

export async function tryExecGetJson<T>(url: string, context: (KV | null) = null): Promise<T> {
  let response;

  try {
    logger(`fetching state(s) (url:=${url}) ...`);
    response = (await exec(new GetRequestParams(url, context)));
  }
  catch (error) {
    logger(`failed to execute get request (url:=${url}, error:=${error})`);
    throw error;
  }

  return toJson(response, url);
}

export async function execPostJson<T>(url: string, state: T): Promise<T> {
  let response;

  try {
    logger(`fetching state(s) (url:=${url}) ...`);
    response = (await exec(new PostRequestParams(url, state)));
  }
  catch (error) {
    logger(`failed to execute POST request (url:=${url}, error:=${error})`);
    throw error;
  }

  return toJson(response, url);
}
