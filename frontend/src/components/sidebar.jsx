import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-1/4 hidden lg:flex flex-col gap-4">
      <Link to="/create" className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 text-center">Create</Link>
      <Link to="/new-artist" className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 text-center">New Artist</Link>
    </aside>
  );
}
