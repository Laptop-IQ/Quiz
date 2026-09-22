import axios from "axios";

// ✅ Base URL
const BASE_URL = import.meta.env.VITE_API_BASE;

// ✅ Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor (auto attach token)
apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ Response Interceptor (optional - handle global errors)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error.response?.data || error.message);

    // Optional: auto logout on 401
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      // window.location.href = "/login"; // optional redirect
    }

    return Promise.reject(error);
  },
);

// ✅ Generic request function (HOOK)
export const useApi = () => {
  const request = async (endpoint, method = "GET", body = null) => {
    try {
      const response = await apiClient({
        url: endpoint,
        method: method.toUpperCase(),
        data: body,
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "API ERROR");
    }
  };

  return { request };
};

// ✅ Direct request function (non-hook usage)
export const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    const response = await apiClient({
      url: endpoint,
      method: method.toUpperCase(),
      data: body,
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "API ERROR");
  }
};

// ✅ Login API
export const loginUser = async (email, password) => {
  try {
    const res = await apiClient.post("/user/login", {
      email,
      password,
    });

    const data = res.data;

    // ✅ Save token automatically
    const token = data?.token || data?.accessToken;

    if (token) {
      localStorage.setItem("token", token);
    }

    return data;
  } catch (error) {
    console.error("Login API error:", error.response?.data || error.message);

    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// ✅ Fetch profile
export const fetchProfile = async (token) => {
  try {
    const authToken =
      token || localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!authToken) return null;

    const res = await apiClient.get("/user/me", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Profile API error:", error.response?.data || error.message);
    return null;
  }
};
