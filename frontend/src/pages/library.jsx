import React, { useState, useEffect } from "react";
import { getLibrary } from "../route/consumer";

export default function Library() {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              src={`http://localhost:5000${item.content.fileUrl}`}
              alt={item?.content?.title || "Artwork"}
              className="w-full h-48 object-cover rounded"
            />

            <p className="mt-2 font-medium">
              {item?.content?.title || "Untitled Artwork"}
            </p>

          </div>
        ))}
      </div>
    </div>
  );
}
