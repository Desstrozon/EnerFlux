// src/lib/http.ts

const API_BASE =
  import.meta.env.MODE === "production"
    ? "https://enerflux-h2dga2ajeda7cnb7.spaincentral-01.azurewebsites.net/api"
    : "http://127.0.0.1:8000/api";

async function handleJson(res: Response) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    const err: any = new Error(data?.message || "Error en la petición");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// ====== MÉTODOS HTTP GENÉRICOS ======

export async function apiGet<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "omit",
  });
  return handleJson(res);
}

export async function apiPostJson<T = any>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body ?? {}),
    credentials: "omit",
  });
  return handleJson(res);
}

export async function apiPutJson<T = any>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body ?? {}),
    credentials: "omit",
  });
  return handleJson(res);
}

export async function apiPatchJson<T = any>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body ?? {}),
    credentials: "omit",
  });
  return handleJson(res);
}

export async function apiDelete<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
    credentials: "omit",
  });
  return handleJson(res);
}

export { API_BASE };
