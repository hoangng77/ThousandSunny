import { useState } from "react";
import React from "react";
import { registerUser } from "../route/auth";

export default function Register() {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [status, setStatus] = useState("typing");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
  
    try {
      await registerUser(input);
      setStatus("success");
    } catch (err) {
      setStatus("typing");
      setError(err.response?.data?.message || err.message || "Registration failed");
    }
  };  

  if (status === "success")
    return (
      <h1 className="text-center mt-20 text-2xl text-green-600">
        Registration Successful 🎉
      </h1>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center">Register</h2>

        <input
          name="username"
          value={input.username}
          onChange={handleChange}
          placeholder="Username"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          name="email"
          value={input.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          name="password"
          value={input.password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="artist"
              checked={input.role === "artist"}
              onChange={handleChange}
              className="accent-indigo-600"
            />
            Artist
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="consumer"
              checked={input.role === "consumer"}
              onChange={handleChange}
              className="accent-indigo-600"
            />
            Consumer
          </label>
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {status === "submitting" ? "Registering..." : "Register"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
}