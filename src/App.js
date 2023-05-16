import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import MainContent from "./Components/MainContent/MainContent";
import Filter from "./Components/Filter/Filter";
import Sidebar from "./Components/Sidebar/Sidebar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Filter />
      <MainContent />
      <Sidebar />
    </div>
  );
}

export default App;
