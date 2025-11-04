import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/profilePage/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data.profile);
        setBioDraft(data.profile.profile?.bio || "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [username]);

  const handleBioSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/profilePage/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio: bioDraft }),
      });
      const data = await res.json();
      if (res.ok) setUser({ ...user, profile: { ...user.profile, bio: bioDraft } });
      setIsEditingBio(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="h-screen w-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-6">
          <img
            src={user.profile?.avatarUrl || "/images/default-avatar.jpg"}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-2"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{user.username}</h1>
            {isEditingBio ? (
              <div>
                <textarea
                  className="border rounded-md p-2 w-full mt-2"
                  rows={3}
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                />
                <div className="mt-2 flex gap-2">
                  <button onClick={handleBioSave} className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setIsEditingBio(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 mt-2">
                {user.profile?.bio || "No bio yet."}
                <button onClick={() => setIsEditingBio(true)} className="text-indigo-600 ml-2 text-sm hover:underline">Edit</button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
