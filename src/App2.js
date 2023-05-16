import React, { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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
            maxResults: 5,
            key: "AIzaSyBy1-TkNKbIUTqh7TOpZYKhl2cysl7JriI",
            type: "video",
          },
        }
      );

      const videoIds = response.data.items.map((video) => video.id.videoId);
      const statisticsResponse = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "statistics",
            id: videoIds.join(","),
            key: "AIzaSyBy1-TkNKbIUTqh7TOpZYKhl2cysl7JriI",
          },
        }
      );

      const videoStatistics = statisticsResponse.data.items.reduce(
        (acc, video) => ({
          ...acc,
          [video.id]: video.statistics,
        }),
        {}
      );

      const videosWithStatistics = response.data.items.map((video) => ({
        ...video,
        statistics: videoStatistics[video.id.videoId],
      }));

      setVideos(videosWithStatistics);
    } catch (error) {
      console.error(error);
    }
  };

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
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search YouTube videos"
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {videos.map((video) => (
          <li key={video.id.videoId}>
            <img
              src={video.snippet.thumbnails.default.url}
              alt={video.snippet.title}
            />
            <div>
              <h3>{video.snippet.title}</h3>
              <p>Channel: {video.snippet.channelTitle}</p>
              <p>
                Views: {formatViewCount(video.statistics?.viewCount) || "N/A"}
              </p>
              <p>Published: {dayjs(video.snippet.publishedAt).fromNow()}</p>
              <p>Description: {video.snippet.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YouTubeSearch;
