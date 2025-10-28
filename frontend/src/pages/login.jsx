import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authProvider";

export default function Login() {

  const [input, setInput] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("typing");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const data = await loginToAccount(input);

      login(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", JSON.stringify(data.role));
      setStatus("success");

    } catch (err) {
      setStatus("typing");
      setError(err.message);
    }
  };

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => navigate("/dashboard"), 1000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  if (status === "success") {
    return (
      <h1 className="text-center mt-20 text-2xl">
        Login Successful 🎉 Redirecting...
      </h1>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>
        <input
          name="email"
          value={input.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="password"
          type="password"
          value={input.password}
          onChange={handleChange}
          placeholder="Password"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {status === "submitting" ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
}

async function loginToAccount(input) {
  const res = await fetch("http://localhost:5000/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
}
