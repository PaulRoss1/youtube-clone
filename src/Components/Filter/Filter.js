import "./Filter.css";

const Button = ({ text }) => (
  <div className="filter__button">
    <div className="filter__text">{text}</div>
  </div>
);

export default function Filter() {
  const buttonList = [
    "All",
    "Music",
    "Live",
    "Gaming",
    "News",
    "Deep House",
    "Restaurants",
    "Adventure",
    "Nature",
    "Fashion",
    "Food",
    "Fitness",
    "Technology",
    "Photography",
    "Movies",
    "Sports",
    "Books",
    "Art",
    "Cooking",
    "Science",
    "Travel",
    "Business",
    "Comedy",
    "Education",
    "Wellness",
    "Social Media",
    "Animals",
    "History",
    "Motivation",
  ];

  return (
    <div className="filter">
      {buttonList.map((text) => (
        <Button key={text} text={text} />
      ))}
    </div>
  );
}
