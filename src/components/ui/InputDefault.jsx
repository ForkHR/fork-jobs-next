import { useRef, useState } from 'react'
import './styles/InputDefault.css'
import { eyeIcon, hideIcon, questionIcon, selectOptionsIcon, xIcon } from '../../assets/img/icons'
import IconButton from './IconButton'

const InputDefault = ({
    label,
    type,
    value,
    sign,
    onChange,
    placeholder,
    name,
    error,
    errorInfo,
    success,
    loading,
    disabled,
    autoComplete,
    icon,
    variant,
    autoFocus,
    onClick,
    onFocus,
    onBlur,
    selectOptions,
    className,
    classNameContainer,
    required,
    displayPlaceholder,
    onKeyUp,
    onSubmit,
    warning,
    info,
    clear
}) => {
    const inputRef = useRef(null)
    const [displayPassword, setDisplayPassword] = useState(false)

    return (
        <div className={classNameContainer ? classNameContainer : ""}>
            {label && 
                <div className="flex mb-1 justify-between">
                    <label className="fs-14 fw-100 weight-400">{label}</label>
                    {info &&
                        <IconButton
                            size="sm"
                            icon={questionIcon}
                            dataTooltipContent={info}
                            dataTooltipId="tooltip-click"
                            variant="text"
                        />
                    }
                </div>
            }
            {type === 'select' ?
                <div className={`input-default-container justify-end${displayPlaceholder ? ' input-default-display-placeholder' : ''}${error ? ' input-default-danger' : ''}${success ? ' input-default-success' : ''}${warning ? ' input-default-warning' : ''}${variant ? ` input-default-${variant}` : ''}${className ? ` ${className}` : ''}`}
                    onClick={() => {
                        inputRef.current.focus()
                        inputRef.current.scrollIntoView({behavior: 'smooth', block: 'center'})
                    }}
                >
                    <select
                        value={value}
                        onChange={onChange}
                        name={name}
                        disabled={loading || disabled}
                        required={required}
                        ref={inputRef}
                    >
                        <option value="" disabled={required}>{placeholder}</option>
                        {selectOptions.map((option, index) => (
                            <option key={index} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <span className="input-default-icon input-default-icon-right pointer-events-none">
                        {selectOptionsIcon}
                    </span>
                </div>
            :
            <div className={`input-default-container${displayPlaceholder ? ' input-default-display-placeholder' : ''}${error ? ' input-default-danger' : ''}${success ? ' input-default-success' : ''}${warning ? ' input-default-warning' : ''}${variant ? ` input-default-${variant}` : ''}${className ? ` ${className}` : ''}`}
                onClick={() => {
                    inputRef.current.focus()
                    inputRef.current.scrollIntoView({behavior: 'smooth', block: 'center'})
                }}
            >
                { icon || sign ?
                    <span className="input-default-icon">
                        {icon ? icon
                        : sign ? sign : null
                        }
                    </span>
                : null}
                <div className="input-default-wrapper">
                    <input
                        ref={inputRef}
                        type={type === 'password' ? (displayPassword ? 'text' : 'password') : type}
                        value={value}
                        onChange={onChange}
                        name={name}
                        placeholder={placeholder}
                        disabled={loading || disabled}
                        autoComplete={autoComplete ? 'on' : 'off'}
                        autoFocus={autoFocus}
                        required={required}
                        onSubmit={onSubmit ? onSubmit : null}
                        onKeyUp={e => {
                            onKeyUp ? onKeyUp(e) : null
                        }}
                        onFocus={(e) => {
                            onFocus ? onFocus(e) : null
                        }}
                        onBlur={onBlur ? onBlur : null}
                        onClick={onClick ? onClick : null}
                    />
                </div>
                <span className="input-default-icon input-default-icon-right">
                    { clear && value ?
                        <IconButton
                            size="sm"
                            variant="text"
                            icon={xIcon}
                            onClick={() => onChange({target: {value: ''}})}
                        />
                    : type === 'password' ?
                        <IconButton
                            size="sm"
                            variant="text"
                            icon={displayPassword ? hideIcon : eyeIcon }
                            onClick={() => setDisplayPassword(!displayPassword)}
                        />
                    : null
                    }
                </span>
            </div>
            }
            {errorInfo && error ?
            <div className="flex mt-1">
                <label className="fs-14 fw-100 weight-400 text-danger">{errorInfo}</label>
            </div>
            : null}
        </div>
    )
}

export default InputDefault