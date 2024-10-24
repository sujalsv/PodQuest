import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer/AudioPlayer";

const MainLayout = () => {
  return (
    <div className="relative">
      <Navbar />
      <div className="mt-16 pb-20">
        {" "}
        {/* Add padding to the bottom */}
        <Outlet />
      </div>
      <AudioPlayer /> {/* Keep it directly in the layout */}
    </div>
  );
};


export default MainLayout;
