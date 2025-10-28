import React from "react";
import imageSrc from "../../images/art1.jpg";

export default function Card({ image, title, onClick }) {
  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
      <img src={imageSrc} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 text-gray-700 font-medium">{title}</div>
    </div>
  );
}
