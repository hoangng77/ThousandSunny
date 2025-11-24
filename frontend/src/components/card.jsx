import React from "react";
import imageSrc from "../../images/art1.jpg";

export function Card({ image, title, onClick }) {
  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
      <img src={imageSrc} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 text-gray-700 font-medium">{title}</div>
    </div>
  );
}

export function ProgressCard({ image, title, genre }) {
  return (
    <div className="relative rounded-lg overflow-hidden shadow group">
      
      {genre && (
        <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {genre}
        </span>
      )}

      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover group-hover:opacity-90"
      />

      <div className="p-3 bg-white">
        <p className="font-medium text-sm">{title}</p>
      </div>
    </div>
  );
}

