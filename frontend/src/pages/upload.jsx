import React, { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/artist/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        alert("Upload successful!");
        setTitle("");
        setFile(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Upload Artwork</h1>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-indigo-600 text-white py-2 rounded">Upload</button>
      </form>
    </div>
  );
}
