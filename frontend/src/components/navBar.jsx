import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authProvider";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-xl text-blue-700">DreamCircle</Link>
        {user && user.role === "consumer" && (
          <>
            <Link to="/discover" className="text-gray-700 hover:text-indigo-600">Discover</Link>
            <Link to="/foryou" className="text-gray-700 hover:text-indigo-600">For You</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
          </>
        )}
        {user && user.role === "artist" && (
          <>
            <Link to="/discover" className="text-gray-700 hover:text-indigo-600">Discover</Link>
            <Link to="/resemble" className="text-gray-700 hover:text-indigo-600">Inspiration</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to={user.role === "artist" ? "/portfolio" : `/profile/${user.username}`} className="text-gray-700 hover:text-indigo-600">
              {user.username}
            </Link>
            <button onClick={() => { logout(); navigate("/"); }} className="text-red-500 hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
            <Link to="/register" className="text-blue-700 hover:text-indigo-600">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
