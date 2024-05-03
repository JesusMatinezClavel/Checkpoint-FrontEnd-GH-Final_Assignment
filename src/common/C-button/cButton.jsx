import './cButton.css'

export const CButton = ({ title,className,onClick }) => {

    const combinedClasses = `button-design ${className || ""}`

    return (
        <div className={combinedClasses} onClick={onClick}>{title}</div>
    )
}