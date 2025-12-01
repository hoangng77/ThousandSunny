import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { uploadMedia } from "../route/artist";
// Upload Page Component
export default function Upload() {
  const navigate = useNavigate();
  const location = useLocation();

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [contentType, setContentType] = useState("single");

  const [seriesTitle, setSeriesTitle] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [seriesId, setSeriesId] = useState("");
  // Available genres
  const GENRES = [
    "Fantasy","Romance","Horror","Action","Comedy",
    "Drama","Sci-Fi","Mystery","Slice of Life","Adventure",
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qSeriesId = params.get("seriesId");
    const qSeriesTitle = params.get("seriesTitle");
    const qGenre = params.get("genre");

    if (qSeriesId) {
      setContentType("series");
      setSeriesId(qSeriesId);
      if (qSeriesTitle) setSeriesTitle(qSeriesTitle);
      if (qGenre) setGenre(qGenre);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSeries = contentType === "series";

    if (!title.trim()) return alert("Please enter a title.");
    if (!genre) return alert("Please select a genre.");
    if (!file) return alert("Please select a file.");

    if (isSeries) {
      if (!seriesTitle.trim()) return alert("Series title is required.");
      if (!episodeNumber || Number(episodeNumber) <= 0)
        return alert("Provide a valid episode number.");
      if (!seriesId.trim()) return alert("Series ID is required.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("genre", genre);

    if (isSeries) {
      formData.append("seriesTitle", seriesTitle);
      formData.append("episodeNumber", episodeNumber);
      formData.append("seriesId", seriesId);
    }

    try {
      await uploadMedia(formData, isSeries);
      alert("Upload successful!");
      navigate("/progress"); // redirect to progress
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };
 // Render upload form
  return (
    <div className="min-h-screen p-8 bg-gray-50 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-xl font-semibold">Upload Artwork</h1>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="single"
              checked={contentType === "single"}
              onChange={(e) => setContentType(e.target.value)}
            />
            Single Media
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="series"
              checked={contentType === "series"}
              onChange={(e) => setContentType(e.target.value)}
            />
            Serialized Content
          </label>
        </div>

        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">Select Genre</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {contentType === "series" && (
          <>
            <input
              className="border p-2 rounded"
              type="text"
              placeholder="Series Title (required)"
              value={seriesTitle}
              onChange={(e) => setSeriesTitle(e.target.value)}
            />

            <input
              className="border p-2 rounded"
              type="number"
              placeholder="Episode Number (required)"
              value={episodeNumber}
              onChange={(e) => setEpisodeNumber(e.target.value)}
            />

            <input
              className="border p-2 rounded"
              type="text"
              placeholder="Series ID (required)"
              value={seriesId}
              onChange={(e) => setSeriesId(e.target.value)}
            />
          </>
        )}

        <input
          className="border p-2 rounded"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit" className="bg-indigo-600 text-white py-2 rounded">
          Upload
        </button>
      </form>
    </div>
  );
}
