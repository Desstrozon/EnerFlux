// src/lib/api.ts
import { apiGetJson, apiPostJson, API_BASE as API_URL } from "./http";

export const apiGet = <T,>(path: string) => apiGetJson<T>(path);
export const apiPost = <T,>(path: string, data?: any) =>
  apiPostJson<T>(path, data);

// Para compatibilidad
export const API = {
  url: API_URL,
  get: apiGet,
  post: apiPost,
};

export { API_URL };
export default API;
