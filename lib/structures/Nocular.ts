import * as util from '../util.ts';

import {
  HTTPMethod,
  NocularOptions,
  NocularRequestOptions,
  NocularResponse,
} from '../types/nocular.ts';

class Nocular {
  baseURL?: string;
  defaultHeaders: Headers;

  constructor(options?: NocularOptions) {
    this.baseURL = options?.baseURL;
    this.defaultHeaders =
      options?.defaultHeaders ||
      new Headers({
        Accept: 'application/json, text/plain, */*',
      });
  }

  validateStatus(status: number) {
    return status >= 200 && status < 300;
  }

  transformResponse(data: any) {
    if (util.isString(data)) {
      try {
        data = JSON.parse(data);
      } catch {}
    }

    return data;
  }

  request<T = any>(
    path: string,
    options: NocularRequestOptions
  ): Promise<NocularResponse> {
    let validateStatus = options.validateStatus || this.validateStatus;
    let transformResponse = options.transformResponse || this.transformResponse;

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
      body: options.body,
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

    return new Promise((resolve, reject) => {
      fetch(this.buildURL(path, options.params), requestOptions)
        .then((res: Response) => {
          res.text().then((data) => {
            let newData: any = transformResponse(data);

            const newRes: NocularResponse<T> = {
              config: requestOptions,
              headers: res.headers,
              redirected: res.redirected,
              status: res.status,
              statusText: res.statusText,
              data: newData,
            };

            resolve(newRes);
          });
        })
        .catch((err) => {});
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

  get<T = any>(
    url: string,
    options?: Omit<NocularRequestOptions, 'method'>
  ): Promise<NocularResponse> {
    return this.request<T>(url, {
      method: HTTPMethod.GET,
      ...options,
    });
  }
  post<T = any>(
    url: string,
    options?: Omit<NocularRequestOptions, 'method'>
  ): Promise<NocularResponse> {
    return this.request<T>(url, {
      method: HTTPMethod.GET,
      ...options,
    });
  }

  patch<T = any>(
    url: string,
    options?: Omit<NocularRequestOptions, 'method'>
  ): Promise<NocularResponse> {
    return this.request<T>(url, {
      method: HTTPMethod.PATCH,
      ...options,
    });
  }

  put<T = any>(
    url: string,
    options?: Omit<NocularRequestOptions, 'method'>
  ): Promise<NocularResponse> {
    return this.request<T>(url, {
      method: HTTPMethod.PUT,
      ...options,
    });
  }

  delete<T = any>(
    url: string,
    options?: Omit<NocularRequestOptions, 'method'>
  ): Promise<NocularResponse> {
    return this.request<T>(url, {
      method: HTTPMethod.DELETE,
      ...options,
    });
  }

  options<T = any>(
    url: string,
    options?: Omit<NocularRequestOptions, 'method'>
  ): Promise<NocularResponse> {
    return this.request<T>(url, {
      method: HTTPMethod.OPTIONS,
      ...options,
    });
  }

  head<T = any>(
    url: string,
    options?: Omit<NocularRequestOptions, 'method'>
  ): Promise<NocularResponse> {
    return this.request<T>(url, {
      method: HTTPMethod.HEAD,
      ...options,
    });
  }
}

export default Nocular;
