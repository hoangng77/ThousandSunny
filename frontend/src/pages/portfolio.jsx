import React, { useState, useEffect } from "react";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/artist/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPortfolio(data.media);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPortfolio();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">My Portfolio</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {portfolio.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded shadow">
            <img src={item.fileUrl} alt={item.title} className="w-full h-48 object-cover rounded" />
            <p className="mt-2 font-medium">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
