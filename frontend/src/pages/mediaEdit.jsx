import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateMedia, getMedia } from "../route/artist";

export default function EditMedia() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // <-- success message

  const genres = [
    "Fantasy",
    "Romance",
    "Horror",
    "Action",
    "Comedy",
    "Drama",
    "Sci-Fi",
    "Mystery",
    "Slice of Life",
    "Adventure",
  ];

  // Load artwork details
  useEffect(() => {
    async function loadArtwork() {
      try {
        const res = await getMedia(id);
        const art = res.data;

        setForm({
          title: art.title || "",
          description: art.description || "",
          genre: art.genre || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load artwork");
      } finally {
        setLoading(false);
      }
    }

    loadArtwork();
  }, [id]);

  // Handle text/select fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); // reset success message

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("genre", form.genre);

      if (file) {
        formData.append("file", file);
      }

      await updateMedia(id, formData);

      // Show success notification
      setSuccess("Artwork updated successfully!");

      // Optional: auto-hide notification after 3 seconds
      setTimeout(() => setSuccess(""), 3000);

      // Optionally navigate back after update
      // navigate("/portfolio/me");
    } catch (err) {
      console.error(err);
      setError("Failed to update artwork");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-2xl font-bold mb-4">Edit Artwork</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>} {/* success notification */}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded h-28"
            required
          />
        </div>

        {/* Genre */}
        <div>
          <label className="block font-medium mb-1">Genre</label>
          <select
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select a genre</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <div>
          <label className="block font-medium mb-1">Replace Media (optional)</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update Artwork
        </button>
      </form>
    </div>
  );
}
