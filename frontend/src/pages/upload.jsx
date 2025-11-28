import React, { useState } from "react";
import { uploadMedia } from "../route/artist";
import { GENRES } from "../../constant/genres";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [contentType, setContentType] = useState("single");

  // Series fields
  const [seriesTitle, setSeriesTitle] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [isOriginalWork, setIsOriginalWork] = useState(false);
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOriginalWork) {
      alert("You must confirm that this is your original work.");
      return;
    }
    if (!genre) {
      alert("Please select a genre.");
      return;
    }

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    const isSeries = contentType === "series";

    // Series validation
    if (isSeries) {
      if (!seriesTitle.trim()) {
        alert("Series title is required for serialized content.");
        return;
      }
      if (!episodeNumber || Number(episodeNumber) <= 0) {
        alert("Please provide a valid episode number.");
        return;
      }
      if (!seriesId.trim()) {
        alert("Series ID is required for serialized content.");
        return;
      }
    }

    // Build the form
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

      // Reset
      setTitle("");
      setDescription("");
      setGenre("");
      setFile(null);
      setSeriesTitle("");
      setEpisodeNumber("");
      setSeriesId("");
      setContentType("single");

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-xl font-semibold">Upload Artwork</h1>

        {/* Content type selection */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input 
              type="radio" 
              value="single" 
              checked={contentType === "single"} 
              onChange={(e) => setContentType(e.target.value)} 
            />{/*
            */}Single Media
          </label>

          <label className="flex items-center gap-2">
            <input 
              type="radio" 
              value="series" 
              checked={contentType === "series"} 
              onChange={(e) => setContentType(e.target.value)} 
            />{/*
            */}Serialized Content
          </label>
        </div>

        {/* Basic Inputs */}
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

        {/* Series fields */}
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

        {/* Upload File */}
        <input
          className="border p-2 rounded"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label>
          <input type="checkbox" onChange={(e) => setIsOriginalWork(e.target.checked)}/> I confirm that this is my original work.
        </label>
        <button type="submit" className="bg-indigo-600 text-white py-2 rounded">
          Upload
        </button>
      </form>
    </div>
  );
}
