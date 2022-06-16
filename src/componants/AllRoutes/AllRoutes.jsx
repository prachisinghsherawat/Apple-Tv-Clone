
import { Route, Routes } from "react-router-dom";
import Home from "../Home/Home";
import { HomeDetails } from "../HomeDetails/HomeDetails"
import SingleVideo from "../Video/SingleVideo";


export const AllRoutes = () => {

    return(
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/video" element={<SingleVideo />}></Route>
            <Route path="/details" element={<HomeDetails/>}></Route>
        </Routes>
    )
}