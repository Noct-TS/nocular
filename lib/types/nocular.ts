export interface NocularOptions {
  baseURL?: string;
  defaultHeaders?: Headers;
  validateStatus?: (status: number) => boolean;
  transformRequest?: ((data: any) => any)[];
  transformResponse?: ((data: any) => any)[];
}

export interface NocularRequestOptions {
  method: HTTPMethod;
  headers?: Headers;
  data?: any;
  params?: Record<string, string | number>;
  mode?: HTTPMode;
  credentials?: HTTPCredentials;
  cache?: HTTPCache;
  redirect?: HTTPRedirect;
  referrer?: string; // USVString
  referrerPolicy?: HTTPReferrerPolicy;
  integrity?: string; // Subsource Integrity
  keepalive?: boolean;
  signal?: AbortSignal;
  validateStatus?: (status: number) => boolean;
  transformRequest?: ((data: any) => any)[];
  transformResponse?: ((data: any) => any)[];
}

export interface NocularResponse<T = any> {
  config: NocularRequestOptions;
  headers: Headers;
  redirected: boolean;
  status: number;
  statusText: string;
  data: T;
}

export const HTTPMethod = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
};
export type HTTPMethod = typeof HTTPMethod[keyof typeof HTTPMethod];

export const HTTPMode = {
  CORS: 'cors',
  NO_CORS: 'no-cors',
  SAME_ORIGIN: 'same-origin',
};
export type HTTPMode = typeof HTTPMode[keyof typeof HTTPMode];

export const HTTPCredentials = {
  OMIT: 'omit',
  SAME_ORIGIN: 'same-origin',
  INCLUDE: 'include',
};
export type HTTPCredentials =
  typeof HTTPCredentials[keyof typeof HTTPCredentials];

export const HTTPCache = {
  DEFAULT: 'default',
  NO_STORE: 'no-store',
  RELOAD: 'reload',
  NO_CACHE: 'no-cache',
  FORCE_CACHE: 'force-cache',
  ONLY_IF_CACHED: 'only-if-cached',
};
export type HTTPCache = typeof HTTPCache[keyof typeof HTTPCache];

export const HTTPRedirect = {
  FOLLOW: 'follow',
  ERROR: 'error',
  MANUAL: 'manual',
};
export type HTTPRedirect = typeof HTTPRedirect[keyof typeof HTTPRedirect];

export const HTTPReferrerPolicy = {
  NO_REFERRER: 'no-referrer',
  NO_REFERRER_WHEN_DOWNGRADE: 'no-referrer-when-downgrade',
  SAME_ORIGIN: 'same-origin',
  ORIGIN: 'origin',
  STRICT_ORIGIN: 'strict-origin',
  ORIGIN_WHEN_CROSS_ORIGIN: 'origin-when-cross-origin',
  STRICT_ORIGIN_WHEN_CROSS_ORIGIN: 'strict-origin-when-cross-origin',
  UNSAFE_URL: 'unsafe-url',
};
export type HTTPReferrerPolicy =
  typeof HTTPReferrerPolicy[keyof typeof HTTPReferrerPolicy];
