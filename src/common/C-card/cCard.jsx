import './cCard.css'

export const CCard = ({ children, className, onClick }) => {

    const combinedClasses = `card-design ${className || ""}`

    return (
        <div className={combinedClasses} onClick={onClick}>{children}</div>
    )
}