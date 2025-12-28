import { useRef, useState } from 'react'
import './styles/InputSearch.css'
import { closeIcon, leftArrowIcon, searchIcon } from '../../assets/img/icons'
import IconButton from './IconButton'

const InputSearch = ({
    type,
    value,
    onChange,
    placeholder,
    name,
    loading,
    disabled,
    autoFocus,
    onClick,
    onFocus,
    onBlur,
    clearable,
    onClear,
    hideIcon,
    className,
    collapsible,
    onSubmit,
    onSubmitEmpty,
}) => {

    const [focus, setFocus] = useState(false)
    const inputRef = useRef(null)
    const inputParentRef = useRef(null)
    const [open, setOpen] = useState(collapsible ? false : true)

    return (
        open ?
        <>
        <div className={`input-search-container${value ? " input-search-container-filled" : ""}${focus ? ` input-search-focused` : ''}${className ? ` ${className}`: ""}`}
            ref={inputParentRef}
        >
            {
            hideIcon ? <div className="ps-3"></div> :
            collapsible ?
                <IconButton
                    variant="link"
                    icon={leftArrowIcon}
                    onClick={(e) => {
                        e.stopPropagation()
                        if (onSubmit) onSubmit()
                        onChange({target: {value: ''}})
                        setFocus(false)
                        inputRef.current.blur()
                        collapsible ? setOpen(false) : null
                    }}
                />
            : 
                <IconButton
                    variant="link"
                    icon={searchIcon}
                    className={'opacity-25'}
                    onClick={(e) => {
                        e.stopPropagation()
                        inputRef.current.focus()
                    }}
                />
            }
            <input
                ref={inputRef}
                type={type}
                value={value} 
                onChange={onChange}
                name={name}
                placeholder={placeholder}
                disabled={loading || disabled}
                autoComplete="off"
                autoFocus={autoFocus}
                tabIndex={0}
                onFocus={(e) => {
                    setFocus(true)
                    if (onFocus) onFocus()
                }}
                onBlur={(e) => {
                    setFocus(false)
                    if (onBlur) onBlur()
                }}
                onClick={onClick ? onClick : null}
            />
            
            <div className="clear-input">
                <IconButton
                    size="sm"
                    icon={((clearable && value) || onClear) ? closeIcon : ''}
                    onClick={(e) => {
                        e.stopPropagation()
                        inputRef.current.focus()
                        value ? onChange({target: {value: ''}}) : null
                        onClear ? onClear() : null
                    }}
                    variant="text"
                />
            </div>
        </div>
        </>
        :
        <IconButton
            icon={searchIcon}
            onClick={(e) => {
                e.stopPropagation()
                setOpen(true)
            }}
                    muted
                    variant="text"
            dataTooltipContent={placeholder}
        />
    )
}

export default InputSearch