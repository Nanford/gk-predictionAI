import { describe, expect, it } from "vitest";
import { createApiClient } from "../src/services/api.js";

describe("createApiClient", () => {
  it("creates and stores an anonymous token before the first authenticated request", async () => {
    const calls: Array<{ url: string; data?: unknown; header?: Record<string, string> }> = [];
    const storage = new Map<string, string>();
    const client = createApiClient({
      baseUrl: "http://127.0.0.1:3000/api",
      request: async (options) => {
        calls.push({ url: options.url, data: options.data, header: options.header });
        if (options.url.endsWith("/session")) {
          return { statusCode: 201, data: { token: "session-token" } };
        }
        return { statusCode: 200, data: { available: 3 } };
      },
      getStorage: (key) => storage.get(key),
      setStorage: (key, value) => storage.set(key, value)
    });

    await client.authenticatedRequest<{ available: number }>("/quota");

    expect(storage.get("gaokao-session-token")).toBe("session-token");
    expect(calls).toEqual([
      { url: "http://127.0.0.1:3000/api/session", data: {}, header: undefined },
      {
        url: "http://127.0.0.1:3000/api/quota",
        data: undefined,
        header: { "X-Session-Token": "session-token" }
      }
    ]);
  });

  it("reuses the stored token without creating another session", async () => {
    const calls: string[] = [];
    const client = createApiClient({
      baseUrl: "http://127.0.0.1:3000/api",
      request: async (options) => {
        calls.push(options.url);
        return { statusCode: 200, data: { available: 3 } };
      },
      getStorage: () => "stored-token",
      setStorage: () => undefined
    });

    await client.authenticatedRequest("/quota");

    expect(calls).toEqual(["http://127.0.0.1:3000/api/quota"]);
  });
});
