import * as types from '../util/types.ts';

import ExtendableArray from './ExtendableArray.ts';

import HTTPError from '../errors/HTTPError.ts';

import {
  HTTPMethod,
  NocularDefaultHeaders,
  NocularOptions,
  NocularRequestOptions,
  NocularResponse,
} from '../types/nocular.ts';

class Nocular {
  baseURL?: string;
  defaultHeaders: NocularDefaultHeaders = {
    global: { Accept: 'application/json, text/plain, */*' },
    get: {},
    post: { 'Content-Type': 'application/json' },
    patch: { 'Content-Type': 'application/json' },
    put: { 'Content-Type': 'application/json' },
    delete: {},
    options: {},
    head: {},
  };

  validateStatus: (status: number) => boolean;
  transformRequests: ExtendableArray<(data: any, headers: Headers) => any> =
    new ExtendableArray();
  transformResponses: ExtendableArray<(data: any) => any> =
    new ExtendableArray();

  constructor(options?: NocularOptions) {
    this.baseURL = options?.baseURL;

    this.validateStatus = options?.validateStatus || this.validateStatusFunc;
    this.transformRequests.push(
      options?.transformRequests || this.transformRequestFunc
    );
    this.transformResponses.push(
      options?.transformResponses || this.transformResponseFunc
    );
  }

  validateStatusFunc(status: number) {
    return status >= 200 && status < 300;
  }

  transformRequestFunc(data: any, headers: Headers) {
    if (types.isObject(data)) {
      headers.set('Content-Type', 'application/json');
      data = JSON.stringify(data);
    }

    return data;
  }

  transformResponseFunc(data: any) {
    if (types.isString(data)) {
      try {
        data = JSON.parse(data);
      } catch {}
    }

    return data;
  }

  request(
    path: string,
    options: NocularRequestOptions
  ): Promise<NocularResponse> {
    const validateStatus = options.validateStatus || this.validateStatus;

    const transformRequests = this.transformRequests.extend(
      options.transformRequests
    );
    const transformResponses = this.transformResponses.extend(
      options.transformResponses
    );

    const newHeaders: Headers = new Headers();

    const addHeaders = (headers: Record<string, string>) => {
      for (const [k, v] of Object.entries(headers)) {
        newHeaders.append(k, v);
      }
    };

    if (this.defaultHeaders) {
      if (this.defaultHeaders.global) {
        addHeaders(this.defaultHeaders.global);
      }
      if (this.defaultHeaders[options.method]) {
        addHeaders(this.defaultHeaders[options.method]!);
      }
    }
    if (options.headers) {
      addHeaders(options.headers);
    }

    transformRequests?.forEach((transform) => {
      options.data = transform(options.data, newHeaders);
    });

    const requestOptions = {
      method: options.method,
      headers: newHeaders,
      body: options.data,
      mode: options.mode,
      credentials: options.credentials,
      cache: options.cache,
      redirect: options.redirect,
      referrer: options.referrer,
      referrerPolicy: options.referrerPolicy,
      integrity: options.integrity,
      keepalive: options.keepalive,
      signal: options.signal,
    };

    const url = this.buildURL(path, options.params);

    return new Promise((resolve, reject) => {
      fetch(url, requestOptions).then((res: Response) => {
        res.text().then((data) => {
          transformResponses?.forEach((transform) => {
            data = transform(data);
          });

          const newRes: NocularResponse = {
            url,
            config: requestOptions,
            headers: res.headers,
            redirected: res.redirected,
            status: res.status,
            statusText: res.statusText,
            data: data,
          };

          if (!validateStatus(res.status)) {
            reject(
              new HTTPError(
                `The request failed with status ${res.status}.`,
                newRes
              )
            );
          } else {
            resolve(newRes);
          }
        });
      });
    });
  }

  private buildURL(
    path: string,
    params?: Record<string, string | number>
  ): string {
    let url = this.baseURL ? this.baseURL + path : path;

    if (params) {
      // @ts-ignore
      url += `?${new URLSearchParams(params)}`;
    }

    return url;
  }

  get(
    url: string,
    options?: Omit<NocularRequestOptions, 'method'>
  ): Promise<NocularResponse> {
    return this.request(url, {
      method: HTTPMethod.GET,
      ...options,
    });
  }
  post(
    url: string,
    options?: Omit<NocularRequestOptions, 'method'>
  ): Promise<NocularResponse> {
    return this.request(url, {
      method: HTTPMethod.POST,
      ...options,
    });
  }

  patch(
    url: string,
    options?: Omit<NocularRequestOptions, 'method'>
  ): Promise<NocularResponse> {
    return this.request(url, {
      method: HTTPMethod.PATCH,
      ...options,
    });
  }

  put(
    url: string,
    options?: Omit<NocularRequestOptions, 'method'>
  ): Promise<NocularResponse> {
    return this.request(url, {
      method: HTTPMethod.PUT,
      ...options,
    });
  }

  delete(
    url: string,
    options?: Omit<NocularRequestOptions, 'method'>
  ): Promise<NocularResponse> {
    return this.request(url, {
      method: HTTPMethod.DELETE,
      ...options,
    });
  }

  options(
    url: string,
    options?: Omit<NocularRequestOptions, 'method'>
  ): Promise<NocularResponse> {
    return this.request(url, {
      method: HTTPMethod.OPTIONS,
      ...options,
    });
  }

  head(
    url: string,
    options?: Omit<NocularRequestOptions, 'method'>
  ): Promise<NocularResponse> {
    return this.request(url, {
      method: HTTPMethod.HEAD,
      ...options,
    });
  }
}

export default Nocular;
