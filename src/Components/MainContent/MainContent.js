import "./MainContent.css";

const VideoTile = () => (
  <div className="main-content__tile">
    <img
      className="main-content__image"
      src="https://placehold.co/360x202/EEE/31343C"
    ></img>
    <div className="main-content__video-info">
      <h2 className="main-content__header">
        Elon Musk BANS Making Fun Of New Twitter CEO! Users Permanently
        Suspended Over Jokes!
      </h2>
      <span className="main-content__views">1.6M views</span>
      <span className="main-content__dot"> • </span>
      <span className="main-content__uploaded">Streamed 1 year ago</span>
      <br />
      <div className="main-content__channel-container">
        <img
          className="main-content__icon"
          src="https://placehold.co/24x24/EEE/31343C"
        ></img>
        <span className="main-content__channel">TheQuartering</span>
      </div>
      <span className="main-content__description">
        The #1 Way To Support This Channel Is Backing Me On SubscribeStar
        https://www.subscribestar.com/thequartering Become A ...
      </span>
    </div>
  </div>
);

export default function MainContent() {
  return (
    <div className="main-content">
      <VideoTile />
      <VideoTile />
      <VideoTile />
      <VideoTile />
    </div>
  );
}
