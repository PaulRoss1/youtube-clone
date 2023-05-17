import "./App.css";
import React, { useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import MainContent from "./Components/MainContent/MainContent";
import Filter from "./Components/Filter/Filter";
import Sidebar from "./Components/Sidebar/Sidebar";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            q: searchTerm,
            maxResults: 10,
            key: "AIzaSyAOD-RnNGkLfM1WQKtr7R3NNPXluSK0I-8",
            type: "video",
          },
        }
      );

      // Extract video IDs from the response
      const videoIds = response.data.items.map((video) => video.id.videoId);

      // Retrieve statistics for the videos
      const statisticsResponse = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "statistics",
            id: videoIds.join(","),
            key: "AIzaSyAOD-RnNGkLfM1WQKtr7R3NNPXluSK0I-8",
          },
        }
      );

      // Create an object mapping video IDs to their respective statistics
      const videoStatistics = statisticsResponse.data.items.reduce(
        (acc, video) => ({
          ...acc,
          [video.id]: video.statistics,
        }),
        {}
      );

      // Combine the video data with the statistics
      const videosWithStatistics = response.data.items.map((video) => ({
        ...video,
        statistics: videoStatistics[video.id.videoId],
      }));

      // Update the videos state with the fetched data
      setVideos(videosWithStatistics);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
      />
      <Filter />
      <MainContent videos={videos} />
      <Sidebar />
    </div>
  );
}

export default App;
