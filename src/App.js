import { Route, Routes } from "react-router-dom";
import './App.css';
import Home from "./componants/Home/Home";
import Navbar from './componants/Home/Navbar/Navbar';
import SingleVideo from "./componants/Video/SingleVideo";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/video" element={<SingleVideo />}></Route>
      </Routes>
    </div>
  );
}
//https://github.com/vadimghedreutan/Apple-tv-plus-clone/tree/main/src
export default App;
