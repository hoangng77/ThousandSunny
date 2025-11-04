import React from "react";
import bannerImage from "../../images/bannerImage.jpg";

export default function Hero() {
  return (
    <section className="relative w-full h-64 bg-gray-200 flex items-center justify-center overflow-hidden rounded-2xl">
    <img
      src={bannerImage}
      alt="banner"
      className="object-cover w-full h-full opacity-100 rounded-2xl"
    />
    <h1 className="absolute text-3xl font-semibold text-white drop-shadow-lg"> Welcome to DreamCircle </h1>
    </section>
  );
}
