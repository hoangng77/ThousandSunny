import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDiscover } from "../route/discover";
import { addToLibrary, followArtist } from "../route/consumer";
// Discover Page Component
export default function DiscoverPage() {
  const [artworks, setArtworks] = useState([]);
  const [role, setRole] = useState("consumer");
  const [loading, setLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  // Fetch discover data from backend
  const fetchDiscover = async () => {
    try {
      const res = await getDiscover();
      setArtworks(res.data.artworks || []);
      setRole(res.data.role);
      if (res.data.userFollowing) setFollowingIds(res.data.userFollowing);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscover();
  }, []);

  const handleAddToLibrary = async (artId) => {
    try {
      await addToLibrary(artId);
      fetchDiscover();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowArtist = async (artistId) => {
    try {
      await followArtist(artistId);
      fetchDiscover();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading Discover…</div>;
  // Filter artworks based on search and selected genre
  const filteredArtworks = artworks.filter((art) => {
    const matchesGenre = selectedGenre === "all" || art.genre === selectedGenre;
    const matchesSearch = art.title.toLowerCase().includes(search.toLowerCase());
    return matchesGenre && matchesSearch;
  });
  // Get unique genres for filter dropdown
  const genres = [...new Set(artworks.map((art) => art.genre))];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Discover Artworks</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-1 w-full sm:w-64"
        />
        <div>
          <label className="mr-2 font-medium">Filter by Genre:</label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredArtworks.length === 0 ? (
        <p className="text-gray-500">No artworks to discover yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredArtworks.map((art) => {
            const isFollowing = followingIds.includes(art.artistInfo._id);
            return (
              <div key={art._id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition">
                <Link to={`/art/${art._id}`}>
                  <img
                    src={`http://localhost:5000${art.fileUrl}`}
                    alt={art.title}
                    className="w-full h-48 object-cover"
                  />
                </Link>

                <div className="p-3">
                  <h2 className="font-semibold">{art.title}</h2>
                  <p className="text-sm text-gray-500">
                    Genre: {art.genre}{" "}
                    {art.contentType === "series" && `• Series: ${art.seriesTitle} • Episode ${art.episodeNumber}`}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    {role === "consumer" ? (
                      <>
                        <button
                          onClick={() => handleAddToLibrary(art._id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Add to Library
                        </button>

                        <button
                          onClick={() => !isFollowing && handleFollowArtist(art.artistInfo._id)}
                          className={`px-3 py-1 text-sm rounded ${
                            isFollowing
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                          disabled={isFollowing}
                        >
                          {isFollowing ? "Following" : "Follow Artist"}
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-gray-700">
                        Added to Library: {art.addedCount}
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/portfolio/${art.artistInfo.username}`}
                    className="mt-2 block text-sm text-blue-600 hover:underline"
                  >
                    View Artist
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
