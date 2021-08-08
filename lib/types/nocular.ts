export interface NocularOptions {
  baseURL?: string;
  validateStatus?: (status: number) => boolean;
  transformRequests?: ((data: any) => any)[];
  transformResponses?: ((data: any) => any)[];
}

export type NocularDefaultHeaders = Partial<
  Record<HTTPMethod, Record<string, string>>
> & {
  global?: Record<string, string>;
};

export interface NocularRequestOptions {
  method: HTTPMethod;
  headers?: Record<string, string>;
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
  transformRequests?: ((data: any, headers: Headers) => any)[];
  transformResponses?: ((data: any) => any)[];
}

export interface NocularResponse<T = any> {
  url: string;
  config: NocularResponseConfig;
  headers: Headers;
  redirected: boolean;
  status: number;
  statusText: string;
  data: T;
}

export interface NocularResponseConfig {
  method: HTTPMethod;
  headers?: Headers;
  body?: any;
  mode?: HTTPMode;
  credentials?: HTTPCredentials;
  cache?: HTTPCache;
  redirect?: HTTPRedirect;
  referrer?: string; // USVString
  referrerPolicy?: HTTPReferrerPolicy;
  integrity?: string; // Subsource Integrity
  keepalive?: boolean;
  signal?: AbortSignal;
}

export const HTTPMethod = {
  GET: 'get',
  POST: 'post',
  PATCH: 'patch',
  PUT: 'put',
  DELETE: 'delete',
  OPTIONS: 'options',
  HEAD: 'head',
} as const;
export type HTTPMethod = typeof HTTPMethod[keyof typeof HTTPMethod];

export const HTTPMode = {
  CORS: 'cors',
  NO_CORS: 'no-cors',
  SAME_ORIGIN: 'same-origin',
} as const;
export type HTTPMode = typeof HTTPMode[keyof typeof HTTPMode];

export const HTTPCredentials = {
  OMIT: 'omit',
  SAME_ORIGIN: 'same-origin',
  INCLUDE: 'include',
} as const;
export type HTTPCredentials =
  typeof HTTPCredentials[keyof typeof HTTPCredentials];

export const HTTPCache = {
  DEFAULT: 'default',
  NO_STORE: 'no-store',
  RELOAD: 'reload',
  NO_CACHE: 'no-cache',
  FORCE_CACHE: 'force-cache',
  ONLY_IF_CACHED: 'only-if-cached',
} as const;
export type HTTPCache = typeof HTTPCache[keyof typeof HTTPCache];

export const HTTPRedirect = {
  FOLLOW: 'follow',
  ERROR: 'error',
  MANUAL: 'manual',
} as const;
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
} as const;
export type HTTPReferrerPolicy =
  typeof HTTPReferrerPolicy[keyof typeof HTTPReferrerPolicy];
