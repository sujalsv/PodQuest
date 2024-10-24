import React, { useEffect, useRef, useState } from "react";
import { IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";
import { FaRegPlayCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { playerActions } from "../../store/player";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";

const AudioPlayer = () => {
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const dispatch = useDispatch();

  // Player state from Redux
  const isPlayerVisible = useSelector((state) => state.player.isPlayerDiv);
  const songPath = useSelector((state) => state.player.songPath);
  const img = useSelector((state) => state.player.img);

  // Authentication state from Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const audioRef = useRef();

  // Time formatting
  const formatTime = (time) => {
    const minute = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minute}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // Handle closing the player
  const closeAudioPlayerDiv = (e) => {
    e.preventDefault();
    dispatch(playerActions.closeDiv());
    dispatch(playerActions.changeImage(""));
    dispatch(playerActions.changeSong(""));
    setIsPlaying(false); // Reset play state when closing
  };

  // Toggle play/pause
  const handlePlayPodcast = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const backward = () => {
    let newTime = Math.max(currentTime - 10, 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const forward = () => {
    let newTime = Math.min(currentTime + 10, duration);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  useEffect(() => {
    const currentAudio = audioRef.current;
    if (currentAudio) {
      currentAudio.addEventListener("timeupdate", handleTimeUpdate);
      currentAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    // Cleanup event listeners
    return () => {
      if (currentAudio) {
        currentAudio.removeEventListener("timeupdate", handleTimeUpdate);
        currentAudio.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      }
    };
  }, [songPath]);

  useEffect(() => {
    if (songPath && audioRef.current) {
      // Automatically play the song when the path changes
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [songPath]);

  // Conditionally render the Audio Player only if the user is authenticated and the player is visible
  if (!isLoggedIn || !isPlayerVisible) {
    return null; // Don't render if the user is not logged in or player is hidden
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-800 text-zinc-300 p-1 rounded-lg flex items-center gap-1">
      {/* Album art / Thumbnail */}
      <div className="w-10 h-10 flex-shrink-0">
        <img
          src={img}
          alt="Album Art"
          className="w-full h-full rounded-full object-cover"
        />
      </div>

      {/* Controls and Progress */}
      <div className="flex flex-col items-center justify-center w-full gap-1">
        <div className="flex items-center justify-center gap-3">
          <button className="hover:text-white" onClick={backward}>
            <IoPlaySkipBack />
          </button>
          <button onClick={handlePlayPodcast} className="hover:text-white">
            {isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
          </button>
          <button className="hover:text-white" onClick={forward}>
            <IoPlaySkipForward />
          </button>
        </div>
        <div className="w-full flex-grow">
          <input
            type="range"
            min="0"
            max="100"
            value={(currentTime / duration) * 100 || 0}
            onChange={handleSeek}
            className="w-full hover:cursor-pointer"
          />
        </div>
        <div className="w-full flex justify-between text-xs">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Close button */}
      <div
        className="flex items-center justify-end w-auto"
        onClick={closeAudioPlayerDiv}
      >
        <button className="text-sm hover:text-red-500">
          <ImCross />
        </button>
      </div>

      <audio ref={audioRef} src={songPath} />
    </div>
  );
};

export default AudioPlayer;
