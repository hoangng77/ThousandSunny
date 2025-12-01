import React from "react";
import Hero from "../components/hero";
import { Link } from "react-router-dom";
// Home Page Component
export default function Home() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  // Render home page with hero section and call-to-action
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Hero />

      <main className="flex-1 px-6 py-12 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Today is {today}.
        </h2>

        <p className="text-lg text-gray-600 mb-8 max-w-xl">
          Ready to dive into a world of creativity, imagination, and powerful artwork?
          Join our community and share your art with the world.
        </p>

        <Link
          to="/register"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Get Started — Register Now
        </Link>
      </main>
    </div>
  );
}
