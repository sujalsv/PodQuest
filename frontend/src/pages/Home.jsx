import React from "react";

const Home = () => {
  return (
    <div
      className="h-screen w-full flex items-center justify-center relative bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSFT-A-man-at-a-microphone-creating-a-podcast?scl=1&fmt=png-alpha")',
      }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative text-white text-center max-w-2xl mx-4 p-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          PodQuest
        </h1>
        <p className="text-md md:text-lg mb-4">
          "Discover great stories and insights that make you smile!"
        </p>
        <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded text-lg">
          Start Exploring Podcasts
        </button>
      </div>
    </div>
  );
};

export default Home;
