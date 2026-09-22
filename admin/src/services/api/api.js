import { useCallback } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE;

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  const token =
  localStorage.getItem("adminToken")
  localStorage.getItem("token") ||
  localStorage.getItem("clerkToken");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, options);

 if (res.status === 401) {
   throw new Error("Unauthorized");
 }

  if (res.status === 429) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Too many requests, please try again later.",
    );
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "API ERROR");
  }

  return res.json();
};

export const useApi = () => {
  const request = useCallback((endpoint, method = "GET", body = null) => {
    return apiRequest(endpoint, method, body);
  }, []);

  return { request };
};
