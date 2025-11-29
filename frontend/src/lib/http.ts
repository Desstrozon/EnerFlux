// ============================================================================
// RESOLVER API_BASE
// ============================================================================

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === "production"
    ? `${window.location.origin}/api`
    : "http://127.0.0.1:8000/api");

// ============================================================================
// PARSEAR RESPUESTAS JSON
// ============================================================================

async function handleJson(res: Response) {
  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // No es JSON → ignoramos
  }

  if (!res.ok) {
    // Mensaje legible
    let msg = data?.message || `Error ${res.status}`;

    // Errores de validación
    if (data?.errors) {
      try {
        const flat = Object.values(data.errors)
          .flat()
          .join(" ");
        if (flat) msg = flat;
      } catch {}
    }

    const err: any = new Error(msg);
    err.status = res.status;
    err.details = data;
    throw err;
  }

  return data;
}

// ============================================================================
// FUNCIÓN GENÉRICA PARA TODAS LAS PETICIONES
// ============================================================================

async function request<T>(
  method: string,
  path: string,
  body?: any,
  isFormData = false
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const token = localStorage.getItem("token") || "";

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: "omit", // Siempre sin cookies
  });

  return handleJson(res);
}

// ============================================================================
// HELPERS PÚBLICOS (EXPORTADOS CORRECTAMENTE)
// ============================================================================

// GET
export const apiGet = <T = any>(path: string) =>
  request<T>("GET", path);

// POST JSON
export const apiPostJson = <T = any>(path: string, body: any) =>
  request<T>("POST", path, body);

// POST FormData
export const apiPostForm = <T = any>(path: string, form: FormData) =>
  request<T>("POST", path, form, true);

// PUT
export const apiPutJson = <T = any>(path: string, body: any) =>
  request<T>("PUT", path, body);

// PATCH
export const apiPatchJson = <T = any>(path: string, body: any) =>
  request<T>("PATCH", path, body);

// DELETE
export const apiDeleteJson = <T = any>(path: string) =>
  request<T>("DELETE", path);

// Para compatibilidad antigua (si algo usa API.post/put/etc)
export const API = {
  url: API_BASE,
  get: apiGet,
  post: apiPostJson,
  put: apiPutJson,
  delete: apiDeleteJson,
};
