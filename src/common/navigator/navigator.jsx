import './navigator.css'

import { useNavigate } from "react-router-dom";

import { CText } from "../C-text/cText";

export const Navigator = ({ title, children, onClick, className, destination, }) => {
    const navigate = useNavigate()

    const combinedClasses = `navigator-design ${className || ""}`

    return (
        <div
            className={combinedClasses}
            destination={destination}
            onClick={onClick}
        >
            <CText title={title}>{title}</CText>
            {children}
        </div>
    )

}