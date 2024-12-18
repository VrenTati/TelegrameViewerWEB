import { useRouter } from "next/router";
import { useState } from "react";
import api from "../utils/api";
import "../styles/globals.css";

export default function ConnectTelegram() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [errors, setErrors] = useState({ phone: "", code: "", general: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const connectTelegram = async () => {
    const token = localStorage.getItem("token");
    setErrors({ phone: "", code: "", general: "" });
    setSuccessMessage("");

    try {
      await api.post(
        `/telegram/connect?phone=${encodeURIComponent(phone)}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Phone number accepted. Enter the code from Telegram.");
      setShowCodeInput(true);
    } catch (err) {
      const errorDetail = err.response?.data?.detail || "Unknown error";
      setErrors((prev) => ({ ...prev, general: String(errorDetail) }));
    }
  };

  const sendTelegramCode = async () => {
    const token = localStorage.getItem("token");
    setErrors({ phone: "", code: "", general: "" });
    setSuccessMessage("");

    try {
      await api.post(
        `/telegram/login?phone=${encodeURIComponent(
          phone
        )}&code=${encodeURIComponent(code)}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Telegram connected successfully!");
      localStorage.setItem("phone", phone);
      router.push("/chats");
    } catch (err) {
      const errorDetail = err.response?.data?.detail || "Unknown error";
      setErrors((prev) => ({ ...prev, general: String(errorDetail) }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Connect Telegram
        </h1>

        {successMessage && (
          <div className="p-3 mb-4 text-green-700 bg-green-200 border border-green-500 rounded">
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="p-3 mb-4 text-red-700 bg-red-200 border border-red-500 rounded">
            {errors.general}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              className={`w-full p-3 border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={showCodeInput}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
            <button
              className="ml-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition duration-200"
              onClick={connectTelegram}
              disabled={showCodeInput}
            >
              Connect Telegram
            </button>
          </div>

          {showCodeInput && (
            <div className="flex items-center">
              <input
                className={`w-full p-3 border ${
                  errors.code ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                type="text"
                placeholder="Enter the code from Telegram"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code}</p>
              )}
              <button
                className="ml-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
                onClick={sendTelegramCode}
              >
                Submit Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
