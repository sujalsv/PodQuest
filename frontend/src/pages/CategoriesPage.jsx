import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PodcastCard from "../components/podcastCard/PodcastCard";

const CategoriesPage = () => {
  const { categoryName } = useParams();
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true); // Set loading to true when fetch starts
        const res = await axios.get(
          `http://localhost:3000/api/v1/categories/${categoryName}`,
          { withCredentials: true }
        );
        console.log("API Response:", res.data);
        setPodcasts(res.data.data); // Set podcasts from response or empty array
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching completes
      }
    };
    fetchPodcasts();
  }, [categoryName]); // Fetch podcasts whenever the category name changes

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 text-gray-800">
      {loading ? ( // Show loading spinner while fetching
        <div className="text-center text-lg text-gray-600">
          Loading podcasts...
        </div>
      ) : podcasts.length > 0 ? ( // If podcasts are available, display them
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {podcasts.map((item, i) => (
            <div key={i} className="flex justify-center">
              <PodcastCard items={item} />
            </div>
          ))}
        </div>
      ) : (
        // If no podcasts are available, show this message
        <div className="text-center text-lg text-gray-600">
          No podcasts available.
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
