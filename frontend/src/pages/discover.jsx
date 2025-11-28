import React, { useState, useEffect } from "react";
import API from "../route/index"; 
import { Link } from "react-router-dom";

export default function DiscoverPage() {
  const [artworks, setArtworks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("consumer"); 
  const [loading, setLoading] = useState(true);

  const fetchDiscover = async () => {
    try {
      const res = await API.get("/discover");
      console.log("Backend response:", res.data);
      setArtworks(res.data.artworks || []);
      setRole(res.data.role);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscover();
  }, []);

  const addToLibrary = async (artId) => {
    try {
      await API.post("/consumer/library", { contentId: artId });
      fetchDiscover(); // refresh page
    } catch (err) {
      console.error(err);
    }
  };

  const followArtist = async (artistId) => {
    try {
      await API.post(`/consumer/follow/${artistId}`);
      fetchDiscover();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading Discover…</div>;

  // Select only artworks that fit the dropdown
  const filteredArtworks = artworks.filter((art) => {
    const matchesGenre =
      selectedGenre === "all" || art.genre === selectedGenre;
    const matchesSearch = art.title
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesGenre && matchesSearch;
  });


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Discover Artworks</h1>
      <div className="flex gap-4">
        {/* Search box */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-1 w-full sm:w-64"
          />
        </div>
        {/* Dropdown menu to filter works by genre */}
        <div className="mb-4">
          <label className="mr-2 font-medium">Filter by Genre:</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="all">All</option>
              {[...new Set(artworks.map((art) => art.genre))].map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
        </div>
      </div>
      {filteredArtworks.length === 0 ? (
        <p className="text-gray-500">No artworks to discover yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredArtworks.map((art) => (
            <div
              key={art._id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={`http://localhost:5000${art.fileUrl}`}
                alt={art.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <h2 className="font-semibold">{art.title}</h2>
                <p className="text-sm text-gray-500">
                  Genre: {art.genre}{" "}
                  {art.contentType === "series" && `• Episode ${art.episodeNumber}`}
                </p>

                <div className="mt-2 flex items-center justify-between">
                  {role === "consumer" ? (
                    <>
                      <button
                        onClick={() => addToLibrary(art._id)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Add to Library
                      </button>
                      <button
                        onClick={() => followArtist(art.artistInfo._id)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Follow Artist
                      </button>
                    </>
                  ) : (
                    <span className="text-sm text-gray-700">
                      Added to Library: {art.addedCount}
                    </span>
                  )}
                </div>

                <Link
                  to={`/artist/portfolio`}
                  className="mt-2 block text-sm text-blue-600 hover:underline"
                >
                  View Artist
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
