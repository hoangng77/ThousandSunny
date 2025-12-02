import React, { useState, useEffect } from "react";
import { getLibrary, removeFromLibrary } from "../route/consumer";
import { Link } from "react-router-dom";
// Library Page Component
export default function Library() {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch library data on component mount
  useEffect(() => {
    let cancelled = false;

    async function loadLibrary() {
      try {
        const res = await getLibrary();
        const data = res.data;
        if (!cancelled) setLibrary(data.library || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLibrary();
    return () => (cancelled = true);
  }, []);
  // Handle removing item from library
  const handleRemove = async (contentId) => {
    try {
      await removeFromLibrary(contentId);

      setLibrary(prev =>
        prev.filter(item => item.content._id !== contentId)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to remove");
    }
  };
  // Render loading, error, empty state, or library items
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }
  // Render error state
  if (library.length === 0) {
    return (
      <div className="min-h-screen p-8 text-center text-gray-600">
        <h1 className="text-2xl font-semibold mb-4">My Library</h1>
        <p>You haven't added any artwork to your library yet.</p>
      </div>
    );
  }
  // Render library items grid
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">My Library</h1>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {library.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded shadow">
          <Link to={`/art/${item.content._id}`}>
            <img
              src={`http://localhost:5000${item.content.fileUrl}`}
              alt={item?.content?.title || "Artwork"}
              className="w-full h-48 object-cover rounded cursor-pointer"
            />
          </Link>
        
          <p className="mt-2 font-medium text-lg">
            {item?.content?.title || "Untitled Artwork"}
          </p>
        
          <p className="text-sm text-gray-600">
            Genre: {item?.content?.genre || "Unknown"}
          </p>
        
          <Link
            to={`/portfolio/${item.content.artist.username}`}
            className="text-blue-600 text-sm hover:underline block mt-1"
          >
            View Artist
          </Link>
        
          <button
            onClick={() => handleRemove(item.content._id)}
            className="mt-3 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Remove
          </button>
        </div>        
        ))}
      </div>
    </div>
  );
  }
  