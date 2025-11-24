import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProfile } from "../route/profile";
import { Card } from "../components/card";

export default function ProfilePage() {
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchProfile() {
      try {
        const res = await getProfile(username);

        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }

        const data = res.data;
        const u = data.user;   

        if (!cancelled) {
          setUser({
            name: u.username,
            profilePicture: u.profile?.avatarUrl || "",
            bio: u.profile?.bio || "Hello! This is my profile.",
            featuredArtworks: u.featuredArtworks || [],
            raw: data,
          });
        }

      } catch (err) {
        if (!cancelled) setError(err.message || "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [username]);

  if (loading) return <div className="text-center mt-20">Loading profile…</div>;
  if (error) return <div className="text-center mt-20 text-red-600">Error: {error}</div>;
  if (notFound || !user)
    return <h1 className="text-center mt-20 text-2xl text-red-600">Profile Not Found</h1>;

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-gray-50 px-6 py-8">
      <section className="bg-white shadow-sm p-8 flex flex-col items-center text-center rounded-lg mb-8">
        <div className="relative mb-4">
          <img
            src={user.profilePicture}
            alt={`${user.name}'s profile`}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
          />
        </div>

        <h1 className="text-3xl font-semibold text-gray-800 mb-2">{user.name}</h1>
        <p className="text-base mb-2 text-gray-800">{user.bio}</p>
      </section>

      <main className="flex-1">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Featured Artwork</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {user.featuredArtworks.length === 0 && (
            <div className="text-gray-600">No featured artworks yet.</div>
          )}

          {user.featuredArtworks.map((art) => (
            <div key={art._id || art.id || art.title} className="relative">
              <Card image={art.fileUrl || art.image || ""} title={art.title || "Untitled"} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
