import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User } from "lucide-react";
import { getStoredUser } from "../../services/useSeries";

const DashboardTopbar = ({ title = "Dashboard" }) => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center bg-[#121212] px-4 sm:px-8 py-4 shadow relative">
      <h1 className="font-bold text-lg text-yellow-300 pl-10 md:pl-0">{title}</h1>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((s) => !s)}
          className="flex items-center gap-2 text-white cursor-pointer"
        >
          <span className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center font-semibold uppercase text-sm">
            {(user?.name || user?.email || "U").charAt(0)}
          </span>
          <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-md py-1 z-50">
            <button
              onClick={() => navigate("/profile")}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
            >
              <User size={15} /> Profile
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTopbar;
