import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFollowing, followArtist, unfollowArtist } from "../route/consumer"; // your route helpers

export default function FollowingPage() {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFollowing = async () => {
    try {
      const res = await getFollowing();
      setFollowing(res.data.following || []);
    } catch (err) {
      setError(err.message || "Failed to fetch following");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, []);

  // Follow / Unfollow button handler
  const toggleFollow = async (artistId, isFollowing) => {
    try {
      if (isFollowing) {
        await unfollowArtist(artistId);
      } else {
        await followArtist(artistId);
      }
      fetchFollowing(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return <div className="text-center mt-20">Loading following...</div>;

  if (error)
    return <div className="text-center mt-20 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Following</h1>

      {following.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-gray-500 mb-4">
            You are not following any artists yet.
          </p>
          <Link
            to="/discover"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Discover Artists
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {following.map((artist) => (
            <div
              key={artist._id}
              className="flex items-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition"
            >
              <img
                src={artist.profile?.avatarUrl ? `http://localhost:5000/${artist.profile.avatarUrl}` : "/default-avatar.png"}
                alt={`${artist.username} avatar`}
                className="w-16 h-16 rounded-full object-cover"
              />

              <div className="ml-4 flex-1">
                <h2 className="text-lg font-semibold">{artist.username}</h2>
                <p className="text-sm text-gray-600">
                  {artist?.profile?.bio || "No bio available."}
                </p>
              </div>

              <button
                onClick={() => toggleFollow(artist._id, true)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Unfollow
              </button>

              <Link
                to={`/portfolio/${artist.username}`}
                className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
