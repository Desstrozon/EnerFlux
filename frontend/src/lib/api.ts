// src/lib/api.ts
// Wrapper para mantener compatibilidad con el código antiguo.
// Internamente delega en http.ts

import {
  apiGet as httpGet,
  apiPostJson as httpPostJson,
  apiDelete as httpDelete,
  apiPutJson as httpPutJson,
  apiPatchJson as httpPatchJson,
} from "./http";

// URL base
export const API_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000/api";

// GET
export const apiGet = <T,>(path: string) => httpGet<T>(path);

// POST JSON
export const apiPost = <T,>(path: string, data?: any) =>
  httpPostJson<T>(path, data);

// DELETE
export const apiDelete = <T,>(path: string) =>
  httpDelete<T>(path);

// PUT
export const apiPut = <T,>(path: string, data?: any) =>
  httpPutJson<T>(path, data);

// PATCH
export const apiPatch = <T,>(path: string, data?: any) =>
  httpPatchJson<T>(path, data);

// Objeto API unificado (para código antiguo)
export const API = {
  url: API_URL,
  get: apiGet,
  post: apiPost,
  delete: apiDelete,
  put: apiPut,
  patch: apiPatch
};

export default API;
