import { Routes, Route } from "react-router-dom"
import HomeView from './views/homeview';
import About from "./views/about";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/:id" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
