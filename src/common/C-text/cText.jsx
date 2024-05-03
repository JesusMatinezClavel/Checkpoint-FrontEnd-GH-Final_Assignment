import './cText.css'

export const CText = ({ title,className }) => {
    return (
        <div id="text-design" className={className}>{title}</div>
    )
}