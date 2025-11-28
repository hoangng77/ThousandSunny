import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authProvider";
import { getProgress, deleteMedia } from "../route/artist";
import { ProgressCard } from "../components/card.jsx";
import { useNavigate } from "react-router-dom";

export default function Progress() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [series, setSeries] = useState([]);
  const [singles, setSingles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch progress when user is ready
  useEffect(() => {
    if (!user) return;
    fetchProgress();
  }, [user]);

  const fetchProgress = async () => {
    try {
      const res = await getProgress();
      const data = res.data;

      setSeries(data.series || []);
      setSingles(data.singles || []);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching progress");
    } finally {
      setLoading(false);
    }
  };

  // Delete handler (episodes + single artworks share same API)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteMedia(id);

      // Remove from both lists
      setSingles((prev) => prev.filter((item) => item._id !== id));

      setSeries((prevSeries) =>
        prevSeries.map((s) => ({
          ...s,
          episodes: s.episodes.filter((ep) => ep._id !== id),
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete item");
    }
  };

  if (loading) return <div className="p-8">Loading…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* ====== SERIES SECTION ====== */}
        <section>
          <h1 className="text-3xl font-bold mb-6">Serialized Content</h1>

          {series.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600">No serialized content yet.</p>
              <a href="/upload" className="text-indigo-600 mt-2 inline-block">
                Start creating →
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {series.map((s) => (
                <div key={s._id} className="bg-white rounded-xl shadow-md p-6">
                  {/* Series Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">{s.seriesTitle}</h2>
                    <span className="text-sm bg-indigo-200 text-indigo-800 px-3 py-1 rounded-md">
                      {s.genre}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6">{s.description}</p>

                  {/* ========= EPISODES ========= */}
                  <div className="space-y-4">
                    {s.episodes.length === 0 ? (
                      <p className="text-gray-500 text-sm">No episodes yet.</p>
                    ) : (
                      s.episodes
                        .sort((a, b) => a.episodeNumber - b.episodeNumber)
                        .map((ep) => (
                          <div
                            key={ep._id}
                            className="flex items-center gap-4 p-3 rounded-lg border bg-gray-50 relative group"
                          >
                            {/* Thumbnail */}
                            <div className="w-20">
                              <ProgressCard
                                image={`http://localhost:5000/${ep.fileUrl}`}
                                title={ep.title}
                                genre={s.genre}
                              />
                            </div>

                            {/* Episode info */}
                            <div>
                              <p className="font-medium">
                                Episode {ep.episodeNumber}: {ep.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(ep.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            {/* Edit/Delete buttons */}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">

                              <button
                                onClick={() => navigate(`/edit-media/${ep._id}`)}
                                className="bg-yellow-500 text-white text-xs px-2 py-1 rounded shadow hover:bg-yellow-600"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => handleDelete(ep._id)}
                                className="bg-red-600 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-700"
                              >
                                Remove
                              </button>

                            </div>
                          </div>
                        ))
                    )}
                  </div>

                  <a
                    href="/upload"
                    className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Add Episode
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ====== SINGLE ARTWORKS ====== */}
        <section>
          <h1 className="text-3xl font-bold mb-6">Your Artworks</h1>

          {singles.length === 0 ? (
            <div className="text-gray-600">No artworks yet.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {singles.map((art) => (
                <div key={art._id} className="relative group">
                  
                  {/* Artwork card */}
                  <ProgressCard
                    image={`http://localhost:5000/${art.fileUrl}`}
                    title={art.title}
                    genre={art.genre}
                  />

                  {/* Edit/Delete overlay */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">

                    <button
                      onClick={() => navigate(`/edit-media/${art._id}`)}
                      className="bg-yellow-500 text-white text-xs px-2 py-1 rounded shadow hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(art._id)}
                      className="bg-red-600 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-700"
                    >
                      Remove
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
