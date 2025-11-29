// src/lib/http.ts

// Resolvemos la URL base SOLO desde la env y, si no hay, desde el origen.
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === "production"
    ? `${window.location.origin}/api`
    : "http://127.0.0.1:8000/api");

console.log("[HTTP] API_BASE =", API_BASE);

async function handleJson(res: Response) {
  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    // Muy importante para debug:
    console.error("[HTTP] Respuesta NO JSON", {
      status: res.status,
      statusText: res.statusText,
      raw: text,
    });
  }

  if (!res.ok) {
    const msg =
      (data && data.message) ||
      text ||
      `Error HTTP ${res.status} ${res.statusText}`;

    const err: any = new Error(msg);
    err.status = res.status;
    err.details = data;
    err.raw = text;
    throw err;
  }

  return data;
}

export async function apiPostJson<T = any>(
  path: string,
  body: any
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include", // esto realmente da igual ahora, lo puedes dejar así
  });
  return handleJson(res);
}

export async function apiGetJson<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });
  return handleJson(res);
}

export { API_BASE as default };
