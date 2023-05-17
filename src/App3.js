import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const YouTubeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState([]);

  // Function to handle the search for YouTube videos
  const handleSearch = async () => {
    console.log("2nd");
    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            q: searchTerm,
            maxResults: 10,
            key: "AIzaSyDJIkxHQWDT6jqOFVuWqhe2oWfgFd-PFz4",
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
            key: "AIzaSyDJIkxHQWDT6jqOFVuWqhe2oWfgFd-PFz4",
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

  const formatViewCount = (views) => {
    console.log("3rd");
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

  // ADD LATER FOR CHANNEL IMAGE !!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  useEffect(() => {
    console.log("4th");
    const fetchChannelDetails = async (channelId) => {
      console.log("A");
      try {
        const response = await axios.get(
          "https://www.googleapis.com/youtube/v3/channels",
          {
            params: {
              part: "snippet",
              id: channelId,
              key: "AIzaSyDJIkxHQWDT6jqOFVuWqhe2oWfgFd-PFz4",
            },
          }
        );

        if (response.data.items.length > 0) {
          const channel = response.data.items[0];
          return channel.snippet.thumbnails.default.url;
        }
      } catch (error) {
        console.error(error);
      }
    };

    console.log("B");

    const fetchChannelImages = async () => {
      console.log("C");
      const videosWithImages = await Promise.all(
        videos.map(async (video) => {
          console.log("prvni");
          console.log("video: " + video);

          const channelImageUrl = await fetchChannelDetails(
            video.snippet.channelId
          );

          console.log("druhy");

          return {
            ...video,
            channelImageUrl,
          };
        })
      );

      setVideos(videosWithImages);
    };

    console.log("D");

    fetchChannelImages();
  }, [videos]);

  console.log("1st");

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
    </div>
  );
};

export default YouTubeSearch;
