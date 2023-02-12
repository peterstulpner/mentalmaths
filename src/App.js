import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomeView from "./components/HomeView";
import { MathsView } from "./components/MathsView";
import { Results } from "./components/Results";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/maths" element={<MathsView />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  );
}

export default App;
