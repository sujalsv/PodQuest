import React, { useEffect, useState } from "react";
import axios from "axios";
import PodcastCard from "../components/podcastCard/PodcastCard";

const AllPodcasts = () => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      const res = await axios.get("http://localhost:3000/api/v1/get-podcasts");
      setPodcasts(res.data);
    };
    fetchPodcasts();
  }, []);

  console.log(podcasts); // Use this for debugging

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Podcasts</h1>
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

export default AllPodcasts;
