import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const InputPodcast = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  console.log(isLoggedIn);

  // State for the front image and dragging
  const [frontImage, setFrontImage] = useState(null);
  const [dragging, setDragging] = useState(false);

  // State for audio file and inputs
  const [audioFile, setAudioFile] = useState(null);
  const [Inputs, setInputs] = useState({
    title: "",
    description: "",
    category: "",
  });

  // Handle file change for the front image
  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFrontImage(file);
      setDragging(false);
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDropImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFrontImage(file);
    }
    setDragging(false);
  };

  // Handle audio file change
  const handleAudioFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file); // Set the audio file state
    }
  };

  // Handle input changes
  const handleChangeInputs = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  // Handle podcast submission
  const handleSubmitPodcast = async () => {
    if (
      !Inputs.title ||
      !Inputs.description ||
      !Inputs.category ||
      !frontImage ||
      !audioFile
    ) {
      toast.error("Please fill in all fields and upload the required files.");
      return;
    }

    const data = new FormData();
    console.log(Inputs, frontImage, audioFile);
    data.append("title", Inputs.title);
    data.append("description", Inputs.description);
    data.append("category", Inputs.category);
    data.append("frontImage", frontImage);
    data.append("audioFile", audioFile);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/add-podcast",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Allow credentials like cookies
        }
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(
        "Error adding podcast: " +
          (error.response ? error.response.data : error.message)
      );
    } finally {
      setInputs({ title: "", description: "", category: "" });
      setFrontImage(null);
      setAudioFile(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      {/* Toast Container for notifications */}
      <ToastContainer />

      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Create Your Podcast
      </h1>

      {/* Flexbox for layout */}
      <div className="flex items-start space-x-6">
        {/* Drag and Drop Square */}
        <div
          className={`border-2 border-dashed border-gray-300 rounded-lg w-48 h-48 flex justify-center items-center cursor-pointer bg-gray-50 transition-colors duration-200 ${
            dragging ? "bg-blue-100" : ""
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDropImage}
        >
          <input
            type="file"
            accept="image/*"
            id="file"
            name="frontImage"
            className="hidden"
            onChange={handleChangeImage}
          />
          <label
            htmlFor="file"
            className="text-center w-full h-full flex items-center justify-center"
          >
            {frontImage ? (
              <img
                src={URL.createObjectURL(frontImage)}
                alt="Thumbnail"
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <span className="block text-gray-500 text-sm font-medium">
                Drag & drop
                <br />
                or
                <br />
                Click to browse
              </span>
            )}
          </label>
        </div>

        {/* Right side form */}
        <div className="flex flex-col space-y-4 w-full">
          {/* Title input */}
          <div>
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Title for your podcast"
              value={Inputs.title}
              onChange={handleChangeInputs}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description textarea */}
          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description for your podcast"
              rows="4"
              value={Inputs.description}
              onChange={handleChangeInputs}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Audio file input */}
          <div>
            <label
              htmlFor="audiofile"
              className="block text-gray-700 font-medium mb-2"
            >
              Select Audio
            </label>
            <input
              type="file"
              accept=".mp3, .wav, .m4a, .ogg"
              id="audiofile"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleAudioFile}
            />
          </div>

          {/* Category select */}
          <div>
            <label
              htmlFor="category"
              className="block text-gray-700 font-medium mb-2"
            >
              Select Category
            </label>
            <select
              name="category"
              id="category"
              value={Inputs.category}
              onChange={handleChangeInputs}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="comedy">Comedy</option>
              <option value="sports">Sports</option>
              <option value="politics">Politics</option>
              <option value="education">Education</option>
              <option value="technology">Technology</option>
              <option value="health">Health</option>
              <option value="music">Music</option>
              <option value="science">Science</option>
              <option value="history">History</option>
              <option value="travel">Travel</option>
            </select>
          </div>

          {/* Create Podcast Button */}
          <div>
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleSubmitPodcast}
            >
              Create Podcast
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPodcast;
