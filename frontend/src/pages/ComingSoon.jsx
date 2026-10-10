
import { useLocation, useNavigate } from "react-router-dom";
import { Construction } from "lucide-react";

const ComingSoon = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
      <Construction className="mx-auto text-gray-400 mb-4" size={40} />
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {state?.label || "This feature"} is coming soon
      </h2>
      <p className="text-gray-500 mb-6">
        We&apos;re still building this part of Tech Quiz Master.
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-[#16A34A] hover:bg-[#15803D] text-white px-6 py-2.5 rounded-md font-medium cursor-pointer"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default ComingSoon;
