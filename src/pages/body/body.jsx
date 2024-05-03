import { Routes, Route } from "react-router-dom";


// Views
import { Welcome } from "../welcome/welcome";
import { Home } from "../home/home";
import { Profile } from "../profile/profile";

export const Body = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Welcome />} />
                <Route path='/home' element={<Home />} />
                <Route path='/profile' element={<Profile />} />
            </Routes>
        </>
    )
}