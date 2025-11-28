import { useState, useEffect } from "react";
import { getLibrary, removeFromLibrary } from "../route/consumer";
import { Link } from "react-router-dom";

export default function Library() {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadLibrary() {
      try {
        const res = await getLibrary();
        const data = res.data;
        if (!cancelled) setLibrary(data.library || []);
      } catch (err) {
        if (!cancelled) console.log(err.message? err.message : "Error loading library");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLibrary();
    return () => (cancelled = true);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (library.length === 0) {
    return (
      <div className="min-h-screen p-8 text-center text-gray-600">
        <h1 className="text-2xl font-semibold mb-4">My Library</h1>
        <p>You haven't added any artwork to your library yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">My Library</h1>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {library.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded shadow">
            
            <img
              src={`http://localhost:5000/${item.content.fileUrl}`}
              alt={item?.content?.title || "Artwork"}
              className="w-full h-48 object-cover rounded"
            />
  
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
  