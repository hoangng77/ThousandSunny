import React, { useState } from "react";
import { uploadMedia } from "../route/artist";
import { GENRES } from "../../constant/genres";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [contentType, setContentType] = useState("single");
  const [seriesTitle, setSeriesTitle] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [seriesId, setSeriesId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!genre) {
      alert("Please select a genre.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("genre", genre);

    const isSeries = contentType === "series";

    if (isSeries) {
      formData.append("seriesTitle", seriesTitle);
      formData.append("episodeNumber", episodeNumber);
      if (seriesId) formData.append("seriesId", seriesId);
    }

    try {
      await uploadMedia(formData, isSeries);
      alert("Upload successful!");

      // reset
      setTitle("");
      setFile(null);
      setDescription("");
      setGenre("");
      setSeriesTitle("");
      setEpisodeNumber("");
      setSeriesId("");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md flex flex-col gap-4">
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

        <input className="border p-2 rounded" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <input className="border p-2 rounded" type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <select
          className="border p-2 rounded"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">Select Genre</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {contentType === "series" && (
          <>
            <input className="border p-2 rounded" type="text" placeholder="Series Title" value={seriesTitle} onChange={(e) => setSeriesTitle(e.target.value)} />
            <input className="border p-2 rounded" type="number" placeholder="Episode Number" value={episodeNumber} onChange={(e) => setEpisodeNumber(e.target.value)} />
            <input className="border p-2 rounded" type="text" placeholder="Series ID (optional)" value={seriesId} onChange={(e) => setSeriesId(e.target.value)} />
          </>
        )}

        {/* File Upload */}
        <input className="border p-2 rounded" type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button type="submit" className="bg-indigo-600 text-white py-2 rounded">Upload</button>
      </form>
    </div>
  );
}
