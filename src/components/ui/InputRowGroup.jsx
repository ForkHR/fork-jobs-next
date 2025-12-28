import './styles/InputRowGroup.css'

const InputRowGroup = ({ children, title, className, ghost }) => {
    return (
        <div className="input-row-group">
            {title &&
                <h2 className="fs-14 weight-500 pb-4 px-4">
                    {title}
                </h2>
            }
            <div className={`input-row-group-wrapper${className ? ` ${className}`: " "}${ghost ? ' input-row-group-ghost' : ''}`}>
                {children}
            </div>
        </div>
    )
}

export default InputRowGroup