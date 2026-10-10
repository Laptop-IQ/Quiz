import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminSignupApi } from "../../services/api/adminAuthApi";

const API = import.meta.env.VITE_API_BASE;

const AdminSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    inviteCode: "",
  });
  const [requiresInvite, setRequiresInvite] = useState(false);

  // after the first admin exists, signup needs the server's invite code
  useEffect(() => {
    fetch(`${API}/admin-auth/signup-status`)
      .then((r) => r.json())
      .then((d) => setRequiresInvite(!!d.requiresInvite))
      .catch(() => {});
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const data = await adminSignupApi(form);
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminData", JSON.stringify(data.admin));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Signup</h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Enter admin name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter admin email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min. 8 characters)"
            minLength={8}
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 outline-none"
            required
          />

          {requiresInvite && (
            <div>
              <input
                type="password"
                name="inviteCode"
                placeholder="Invite code"
                value={form.inviteCode}
                onChange={handleChange}
                autoComplete="off"
                className="w-full border rounded-lg px-4 py-3 outline-none"
                required
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Admin accounts are invite-only. Ask an existing admin for the code (ADMIN_INVITE_CODE on the server).
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Please wait..." : "Signup"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-blue-600">
            Already have admin account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
