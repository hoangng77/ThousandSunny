import React, { useState, useEffect, useContext } from "react";
import { getPortfolio } from "../route/portfolio";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authProvider";

export default function Portfolio() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [artist, setArtist] = useState(null);
  const [media, setMedia] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await getPortfolio(username);
        setArtist(res.data.artist);
        setMedia(res.data.media);
        setFollowers(res.data.followers);
      } catch (err) {
        console.error("Portfolio error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (username) loadPortfolio();
  }, [username]);

  if (loading) {
    return <div className="text-center mt-20 text-gray-600">Loading portfolio…</div>;
  }

  if (!artist) {
    return <div className="text-center mt-20 text-red-600">Artist not found.</div>;
  }

  const canEdit = currentUser && currentUser.id === artist._id;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-4 justify-between">
        <div className="flex items-center gap-4">
          <img
            src={artist.profile?.avatarUrl ? `http://localhost:5000${artist.profile.avatarUrl}` : "/default-avatar.png"}
            alt={artist.username}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{artist.username}</h1>
            <p className="text-gray-600">{artist.profile?.bio}</p>
            <p className="text-gray-600 mt-1">Followers: {followers.length}</p>
            {artist.preferredGenres?.length > 0 && (
              <p className="text-gray-600 mt-1">
                Genres: {artist.preferredGenres.map(g => g.genre).join(", ")}
              </p>
            )}
          </div>
        </div>

        {canEdit && (
          <button
            onClick={() => navigate(`/edit-portfolio/${artist.username}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Portfolio
          </button>
        )}
      </div>

      {followers.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          {followers.map(f => (
            <Link key={f._id} to={`/profile/${f.username}`} title={f.username}>
              <img
                src={f.profile?.avatarUrl ? `http://localhost:5000${f.profile.avatarUrl}` : "/default-avatar.png"}
                alt={f.username}
                className="w-10 h-10 rounded-full object-cover border"
              />
            </Link>
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Artworks</h2>
      {media.length === 0 ? (
        <p className="text-gray-500">This artist has not uploaded anything yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {media.map((art) => (
            <div key={art._id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition">
              <img
                src={`http://localhost:5000${art.fileUrl}`}
                alt={art.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <h3 className="font-semibold">{art.title}</h3>
                <p className="text-sm text-gray-500">Genre: {art.genre}</p>
                {art.contentType === "series" && (
                  <p className="text-sm text-gray-600">Episode {art.episodeNumber}</p>
                )}
                <Link
                  to={`/art/${art._id}`}
                  className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                >
                  View Artwork
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
