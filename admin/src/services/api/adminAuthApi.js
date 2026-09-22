const BASE_URL = import.meta.env.VITE_API_BASE;

const parseResponse = async (res) => {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const adminSignupApi = async (payload) => {
  const res = await fetch(`${BASE_URL}/admin-auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse(res);
};

export const adminLoginApi = async (payload) => {
  const res = await fetch(`${BASE_URL}/admin-auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse(res);
};

export const forgotAdminPasswordApi = async (payload) => {
  const res = await fetch(`${BASE_URL}/admin-auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse(res);
};

export const verifyAdminOtpApi = async (payload) => {
  const res = await fetch(`${BASE_URL}/admin-auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse(res);
};

export const resetAdminPasswordApi = async (payload) => {
  const res = await fetch(`${BASE_URL}/admin-auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse(res);
};

export const getAdminProfileApi = async () => {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(`${BASE_URL}/admin-auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(res);
};
