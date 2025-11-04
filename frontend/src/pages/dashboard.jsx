import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authProvider"; 

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {user.role === "artist" ? (
        <>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md">
            <h2 className="text-xl font-semibold mb-2">Portfolio</h2>
            <p className="text-gray-600">Manage your portfolio and artworks.</p>
            <Link to="/portfolio" className="text-indigo-600 mt-3 inline-block">
              Go →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md">
            <h2 className="text-xl font-semibold mb-2">Upload Media</h2>
            <p className="text-gray-600">
              Add new artwork or serialized content.
            </p>
            <Link to="/upload" className="text-indigo-600 mt-3 inline-block">
              Upload →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md">
            <h2 className="text-xl font-semibold mb-2">Progress</h2>
            <p className="text-gray-600">
              Track the progress of your serialized content.
            </p>
            <Link to="/progress" className="text-indigo-600 mt-3 inline-block">
              Go →
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md">
            <h2 className="text-xl font-semibold mb-2">Profile</h2>
            <p className="text-gray-600">Edit bio, avatar, and details.</p>
            <Link
              to={`/profile/${user.username}`}
              className="text-indigo-600 mt-3 inline-block"
            >
              Go →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md">
            <h2 className="text-xl font-semibold mb-2">Library</h2>
            <p className="text-gray-600">
              Your saved media and favorite artworks.
            </p>
            <Link to="/library" className="text-indigo-600 mt-3 inline-block">
              Go →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md">
            <h2 className="text-xl font-semibold mb-2">Following</h2>
            <p className="text-gray-600">
              Track the artists you are following.
            </p>
            <Link to="/following" className="text-indigo-600 mt-3 inline-block">
              Go →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
