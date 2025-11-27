import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/authProvider";
import { updateProfile } from "../route/profile";

export default function ProfileEdit() {
  const { user, setUser } = useContext(AuthContext);
  const { username } = useParams();

  // HOOKS FIRST: always run
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [bio, setBio] = useState("");

  // Initialize form data
  useEffect(() => {
    if (user) {
      setBio(user.profile?.bio || "");
      setAvatarPreview(user.profile?.avatarUrl || null);
    }
  }, [user]);

  // Early returns after hooks
  if (!user) {
    return <div className="p-10">Loading...</div>;
  }

  if (user.username !== username) {
    return <div className="p-10 text-red-600">Unauthorized to edit this profile.</div>;
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("bio", bio);
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      const res = await updateProfile(formData);
      alert("Profile updated!");
      setUser((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          bio: res.data.bio,
          avatarUrl: res.data.avatarUrl,
        },
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      {/* Avatar */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Avatar</label>
        <img
          src={avatarPreview || "/default-avatar.png"}
          alt="Avatar preview"
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

      <button
        onClick={handleSave}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
}
