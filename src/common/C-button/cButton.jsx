import './cButton.css'

export const CButton = ({ title,className }) => {

    const combinedClasses = `button-design ${className || ""}`

    return (
        <div className={combinedClasses}>{title}</div>
    )
}