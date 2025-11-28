import React, { useEffect, useState } from "react";
import API from "../route/index";
import { Link } from "react-router-dom";

export default function ForYou() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadForYou = async () => {
    try {
      const res = await API.get("/for-you");
      setItems(res.data.recommended || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForYou();
  }, []);

  if (loading) return <div className="text-center mt-20">Loading For You…</div>;

  if (items.length === 0)
    return (
      <div className="text-center text-gray-500 mt-20">
        No recommendations yet — add some items to your library!
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">For You</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((art) => (
          <div
            key={art._id}
            className="bg-white rounded shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={`http://localhost:5000${art.fileUrl}`}
              alt={art.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-3">
              <h2 className="font-semibold">{art.title}</h2>

              <p className="text-sm text-gray-500">Genre: {art.genre}</p>

              <Link
                to={`/portfolio/${art.artistInfo.username}`}
                className="text-blue-600 text-sm mt-1 block hover:underline"
              >
                {art.artistInfo.username}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
