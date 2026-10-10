const BASE_URL = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL;

export const getAdminToken = () => localStorage.getItem("adminToken");

export const clearAdminSession = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminData");
};

export const request = async (endpoint, options = {}) => {
  const token = getAdminToken();
  const hasBody = options.body !== undefined && !(options.body instanceof FormData);

  let res;
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      body: hasBody ? JSON.stringify(options.body) : options.body,
    });
  } catch {
    throw new Error("Cannot reach the server. Check your connection and try again.");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }

  // expired / invalid admin token -> back to the login screen
  if (res.status === 401) {
    clearAdminSession();
    const path = window.location.pathname;
    if (path !== "/login" && !path.startsWith("/admin/")) {
      window.location.assign("/login");
    }
  }

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
  }
  return data;
};

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: "POST", body }),
  put: (endpoint, body) => request(endpoint, { method: "PUT", body }),
  del: (endpoint) => request(endpoint, { method: "DELETE" }),
};
