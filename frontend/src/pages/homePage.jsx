import React from "react";
import Hero from "../components/hero";
import Card from "../components/card";

export default function Home() {
  const sampleContent = [
    { _id: 1, title: "Artwork 1", fileUrl: "https://placehold.co/400x300?text=Art+1" },
    { _id: 2, title: "Artwork 2", fileUrl: "https://placehold.co/400x300?text=Art+2" },
    { _id: 3, title: "Artwork 3", fileUrl: "https://placehold.co/400x300?text=Art+3" },
    { _id: 4, title: "Artwork 4", fileUrl: "https://placehold.co/400x300?text=Art+4" },
  ];

  return (
    <div className="flex flex-col flex-1 h-screen bg-gray-50">
      <Hero />

      <main className="flex-1 px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Discover</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sampleContent.map((item) => (
            <a href="/dashboard"><Card key={item._id} image={item.fileUrl} title={item.title} /></a>
          ))}
        </div>
      </main>
    </div>
  );
}
