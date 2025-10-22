import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      <Link to="/" className="text-2xl font-bold text-indigo-600">DreamCircle</Link>

      <div className="hidden md:flex gap-6 text-gray-600">
        <Link to="/">Home</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/create">Create</Link>
        
      </div>

      <div className="flex gap-3">
        {user ? (
          <>
            <Link to="/dashboard" className="px-4 py-2 border rounded-lg text-gray-700">Dashboard</Link>
            <Link to="/library" className="px-4 py-2 border rounded-lg text-gray-700">Library</Link>
            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-lg">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 border rounded-lg text-gray-700">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
