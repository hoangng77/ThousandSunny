import React from "react";
import Hero from "../components/hero";
import Card from "../components/card";

export default function Dashboard() {

  return (
    <div className="flex flex-col flex-1 h-screen bg-gray-50">
      <main className="flex-1 px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800"></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <a href="/ProfileSettings"><Card key={"Profile Settings"} image={"/images/hi"} title={"Profile Settings"} /></a>
        </div>
      </main>
    </div>
  );
}
