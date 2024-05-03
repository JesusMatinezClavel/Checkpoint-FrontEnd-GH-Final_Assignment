import './cCard.css'

export const CCard = ({ children, className }) => {

    const combinedClasses = `card-design ${className || ""}`

    return (
        <div className={combinedClasses}>{children}</div>
    )
}