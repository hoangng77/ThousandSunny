import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/authProvider";
import { loginUser } from "../route/auth";

export default function Login() {
  const [input, setInput] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("typing");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const { data } = await loginUser(input);

      login(data.user);
      localStorage.setItem("token", data.token);
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
        Login Successful 🎉 Redirecting ...
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

        <p className="text-center text-gray-600 mt-2">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:underline font-semibold"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
