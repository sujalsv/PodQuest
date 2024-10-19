import React from "react";
import { NavLink } from "react-router-dom";

const Categories = () => {
  // Hardcoded categories array with 10 entries
  const categories = [
    {
      name: "Comedy",
      color: "bg-yellow-500",
      to: "/categories/Comedy",
      image: "https://picsum.photos/200?random=1", // Placeholder image
    },
    {
      name: "Sports",
      color: "bg-blue-500",
      to: "/categories/Sports",
      image: "https://picsum.photos/200?random=2", // Placeholder image
    },
    {
      name: "Politics",
      color: "bg-red-500",
      to: "/categories/Politics",
      image: "https://picsum.photos/200?random=3", // Placeholder image
    },
    {
      name: "Education",
      color: "bg-green-500",
      to: "/categories/Education",
      image: "https://picsum.photos/200?random=4", // Placeholder image
    },
    {
      name: "Technology",
      color: "bg-purple-500",
      to: "/categories/Technology",
      image: "https://picsum.photos/200?random=5", // Placeholder image
    },
    {
      name: "Health",
      color: "bg-pink-500",
      to: "/categories/Health",
      image: "https://picsum.photos/200?random=6", // Placeholder image
    },
    {
      name: "Music",
      color: "bg-indigo-500",
      to: "/categories/Music",
      image: "https://picsum.photos/200?random=7", // Placeholder image
    },
    {
      name: "Science",
      color: "bg-teal-500",
      to: "/categories/Science",
      image: "https://picsum.photos/200?random=8", // Placeholder image
    },
    {
      name: "History",
      color: "bg-orange-500",
      to: "/categories/History",
      image: "https://picsum.photos/200?random=9", // Placeholder image
    },
    {
      name: "Travel",
      color: "bg-cyan-500",
      to: "/categories/Travel",
      image: "https://picsum.photos/200?random=10", // Placeholder image
    },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {categories.map((category, index) => (
          <NavLink
            key={index}
            to={category.to}
            className={`p-4 rounded-lg shadow-lg ${category.color} hover:shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out`}
          >
            <div className="flex flex-col items-center justify-center">
              <img
                src={category.image}
                alt={category.name}
                className="w-24 h-24 object-cover rounded-full mb-4"
              />
              <h3 className="text-lg font-semibold text-white">
                {category.name}
              </h3>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Categories;
