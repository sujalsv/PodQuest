import React from "react";
import { Link } from "react-router-dom";

const YourPodcasts = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 text-gray-800">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-3xl font-bold text-gray-900">Your Podcasts</h1>

        <Link
          to="/add-podcast"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg"
        >
          + Add Podcast
        </Link>
      </header>
    </div>
  );
};

export default YourPodcasts;
