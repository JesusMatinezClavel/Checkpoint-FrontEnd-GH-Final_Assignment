import { Routes, Route } from "react-router-dom";


// Views
import { Home } from "../home/home";
import { Profile } from "../profile/profile";
import { Superadmin } from "../superadmin/superadmin";

export const Body = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/superadmin' element={<Superadmin />} />
            </Routes>
        </>
    )
}