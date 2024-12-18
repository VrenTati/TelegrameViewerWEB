import { useRouter } from "next/router";
import { useState } from "react";
import api from "../utils/api";
import "../styles/globals.css";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleAuth = async () => {
    setErrors({ email: "", password: "", general: "" });
    setSuccessMessage("");

    try {
      if (!email) {
        setErrors((prev) => ({ ...prev, email: "Email is required" }));
        return;
      }
      if (!password) {
        setErrors((prev) => ({ ...prev, password: "Password is required" }));
        return;
      }

      const endpoint = isRegistering ? "/auth/register" : "/auth/login";
      const res = await api.post(endpoint, { email, password });

      if (!isRegistering) {
        localStorage.setItem("token", res.data.access_token);

        if (res.data.phone) {
          localStorage.setItem("phone", res.data.phone);
          router.push("/chats");
        } else {
          router.push("/connect");
        }
      } else {
        setSuccessMessage("Registration successful! Please login.");
        setIsRegistering(false);

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (err) {
      const errorDetail = err.response?.data?.detail || "Unknown error";

      if (err.response?.data?.detail?.includes("Email already registered")) {
        setErrors((prev) => ({
          ...prev,
          email: "Email is already registered.",
        }));
      } else if (err.response?.data?.detail?.includes("Invalid credentials")) {
        setErrors((prev) => ({
          ...prev,
          general: "Invalid email or password.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, general: String(errorDetail) }));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          {isRegistering ? "Register" : "Login"}
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
          <div className="flex flex-col space-y-4">
            <input
              className={`w-full p-3 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}

            <input
              className={`w-full p-3 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}

            <button
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-200"
              onClick={handleAuth}
            >
              {isRegistering ? "Register" : "Login"}
            </button>

            <button
              className="w-full text-green-500 hover:underline text-center"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
