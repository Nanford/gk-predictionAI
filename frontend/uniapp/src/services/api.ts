const SESSION_STORAGE_KEY = "gaokao-session-token";

interface RequestOptions {
  url: string;
  method?: "GET" | "POST" | "DELETE";
  data?: string | Record<string, unknown> | ArrayBuffer;
  header?: Record<string, string>;
}

interface RequestResult {
  statusCode: number;
  data: unknown;
}

interface ApiClientDependencies {
  baseUrl: string;
  request: (options: RequestOptions) => Promise<RequestResult>;
  getStorage: (key: string) => string | undefined;
  setStorage: (key: string, value: string) => void;
}

const assertSuccess = (result: RequestResult): unknown => {
  if (result.statusCode < 200 || result.statusCode >= 300) {
    const message =
      typeof result.data === "object" && result.data && "message" in result.data
        ? String((result.data as { message: unknown }).message)
        : `Request failed with status ${result.statusCode}`;
    throw new Error(message);
  }
  return result.data;
};

export const createApiClient = (dependencies: ApiClientDependencies) => {
  const publicRequest = async <T>(
    path: string,
    options: Omit<RequestOptions, "url"> = {}
  ): Promise<T> =>
    assertSuccess(
      await dependencies.request({
        ...options,
        data: options.data ?? (options.method === "POST" ? {} : undefined),
        url: `${dependencies.baseUrl}${path}`
      })
    ) as T;

  const ensureSession = async (): Promise<string> => {
    const stored = dependencies.getStorage(SESSION_STORAGE_KEY);
    if (stored) return stored;
    const session = await publicRequest<{ token: string }>("/session", { method: "POST" });
    dependencies.setStorage(SESSION_STORAGE_KEY, session.token);
    return session.token;
  };

  const authenticatedRequest = async <T>(
    path: string,
    options: Omit<RequestOptions, "url" | "header"> = {}
  ): Promise<T> => {
    const token = await ensureSession();
    return publicRequest<T>(path, {
      ...options,
      header: { "X-Session-Token": token }
    });
  };

  return { publicRequest, authenticatedRequest, ensureSession };
};

const uniRequest = async (options: RequestOptions): Promise<RequestResult> =>
  (await uni.request({
    url: options.url,
    method: options.method,
    data: options.data,
    header: options.header
  })) as unknown as RequestResult;

export const api = createApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:3000/api",
  request: uniRequest,
  getStorage: (key) => uni.getStorageSync(key) || undefined,
  setStorage: (key, value) => uni.setStorageSync(key, value)
});
