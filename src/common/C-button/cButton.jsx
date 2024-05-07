import './cButton.css'

export const CButton = ({ title,className,onClick,key }) => {

    const combinedClasses = `button-design ${className || ""}`

    return (
        <div key={key} className={combinedClasses} onClick={onClick}>{title}</div>
    )
}