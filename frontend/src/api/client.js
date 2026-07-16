import { getApiBase } from "../utils/helpers";

export async function api(path, options = {}) {
  const token = localStorage.getItem("fashionStoreToken");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${getApiBase()}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("Backend is offline. Start Spring Boot on port 8081 and try again.");
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}
