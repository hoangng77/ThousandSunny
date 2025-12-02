import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authProvider";
import { useNavigate } from "react-router-dom";
// Navigation bar component
export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
// Render navigation links based on authentication status
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-xl text-blue-700">DreamCircle</Link>
        {user && (
          <>
            <Link to="/discover" className="text-gray-700 hover:text-indigo-600">Discover</Link>
            <Link to="/for-you" className="text-gray-700 hover:text-indigo-600">For You</Link>
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
