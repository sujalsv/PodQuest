import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DescriptionPage = () => {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null); // Keep this null initially
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        setLoading(true); // Start loading
        const res = await axios.get(
          `http://localhost:3000/api/v1/get-podcast/${id}`,
          { withCredentials: true }
        );
        console.log("API Response:", res.data); // Check the API response
        setPodcast(res.data); // Assuming `res.data` is the podcast object
      } catch (error) {
        console.error("Error fetching podcast:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchPodcast();
  }, [id]); // Dependency on `id` to refetch if it changes

  useEffect(() => {
    console.log("Updated podcast:", podcast); // Log the updated podcast
  }, [podcast]); // This effect will trigger when `podcast` is updated

  return (
    <div className="flex p-4">
      {loading ? (
        <div>Loading...</div>
      ) : podcast ? (
        <>
          {/* Left Side: Image */}
          <div className="flex-shrink-0 w-1/2">
            <img
              src={`http://localhost:3000/${podcast.frontImage}`} // Correct URL for the image
              alt="Podcast FrontImage"
              className="w-full h-auto object-cover" // Responsive image styling
            />
          </div>
          {/* Right Side: Text Information */}
          <div className="ml-4 w-1/2 flex flex-col justify-start">
            {" "}
            {/* Adjust to justify-start */}
            <h2 className="text-2xl font-bold mb-2">{podcast.title}</h2>{" "}
            {/* Title */}
            <p className="text-gray-700 mb-4">{podcast.description}</p>{" "}
            {/* Description */}
            <div className="text-gray-500 text-sm">
              {podcast?.category?.categoryName}
            </div>{" "}
            {/* Category */}
          </div>
        </>
      ) : (
        <div>No podcast found</div>
      )}
    </div>
  );
};

export default DescriptionPage;
