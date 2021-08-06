import * as util from '../util.ts';

import HTTPError from '../errors/HTTPError.ts';

import {
  HTTPMethod,
  NocularOptions,
  NocularRequestOptions,
  NocularResponse,
} from '../types/nocular.ts';

class Nocular {
  baseURL?: string;
  defaultHeaders: Headers;
  validateStatus: (status: number) => boolean;
  transformRequest: ((data: any) => any)[];
  transformResponse: ((data: any) => any)[];

  constructor(options?: NocularOptions) {
    this.baseURL = options?.baseURL;
    this.defaultHeaders =
      options?.defaultHeaders ||
      new Headers({
        Accept: 'application/json, text/plain, */*',
      });
    this.validateStatus = options?.validateStatus || this.validateStatusFunc;
    this.transformRequest = options?.transformRequest || [
      this.transformRequestFunc,
    ];
    this.transformResponse = options?.transformResponse || [
      this.transformResponseFunc,
    ];
  }

  validateStatusFunc(status: number) {
    return status >= 200 && status < 300;
  }

  transformRequestFunc(data: any) {
    return data;
  }

  transformResponseFunc(data: any) {
    if (util.isString(data)) {
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

    let newHeaders: Headers = new Headers();

    options.headers?.forEach((v, k) => {
      newHeaders.append(k, v);
    });

    this.defaultHeaders?.forEach((v, k) => {
      newHeaders.append(k, v);
    });

    const requestOptions = {
      method: options.method,
      headers: newHeaders,
      body: options.data,
      mode: <RequestMode>options.mode,
      credentials: <RequestCredentials>options.credentials,
      cache: <RequestCache>options.cache,
      redirect: <RequestRedirect>options.redirect,
      referrer: options.referrer,
      referrerPolicy: <ReferrerPolicy>options.referrerPolicy,
      integrity: options.integrity,
      keepalive: options.keepalive,
      signal: options.signal,
    };

    this.transformRequest.forEach((transform) => {
      options.data = transform(options.data);
    });

    return new Promise((resolve, reject) => {
      fetch(this.buildURL(path, options.params), requestOptions).then(
        (res: Response) => {
          res.text().then((data) => {
            this.transformResponse.forEach((transform) => {
              data = transform(data);
            });

            const newRes: NocularResponse = {
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
        }
      );
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
      method: HTTPMethod.GET,
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
