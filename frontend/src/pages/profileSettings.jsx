import React, { useState } from "react";
import Card from "../components/card";

export default function ProfileSettings() {
  const [user, setUser] = useState({
    name: "Akiha Tohno",
    profilePicture: "/images/profile-pic.jpg",
    bio: "I am an artist",
    featuredArtworks: [
      { _id: 1, title: "Art 1", fileUrl: "/images/art1.jpg" },
      { _id: 2, title: "Art 2", fileUrl: "/images/art2.jpg" },
      { _id: 3, title: "Art 3", fileUrl: "/images/art3.jpg" },
    ],
  });

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(user.bio);

  const [newArtwork, setNewArtwork] = useState({ title: "", fileUrl: "" });

  // Profile picture upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUser({ ...user, profilePicture: url });
    }
  };

  // Bio handlers
  const handleBioClick = () => {
    setBioDraft(user.bio);
    setIsEditingBio(true);
  };

  const handleBioChange = (e) => setBioDraft(e.target.value);

  const handleBioSave = () => {
    setUser({ ...user, bio: bioDraft });
    setIsEditingBio(false);
  };

  const handleBioKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleBioSave();
    }
  };

  // Artwork handlers
  const handleAddArtwork = () => {
    if (!newArtwork.title || !newArtwork.fileUrl) return;
    const id = user.featuredArtworks.length
      ? Math.max(...user.featuredArtworks.map((a) => a._id)) + 1
      : 1;
    setUser({
      ...user,
      featuredArtworks: [...user.featuredArtworks, { _id: id, ...newArtwork }],
    });
    setNewArtwork({ title: "", fileUrl: "" });
  };

  const handleRemoveArtwork = (id) => {
    setUser({
      ...user,
      featuredArtworks: user.featuredArtworks.filter((a) => a._id !== id),
    });
  };

  const handleArtworkTitleChange = (id, newTitle) => {
    setUser({
      ...user,
      featuredArtworks: user.featuredArtworks.map((art) =>
        art._id === id ? { ...art, title: newTitle } : art
      ),
    });
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-gray-50 px-6 py-8">
      <section className="bg-white shadow-sm p-8 flex flex-col items-center text-center rounded-lg mb-8">
        <div className="relative mb-4">
          <img
            src={user.profilePicture}
            alt={`${user.name}'s profile`}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
          />
          <input
            id="profilePicInput"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setUser({ ...user, profilePicture: url });
              }
            }}
            className="hidden"
          />
          <label
            htmlFor="profilePicInput"
            className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm cursor-pointer">
            ✎
          </label>
        </div>


        <h1 className="text-3xl font-semibold text-gray-800 mb-2">{user.name}</h1>

        <div className="max-w-md text-center">
          {isEditingBio ? (
            <textarea
              className="border p-2 rounded-md w-full"
              value={bioDraft}
              onChange={handleBioChange}
              onBlur={handleBioSave}
              onKeyDown={handleBioKeyDown}
              autoFocus
              rows={3}
            />
          ) : (
            <p
              onClick={handleBioClick}
              className="text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
            >
              {user.bio || "Click to add a bio"}
            </p>
          )}
        </div>
      </section>

      <main className="flex-1">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Featured Artwork</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {user.featuredArtworks.map((art) => (
            <div key={art._id} className="relative">
              <Card image={art.fileUrl} title={art.title} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
