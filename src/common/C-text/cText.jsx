import './cText.css'

export const CText = ({key,title,className }) => {
    return (

        <div key={key} id="text-design" className={className}>{title}</div>
    )
}