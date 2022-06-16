
import { Route, Routes } from "react-router-dom";
import { HomeDetails } from "../HomeDetails/HomeDetails"
import SingleVideo from "./componants/Video/SingleVideo";
import Home from "./componants/Home/Home";

export const AllRoutes = () => {

    return(
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/video" element={<SingleVideo />}></Route>
            <Route path="/details" element={<HomeDetails/>}></Route>
        </Routes>
    )
}