import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { playerActions } from "../../store/player";

const PodcastCard = ({ items }) => {
  console.log(items);
  const frontImage = items?.frontImage?.replace(/\\/g, "/") || "";
  const imageUrl = `http://localhost:3000/${frontImage}`;
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handlePlay = (e) => {
    if (isLoggedIn) {
      e.preventDefault();
      dispatch(playerActions.setDiv());
      dispatch(
        playerActions.changeImage(`http://localhost:3000/${frontImage}`)
      );
      dispatch(
        playerActions.changeSong(`http://localhost:3000/${items.audioFile}`)
      );
    }
  };

  // Uniform category background color
  const categoryBackgroundColor = "bg-gray-300"; // Choose a uniform background color
  const categoryFont = "font-bold"; // Use a bolder font for the category

  return (
    <div className="border-2 border-gray-800 rounded-lg overflow-hidden shadow-md m-4 transition-transform duration-200 hover:scale-105 w-64 bg-gray-100">
      <Link
        to={`/description/${items?._id}`}
        className="block text-gray-800 no-underline"
      >
        <div className="flex flex-col items-center h-full">
          {/* Podcast Cover Image */}
          <div className="w-full h-48">
            <img
              src={imageUrl}
              alt="Podcast Cover"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Podcast Title */}
          <div className="font-bold text-xl my-2 text-center">
            {items?.title?.slice(0, 20)}...
          </div>
          {/* Podcast Description */}
          <div className="text-gray-600 text-md mb-2 text-center">
            {items?.description?.slice(0, 50)}...
          </div>
          {/* Podcast Category with Shadow and Margin */}
          <div
            className={`border border-gray-600 rounded-full px-4 py-1 text-center text-gray-600 ${categoryBackgroundColor} ${categoryFont} mb-2`}
          >
            {items?.category?.categoryName}
          </div>
          {/* Play Button with Margin */}
          <div className="flex justify-center mb-2">
            <Link
              to={isLoggedIn ? "#" : "/Signup"}
              className="bg-slate-900 text-white rounded px-4 py-2 transition-colors duration-200 hover:bg-gray-600"
              onClick={handlePlay}
            >
              Play
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PodcastCard;
