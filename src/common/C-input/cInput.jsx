import './cInput.css'

export const CInput = ({ id, disabled, className, type, style, name, value, placeholder, onChange, onBlur, children }) => {

    const combinedClasses = `input-design ${className || ""}`
    const inputElement =
        type === "textarea"
            ? (
                <textarea
                    id={id}
                    className={combinedClasses}
                    style={style}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                >
                    {children}
                </textarea>
            )
            : (
                <input
                    id={id}
                    disabled={disabled}
                    className={combinedClasses}
                    type={type}
                    style={style}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    onBlur={onBlur}
                >
                    {children}
                </input>
            )

    return inputElement
}