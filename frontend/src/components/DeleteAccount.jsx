import axios from "axios";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useNotifications } from "../Context/NotificationProvider";

const API_BASE = import.meta.env.VITE_API_BASE;

const DeleteAccount = () => {
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      addNotification("User not authenticated");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.delete(`${API_BASE}/user/delete-account`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      addNotification("Account deleted successfully!",
      );

      setTimeout(() => {
        localStorage.removeItem("token");
        window.location.href = "/signup";
      }, 1000);
    } catch (err) {
      console.error(err);
      addNotification("Failed to delete account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Delete Button */}
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 text-sm font-bold text-rose-700 transition hover:bg-rose-600 hover:text-white"
      >
        <Trash2 size={15} /> Delete My Account
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Trash2 size={19} />
            </div>
            <h2 className="mb-1 text-lg font-extrabold text-slate-950">Delete Account</h2>
            <p className="mb-4 text-sm leading-6 text-slate-500">
              This action is permanent. Type{" "}
              <span className="font-extrabold text-rose-600">DELETE</span> to confirm.
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE here"
              className="mb-4 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
            />

            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={confirmText !== "DELETE" || loading}
                className="h-11 flex-1 rounded-xl bg-rose-600 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  setConfirmText("");
                }}
                disabled={loading}
                className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccount;
