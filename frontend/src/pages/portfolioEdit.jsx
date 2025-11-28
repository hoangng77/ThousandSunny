import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/authProvider";
import { updatePortfolio } from "../route/artist";

export default function EditPortfolio() {
  const { user, setUser } = useContext(AuthContext);
  const { username } = useParams();

  // HOOKS
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [bio, setBio] = useState("");

  // Load current profile info into form
  useEffect(() => {
    if (user) {
      setBio(user.profile?.bio || "");
      setAvatarPreview(
        user.profile?.avatarUrl
          ? `http://localhost:5000${user.profile.avatarUrl}`
          : null
      );
    }
  }, [user]);

  // 1. Wait for Auth
  if (!user) return <div className="p-10">Loading...</div>;

  // 2. Permission check
  if (user.username !== username) {
    return (
      <div className="p-10 text-red-600">
        You are not allowed to edit this artist’s portfolio.
      </div>
    );
  }

  // Avatar handler
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Save button handler
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("bio", bio);
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      const res = await updatePortfolio(formData);

      alert("Portfolio updated!");

      // update local user context
      setUser((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          bio: res.data.profile.bio,
          avatarUrl: res.data.profile.avatarUrl,
        },
      }));
    } catch (err) {
      console.error(err);
      alert("Error updating portfolio.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Portfolio</h1>

      {/* Avatar Upload */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Profile Picture</label>

        <img
          src={avatarPreview || "/default-avatar.png"}
          alt="Preview"
          className="w-28 h-28 rounded-full object-cover mb-3 border"
        />

        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

      {/* Bio */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Bio</label>
        <textarea
          className="w-full p-3 border rounded"
          rows="4"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
}
