import React, { useState, useEffect } from "react";

export default function Library() {
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/consumer/library`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLibrary(data.library);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLibrary();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">My Library</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {library.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded shadow">
            <img src={item.fileUrl} alt={item.title} className="w-full h-48 object-cover rounded" />
            <p className="mt-2 font-medium">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
