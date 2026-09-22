import { Mail, MapPin, PhoneCall } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNotifications } from "../Context/NotificationProvider";

const API_BASE = import.meta.env.VITE_API_BASE;

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addNotification("Please fill all fields ⚠️");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/contact`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        addNotification("Message sent successfully");
        setFormData({ name: "", email: "", message: "" });
      } else {
        addNotification("Something went wrong ❌");
      }
    } catch (err) {
      console.error(err);
      addNotification("Server error ⚡");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-linear-to-br from-teal-100 to-emerald-200 p-2 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 rounded-lg shadow-lg shadow-blue-300 overflow-hidden backdrop-blur-xl bg-white/10 border border-blue-300"
      >
        {/* LEFT */}
        <div className="p-6 md:p-10 bg-white/80 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
            Need Help with Your Finances?
          </h2>
          <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
            Track smarter. Spend better 💸
          </p>
          <div className="space-y-4 text-sm md:text-base">
            <div className="flex items-center gap-3">
              <MapPin className="text-green-600" />
              <p>Delhi India</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" />
              <p>support@expensetracker.com</p>
            </div>
            <div className="flex items-center gap-3">
              <PhoneCall className="text-purple-600" />
              <p>+91-7986515332</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-10 flex flex-col gap-4"
        >
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
            Send Message
          </h3>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-400 text-sm md:text-base"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-400 text-sm md:text-base"
          />
          <textarea
            name="message"
            rows="4"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-400 text-sm md:text-base"
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-linear-to-r from-teal-600 to-emerald-500 text-white font-semibold shadow-md mt-2 cursor-pointer"
          >
            {loading ? "Sending..." : "Send Message"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactUs;
