import React, { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Search = ({ searchTerm, setSearchTerm, handleSearch }) => {
  return (
    <>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search YouTube videos"
      />
      <button onClick={handleSearch}>Search</button>
    </>
  );
};

const List = ({ videos }) => {
  const formatViewCount = (views) => {
    if (views >= 1e9) {
      return (views / 1e9).toFixed(1) + "B";
    } else if (views >= 1e6) {
      return (views / 1e6).toFixed(1) + "M";
    } else if (views >= 1e3) {
      return (views / 1e3).toFixed(1) + "K";
    } else {
      return views.toString();
    }
  };

  return (
    <>
      {videos ? (
        <ul>
          {videos.map((video) => (
            <li key={video.id.videoId}>
              <img
                src={video.snippet.thumbnails.high.url}
                alt={video.snippet.title}
              />
              <div>
                <h3>{video.snippet.title}</h3>
                <p>Channel: {video.snippet.channelTitle}</p>
                {video.channelImageUrl && (
                  <img
                    src={video.channelImageUrl}
                    alt={video.snippet.channelTitle}
                  />
                )}
                <p>
                  Views: {formatViewCount(video.statistics?.viewCount) || "N/A"}
                </p>
                <p>Published: {dayjs(video.snippet.publishedAt).fromNow()}</p>
                <p>Description: {video.snippet.description}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

const YouTubeSearch = () => {
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
    <div>
      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
      />
      <List videos={videos} />
    </div>
  );
};

export default YouTubeSearch;
