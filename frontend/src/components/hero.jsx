import React from "react";

export default function Hero() {
  return (
    <section className="relative w-full h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
      <img src="https://placehold.co/1200x400" alt="banner" className="object-cover w-full h-full opacity-80" />
      <h1 className="absolute text-3xl font-semibold text-white drop-shadow-lg">Welcome to DreamCircle</h1>
    </section>
  );
}
