import { Routes, Route } from "react-router-dom";


// Views
import { Welcome } from "../welcome/welcome";

export const Body = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Welcome />} />
            </Routes>
        </>
    )
}