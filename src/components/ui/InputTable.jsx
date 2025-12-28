import './styles/InputTable.css'

const InputTable = ({
    type,
    value,
    onChange,
    placeholder,
    name,
    loading,
    disabled,
    className,
    maxLength,
    onClick,
    onBlur,
    noZero,
}) => {
    return (
        <div className={`input-table-container`}>
            <input
                type={type}
                value={noZero && value === 0 ? '' : value} 
                onChange={onChange}
                name={name}
                placeholder={placeholder}
                disabled={loading || disabled}
                maxLength={maxLength}
                className={`${className ? `${className}` : ''}`}
                autoComplete={'off'}
                onClick={onClick}
                onFocus={(e) => {
                    e.target.scrollIntoView({behavior: 'smooth', block: 'center'})
                }}
                onWheel={(e) => {
                    e.target.blur()
                }}
                onBlur={onBlur}
            />
        </div>
    )
}

export default InputTable