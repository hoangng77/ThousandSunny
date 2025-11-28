import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfile } from "../route/profile";
import { Card } from "../components/card";
import { AuthContext } from "../context/authProvider"; // import context

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useContext(AuthContext); // logged-in user

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      try {
        const res = await getProfile(username);

        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }

        const u = res.data.user;

        if (!cancelled) {
          setUser({
            username: u.username,
            bio: u.profile?.bio || "This user has no bio yet.",
            avatar: u.profile?.avatarUrl || null,
            preferredGenres: u.preferredGenres || [],
            library: u.library || [],
            followingCount: u.following?.length || 0,
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProfile();
    return () => (cancelled = true);
  }, [username]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (notFound) return <div className="text-center mt-20 text-red-600">Profile Not Found</div>;
  if (error) return <div className="text-center mt-20 text-red-600">{error}</div>;

  const isOwnProfile = currentUser?.username === username; // check ownership

  return (
    <div className="px-6 py-8">
      {/* Profile header */}
      <section className="bg-white p-8 shadow rounded-lg text-center">
        <img
          src={user.avatar ? `http://localhost:5000/${user.avatar}` : "default-avatar.png"}
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border"
          alt="Profile"
        />

        <h1 className="text-3xl font-semibold">{user.username}</h1>
        <p className="mt-2 text-gray-700">{user.bio}</p>

        <p className="mt-4 text-gray-600">
          <strong>Following:</strong> {user.followingCount}
        </p>

        {isOwnProfile && (
          <Link
            to={`/edit-profile/${user.username}`}
            className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </Link>
        )}
      </section>

      {/* Preferred Genres */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">Preferred Genres</h2>

        <div className="flex gap-2 flex-wrap">
          {user.preferredGenres.length === 0 && (
            <p className="text-gray-600">No preferred genres yet.</p>
          )}

          {user.preferredGenres.map((g) => (
            <span
              key={g._id}
              className="px-3 py-1 bg-gray-200 rounded-full text-sm"
            >
              {g.genre} ({g.count})
            </span>
          ))}
        </div>
      </section>

      {/* Library by Genre */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Library</h2>

        {user.library.length === 0 ? (
          <p className="text-gray-600">No artworks in library.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {user.library.map((item) => (
              <Card
                key={item._id}
                title={item.content?.title}
                image={`http://localhost:5000/${item.content.fileUrl}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
