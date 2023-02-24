import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomeView from "./components/HomeView";
import { MathsView } from "./components/MathsView";
import { Results } from "./components/Results";
import { useSelector } from "react-redux";

function App() {
  return (
    <div
      className="App"
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        background: "#33b0FF",
      }}
    >
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/maths" element={<MathsView />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  );
}

export default App;
