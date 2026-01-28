'use client';

import { useEffect, useRef, useState } from 'react'
import './styles/Input.css'
import { closeIcon, eyeIcon, hideIcon, selectOptionsIcon } from '../../assets/img/icons'
import IconButton from './IconButton'

const Input = ({
    label,
    size,
    type,
    sign,
    value,
    onChange,
    placeholder,
    name,
    error,
    errorMsg,
    success,
    loading,
    disabled,
    autoComplete,
    icon,
    selectOptions,
    variant,
    autoFocus,
    onClick,
    onFocus,
    onBlur,
    noLabel,
    className,
    required,
    searchOptions,
    searchable,
    displayPlaceholder,
    onKeyUp,
    onSubmit,
    openUp,
    warning,
    info,
    clear,
    ...props
}) => {
    const inputRef = useRef(null)
    const inputSearchRef = useRef(null)
    const inputParentRef = useRef(null)
    const [displayPassword, setDisplayPassword] = useState(false)
    const [searchValue, setSearchValue] = useState(value ? value : '')
    const [searchOpen, setSearchOpen] = useState(false)
    const [offsetTop, setOffsetTop] = useState(0)

    const onClickOutside = (e) => {
        if (searchOpen) {
            if (inputParentRef?.current?.contains(e.target)) {
                return
            }
            setSearchOpen(false)
        }
    }

    useEffect(() => {
        if(openUp && inputSearchRef.current && searchOpen) {
            const menuHeight = inputSearchRef?.current?.getBoundingClientRect()?.height;
            setOffsetTop(menuHeight)
        }
    }, [openUp, inputSearchRef, searchOpen])

    useEffect(() => {
        if(!searchOpen) return
        document.addEventListener('mousedown', onClickOutside)
        return () => {
            document.removeEventListener('mousedown', onClickOutside)
        }
    }, [inputParentRef, searchOpen])


    useEffect(() => {
        if(inputParentRef && inputSearchRef) {
            const menuHeight = inputSearchRef?.current?.getBoundingClientRect()?.height;
            const inputParentRefHeight = inputParentRef?.current?.getBoundingClientRect()?.height;
            const inputParentRefTop = inputParentRef?.current?.getBoundingClientRect()?.top;
            const viewportHeight = window.innerHeight;
    
            // If the dropdown label is below the middle of the viewport, open the dropdown upwards
            if (inputParentRefTop > viewportHeight / 2) {
                setOffsetTop(-(menuHeight + inputParentRefHeight - 30));
            } else {
                setOffsetTop(inputParentRefHeight);
            }
        }
    }, [inputParentRef, searchOpen, inputSearchRef, searchValue]);

    return (
        <div className="flex flex-col gap-1">
        <div className={`input-container${disabled ? " border-secondary" :  ""}${size ? ` input-container-${size}` : ""}${type === 'textarea' ? " input-textarea" : ""}${displayPlaceholder ? ' input-display-placeholder' : ''}${error ? ' input-danger' : ''}${success ? ' input-success' : ''}${warning ? ' input-warning' : ''}${variant ? ` input-${variant}` : ''}${className ? ` ${className}` : ''}`}
            onClick={(e) => {
                e.preventDefault()
                inputRef.current.focus()
                inputRef.current.scrollIntoView({behavior: 'smooth', block: 'center'})
                if (type === 'select' || searchable) setSearchOpen(!searchOpen)
            }}
            ref={inputParentRef}
        >
            {icon || sign ?
                <span className="input-icon">{icon ? icon : sign ? sign : ''}</span>
            : null}
            <div className="input-wrapper">
                {type === 'textarea' ?
                    <textarea
                        ref={inputRef}
                        value={value}
                        onChange={onChange}
                        rows={props.rows || 4}
                        cols={props.cols || 30}
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
                            e.target.scrollIntoView({behavior: 'smooth', block: 'center'})
                            onFocus ? onFocus(e) : null
                        }}
                        onBlur={() => {
                            if (onBlur) onBlur()
                        }}
                    />
                :
                    <input
                        ref={inputRef}
                        type={type === 'password' ? (displayPassword ? 'text' : 'password') : type}
                        value={value}
                        onChange={(e) => {
                            if (disabled || loading) return
                            onChange(e)
                            if (searchable) {
                                setSearchValue(e.target.value)
                                setSearchOpen(true)
                                if (type === 'select') {
                                    const foundItem = selectOptions.find(item => item.label.toLowerCase() === e.target.value.toLowerCase())
                                    if (foundItem) {
                                        onChange({target: {value: foundItem.value}})
                                        setSearchOpen(false)
                                    } else {
                                        onChange({target: {value: null}})
                                    }
                                }
                            }
                        }}
                        readOnly={type === 'select' && !searchable}
                        name={name}
                        placeholder={placeholder}
                        disabled={loading || disabled}
                        autoComplete={autoComplete ? 'on' : 'off'}
                        className={disabled ? " cursor-disabled" :  ""}
                        autoFocus={autoFocus}
                        required={required}
                        maxLength={props.maxLength}
                        minLength={props.minLength}
                        onSubmit={onSubmit ? onSubmit : null}
                        onKeyUp={e => {
                            onKeyUp ? onKeyUp(e) : null
                        }}
                        onFocus={(e) => {
                            // e.target.scrollIntoView({behavior: 'smooth', block: 'center'})
                            onFocus ? onFocus(e) : null
                        }}
                        onBlur={onBlur ? onBlur : null}
                        onClick={onClick ? onClick : null}
                    />
                }
                {label && 
                    <label 
                        className={`text-nowrap${`${value}`?.length > 0 ? ' filled' : ""}`}
                        htmlFor={name}
                    >
                        {label}
                        {required && <span className="text-danger ms-2 fs-12">*</span>}
                    </label>
                }
            </div>
            {(clear && value) || type === 'password' || info || error || type === 'select' ?
                <span className="input-icon input-icon-right">
                { clear && value ?
                    <IconButton
                        size="sm"
                        icon={closeIcon}
                        onClick={() => onChange({target: {value: ''}})}
                        variant="link"
                    />
                : type === 'password' && !props.notShowPassword ?
                    <IconButton
                        size="sm"
                        icon={displayPassword ? hideIcon : eyeIcon }
                        className="opacity-50 hover-opacity-100"
                        onClick={() => setDisplayPassword(!displayPassword)}
                        variant="link"
                    />
                : type === 'select' ?
                    <IconButton
                        size="sm"
                        icon={selectOptionsIcon}
                        className="opacity-50 hover-opacity-100"
                        onClick={() => setSearchOpen(!searchOpen)}
                        variant="link"
                    />
                : null
                }
                </span>
            : null}
            {(type === 'select' || searchable) && searchOpen && (
                <div className={`input-search${openUp ? ' input-search-up' : ''}`}
                    style={{
                        position: 'absolute',
                        top: `${offsetTop || 0}px`,
                        left: - 1,
                        willChange: 'top, left',
                    }}
                    ref={inputSearchRef}
                >
                    {props.selectOptionsCustom ?
                    props.selectOptionsCustom
                    : !selectOptions || selectOptions?.length === 0 ? (
                        <div className="input-select-item text-secondary">No results</div>
                    ) : (
                        <>
                        {selectOptions
                        ?.filter(item => (type === 'select' && value ) || !searchable || item.label.toLowerCase().includes(searchValue.toLowerCase()))
                        ?.map((item, index) => (
                            <div
                                key={`${item}-${index}-search-${Math.random()}`}
                                className={`input-select-item${value === item.value || searchValue?.toLowerCase() === item.label.toLowerCase() ? ' input-select-item-checked' : ''}${item.className ? ` ${item.className}` : ''}`}
                                onClick={() => {
                                    if (disabled || item.disabled) return
                                    onChange({target: {value: item.value}})
                                    if (searchable) setSearchValue(item.label)
                                    setSearchOpen(false)
                                }}
                                onMouseDown={e => e.preventDefault()} 
                            >
                                {item.label}
                            </div>
                        ))}
                        {selectOptions
                        ?.filter(item => (type === 'select' && value ) || !searchable || item.label.toLowerCase().includes(searchValue.toLowerCase()))
                        .length === 0 &&
                        <div className="input-select-item text-secondary">No results</div>
                        }
                        </>
                    )}
                </div>
            )}
        </div>
        {error && errorMsg && <div className="text-danger fs-12 px-2 py-1 weight-500 border-radius tag-danger">{errorMsg}</div>}
        </div>
    )
}

export default Input