import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PodcastCard from "../podcastCard/PodcastCard";

const YourPodcasts = () => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      const res = await axios.get(
        "http://localhost:3000/api/v1/get-user-podcasts",
        { withCredentials: true }
      );
      setPodcasts(res.data);
      console.log("API Response:", res.data); // Log the API response
    };
    fetchPodcasts();
  }, []);

  return (
    <div className="w-full mx-auto p-6 bg-gray-100 text-gray-800">
      {" "}
      {/* Changed max-w-4xl to w-full */}
      <header className="flex justify-between items-center py-4">
        <h1 className="text-3xl font-bold text-gray-900">Your Podcasts</h1>

        <Link
          to="/add-podcast"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg"
        >
          + Add Podcast
        </Link>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {podcasts.length > 0 ? (
          podcasts.map((item, i) => (
            <div key={i} className="flex justify-center">
              <PodcastCard items={item} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-lg text-gray-600">
            Loading podcasts...
          </div>
        )}
      </div>
    </div>
  );
};

export default YourPodcasts;
