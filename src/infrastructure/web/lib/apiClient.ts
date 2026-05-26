import { getUserId } from "@/infrastructure/demo/demoMode";

const BASE_HEADERS = {
  "Content-Type": "application/json",
  "x-demo-mode": "true",
};

function getHeaders(): Record<string, string> {
  return {
    ...BASE_HEADERS,
    "x-demo-user-id": getUserId(),
  };
}

export async function apiGet(path: string, params?: Record<string, string>): Promise<Response> {
  const url = params ? `${path}?${new URLSearchParams(params)}` : path;
  return fetch(url, { headers: getHeaders() });
}

export async function apiPost(path: string, body?: unknown): Promise<Response> {
  return fetch(path, { method: "POST", headers: getHeaders(), body: body ? JSON.stringify(body) : undefined });
}

export async function apiPatch(path: string, body?: unknown): Promise<Response> {
  return fetch(path, { method: "PATCH", headers: getHeaders(), body: body ? JSON.stringify(body) : undefined });
}

export async function apiDelete(path: string, body?: unknown): Promise<Response> {
  return fetch(path, { method: "DELETE", headers: getHeaders(), body: body ? JSON.stringify(body) : undefined });
}
