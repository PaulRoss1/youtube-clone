import "./MainContent.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const VideoTile = ({ videos }) => {
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
        <ul className="main-content__list">
          {videos.map((video) => (
            <li key={video.id.videoId}>
              <div className="main-content__tile">
                <img
                  className="main-content__image"
                  src={video.snippet.thumbnails.high.url}
                  alt={video.snippet.title}
                ></img>
                <div className="main-content__video-info">
                  <h2 className="main-content__header">
                    {video.snippet.title}
                  </h2>
                  <span className="main-content__views">
                    {formatViewCount(video.statistics?.viewCount) || "N/A"}{" "}
                    views
                  </span>
                  <span className="main-content__dot"> • </span>
                  <span className="main-content__uploaded">
                    Streamed {dayjs(video.snippet.publishedAt).fromNow()}
                  </span>
                  <br />
                  <div className="main-content__channel-container">
                    <img
                      className="main-content__icon"
                      src="https://placehold.co/24x24/EEE/31343C"
                    ></img>
                    <span className="main-content__channel">
                      {video.snippet.channelTitle}
                    </span>
                  </div>
                  <span className="main-content__description">
                    {video.snippet.description}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

export default function MainContent({ videos }) {
  return (
    <div className="main-content">
      <VideoTile videos={videos} />
    </div>
  );
}
