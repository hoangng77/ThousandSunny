import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authProvider";
import { updatePortfolio } from "../route/portfolio";

export default function PortfolioEdit() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (user) {
      setBio(user.profile?.bio || "");

      const url = user.profile?.avatarUrl;
      setAvatarPreview(`http://localhost:5000${url}`);
    }
  }, [user]);

  if (!user) return <div className="p-10">Loading...</div>;
  if (user.username !== username)
    return (
      <div className="p-10 text-red-600">
        Unauthorized to edit this artist’s portfolio.
      </div>
    );

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
      const res = await updatePortfolio(formData);

      const updated = res.data.user.profile;

      setUser((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          bio: updated.bio,
          avatarUrl: updated.avatarUrl,
        },
      }));

      alert("Portfolio updated!");
      navigate(`/portfolio/${username}`);
    } catch (err) {
      console.error(err);
      alert("Error updating portfolio.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Portfolio</h1>

      <div className="mb-6">
        <label className="block font-medium mb-2">Profile Picture</label>
        <img
          src={avatarPreview || "/default-avatar.png"}
          alt="avatar"
          className="w-28 h-28 rounded-full object-cover mb-3 border"
        />
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

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
