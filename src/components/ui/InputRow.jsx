'use client';

import { useState, useRef, useEffect, useMemo, forwardRef } from 'react'
import { calendarDefaultIcon, chevronDownIcon, selectOptionsIcon } from '../../assets/img/icons'
import './styles/InputRow.css'
import IconButton from './IconButton'
import Button from './Button'
import { phoneFormatter } from '../../assets/utils'
import CheckBox from './CheckBox'
import Switch from './Switch'
import DatePicker from 'react-datepicker'


const CustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
    minYear,
    maxYear
}) => {
    // Years from 1900 to 2100
    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)
    const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]

    return (
    <div className="flex justify-center align-center flex-nowrap gap-2 py-1 date-select-custom-header">
        <button type="button"
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className="react-datepicker__navigation react-datepicker__navigation--previous"><span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous">
                {'<'}</span>
            </button>
        <select
            value={months[new Date(date).getMonth()]}
            onChange={({ target: { value } }) =>
                changeMonth(months.indexOf(value))
            }
            className="border-0 bg-transparent text-dark fs-14 opacity-75 outline-none hover-opacity-100 border-none pointer border-radius-sm"
            >
            {months.map((option) => (
                <option key={option} value={option} className="text-dark">
                    {option}
                </option>
            ))}
        </select>
        <select
            value={new Date(date).getFullYear()}
            onChange={({ target: { value } }) => changeYear(value)}
            className="border-0 bg-transparent text-dark opacity-75 outline-none hover-opacity-100 fs-14 border-none pointer border-radius-sm"
        >
        {years.map((option) => (
            <option key={option} value={option} className="text-dark">
                { option}
            </option>
        ))}
        </select>
        <button type="button"
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className="react-datepicker__navigation react-datepicker__navigation--next"><span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--next">
                {'>'}</span>
            </button>
    </div>
    )
}

const CustomDateSelect = ({ value, onChange, disabled, readOnly, maxDate, minDate }) => {
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')

    useEffect(() => {
        if (value) {
            setDay(new Date(value).getDate())
            setMonth(new Date(value).getMonth())
            setYear(new Date(value).getFullYear())
        }
    }, [value])

    const years = useMemo(() => {
        let years = [{ label: 'Year', value: '' }]
        const minYear = minDate ? new Date(minDate).getFullYear() : 1900
        const maxYear = maxDate ? new Date(maxDate).getFullYear() : 2100
        for (let i = minYear; i <= maxYear; i++) {
            years.unshift({ label: i, value: i })
        }
        return years
    }, [maxDate, minDate])

    const months =  [
        { label: 'Month', value: ''},
        { label: 'January', value: 0 },
        { label: 'February', value: 1 },
        { label: 'March', value: 2 },
        { label: 'April', value: 3 },
        { label: 'May', value: 4 },
        { label: 'June', value: 5 },
        { label: 'July', value: 6 },
        { label: 'August', value: 7 },
        { label: 'September', value: 8 },
        { label: 'October', value: 9 },
        { label: 'November', value: 10 },
        { label: 'December', value: 11 }
    ]
    const days = [{ label: 'Day', value: '' }]
    for (let i = 1; i <= 31; i++) {
        days.push({ label: i, value: i })
    }

    useEffect(() => {
        if (day && year && month) {
            onChange({ target: { value: new Date(year, month, day) } })
        }
    }, [day, month, year])

    return (
        <div className="flex ps-0 pe-4 flex-1">
            <div className="border-right pe-2 me-2 border-secondary border-left ps-2 flex-1">
                <select
                    value={month}
                    placeholder="Month"
                    onChange={(e) => {
                        setMonth(e.target.value)
                    }}
                    className={`bg-transparent w-100 border-0 text-dark outline-none hover-opacity-100 fs-14 border-none px-2 pointer py-2${!month ? " text-secondary" : ""}`}
                    disabled={disabled || readOnly}
                >
                    {months.map((option) => (
                        <option key={`${option.value}-month`} value={option.value} className={`bg-main${option.value === '' ? " text-secondary" : " text-dark"}`}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="border-right pe-2 me-2 border-secondary flex-1">
                <select
                    value={day}
                    placeholder="Day"
                    onChange={({ target: { value } }) => {
                        setDay(value)
                    }}
                    className={`bg-transparent w-100 border-0 text-dark outline-none hover-opacity-100 fs-14 border-none px-2 pointer py-2${!day ? " text-secondary" : ""}`}
                    disabled={disabled || readOnly}
                >
                    {days.map((option) => (
                        <option key={`${option.value}-day`} value={option.value} className={`bg-main${option.value === '' ? " text-secondary" : " text-dark"}`}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex-1">
                <select
                    placeholder="Year"
                    value={year}
                    onChange={({ target: { value } }) => {
                        setYear(value)
                    }}
                    className={`bg-transparent w-100 border-0 text-dark outline-none hover-opacity-100 fs-14 border-none px-2 pointer py-2${!year ? " text-secondary" : ""}`}
                    disabled={disabled || readOnly}
                >
                    {years?.map((option) => (
                        <option key={`${option.value}-year`} value={option.value} className={`bg-main${option.value === '' ? " text-secondary" : " text-dark"}`}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

const CustomDatePickInput = forwardRef(({ value, onClick }, ref) => (
    <IconButton
        icon={calendarDefaultIcon}
        onClick={onClick}
        variant="link"
        className="react-datepicker__view-calendar-icon h-100 opacity-50 hover-opacity-100"
    />
))

const InputRow = ({
    children,
    label,
    type,
    column,
    value,
    onChange,
    placeholder,
    disabled,
    readOnly,
    onFocus,
    onBlur,
    searchable,
    searchOptions,
    dropdown,
    dropdownOptions,
    dropdownOptionsCustom,
    closeOnSelect,
    selectOptions,
    selectMultiple,
    active,
    info,
    maxLength,
    max,
    min,
    openUp,
    error,
    errorMsg,
    success,
    warning,
    required,
    sign,
    switchLabel,
    className,
    onClick,
    minDate,
    maxDate,
    autoFocus,
    autocapitalize,
    ...props
}) => {
    const [focused, setFocused] = useState(false)
    const inputParentRef = useRef(null)
    const inputRef = useRef(null)
    const labelRef = useRef(null)
    const inputSearchRef = useRef(null)
    const [searchValue, setSearchValue] = useState(value ? value : '')
    const [searchOpen, setSearchOpen] = useState(false)
    const [offsetTop, setOffsetTop] = useState(0)
    const [width, setWidth] = useState(0)
    const datePickerRef = useRef(null)
    
    const onClickOutside = (e) => {
        if (searchable || dropdown) {
            if (inputParentRef?.current?.contains(e.target)) {
                return
            }
            setSearchOpen(false)
        }
    }

    useEffect(() => {
        if(inputParentRef && inputSearchRef && searchOpen && (dropdown || searchable)) {
            const menuHeight = inputSearchRef?.current?.getBoundingClientRect()?.height;
            const inputParentRefHeight = inputParentRef?.current?.getBoundingClientRect()?.height;
            const inputParentRefTop = inputParentRef?.current?.getBoundingClientRect()?.top;
            const viewportHeight = window.innerHeight;
            const inputRefHeight = inputRef?.current?.getBoundingClientRect()?.height;
    
            // If the dropdown label is below the middle of the viewport, open the dropdown upwards
            if (inputParentRefTop > viewportHeight / 2) {
                setOffsetTop(-(menuHeight + 12)); // 12 is the padding
            } else {inputRef?.current?.offsetHeigh
                setOffsetTop(inputRefHeight - 1);
            }
        }
    }, [inputParentRef, inputSearchRef, searchOpen, searchValue, inputRef])

    useEffect(() => {
        if(!searchOpen) return
        document.addEventListener('mousedown', onClickOutside)
        return () => {
            document.removeEventListener('mousedown', onClickOutside)
        }
    }, [inputParentRef, searchOpen])

    const handleResize = () => {
        if (inputRef?.current) {
            setWidth(inputRef?.current?.offsetWidth)
        }
    }

    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [inputRef])


    return (
        <div className={`input-row${column ? " input-col" : ""}${error ? " input-row-error" : ""}${readOnly ? " input-row-readonly" : ""}${success ? " input-row-success" : ""}${warning ? " input-row-warning" : ""}${focused ? ` input-row-focused` : ''}${disabled ? ' input-row-disabled' : ''}${dropdown ? ' input-row-dropdown' : ""}${searchable ? ' input-row-searchable' : ""}${(dropdown || searchable) && searchOpen ? ` input-row-search-opened` : ''}`}
            ref={inputParentRef}
        >
            {props.hideLabel ? null :
            <div className="input-row-label flex-col justify-start"
                // onClick={(e) => {
                //     e.stopPropagation()
                //     if (disabled || readOnly) return
                //     if (dropdown || searchable) setSearchOpen(!searchOpen)
                //     if (inputRef?.current) inputRef?.current?.focus()
                // }}
                ref={labelRef}
            >
                <label>
                    {label}
                    {required ? null : <span className="weight-400 fs-12 line-height-1-3 pt-1 weight-400 text-secondary"> (optional)</span>}
                    {/* {readOnly ? <span className="ms-2 weight-400 fs-12 line-height-1-3 pt-1 weight-400 text-secondary">(read only)</span> : null} */}
                </label>
                {info ?
                <>
                    <div className={`fs-12 line-height-1-3 pt-1 weight-400 text-secondary${column ? "" : " "}`}>
                        {info}
                    </div>
                </>
                : null}
            </div>
        }
            {children ? (
                children
            ) : type === 'date' ?
            <div className="input-row-input flex-grow-1 align-center flex justify-between px-sm-1">
                <div className={props.customDateSelect ? "w-100 flex-1" : "flex"}>
                    <DatePicker
                        selected={value || ''}
                        onChange={(e) => {
                            if (disabled || readOnly) return
                            onChange({target: {value: e}});
                        }}
                        // closeOnScroll={true}
                        className="flex-grow-1 w-available px-0"
                        placeholderText={placeholder ? placeholder : "Select date"}
                        wrapperClassName="input-row-input-inner w-100"
                        formatWeekDay={nameOfDay => nameOfDay.slice(0, 2)}
                        customInput={
                            props.customDateSelect ?
                            props.customDateSelect :
                                <CustomDatePickInput/>
                            }
                        // todayButton="Today"
                        disabled={disabled || readOnly}
                        popperPlacement={'bottom-start'}
                        maxDate={maxDate ? maxDate : ''}
                        minDate={minDate ? minDate : ''}
                        calendarStartDay={1}
                        withPortal
                        ref={datePickerRef}
                        renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => ( 
                            <CustomHeader
                                date={date}
                                changeYear={changeYear}
                                changeMonth={changeMonth}
                                decreaseMonth={decreaseMonth}
                                increaseMonth={increaseMonth}
                                prevMonthButtonDisabled={prevMonthButtonDisabled}
                                nextMonthButtonDisabled={nextMonthButtonDisabled}
                                minYear={minDate ? new Date(minDate).getFullYear() : 1900}
                                maxYear={maxDate ? new Date(maxDate).getFullYear() : 2100}
                            />
                        )}
                    >
                    <div className="flex flex-col w-100 gap-2">
                        <Button
                            label="Close"
                            className="w-100 border-radius"
                            muted
                            variant="outline"
                            onClick={() => {
                                if (datePickerRef.current) {
                                    datePickerRef.current.setOpen(false)
                                }
                            }}
                        />
                    </div>
                    </DatePicker>
                </div>
                    {props.customDateSelect && props.clearDate && value ?
                        <Button
                            label="Clear"
                            type="text"
                            variant="secondary"
                            onClick={() => {
                                if (disabled || readOnly) return
                                onChange({target: {value: null}})
                            }}
                        />
                    : null}
                {props.customDateSelect ? 
                    null
                :
                    <CustomDateSelect
                        value={value}
                        onChange={onChange}
                        disabled={disabled || readOnly}
                        maxDate={maxDate}
                        minDate={minDate}
                    />
                }
            </div>
            : type === 'switch' ? (
                <div className={`input-row-input input-row-switch${className ? ` ${className}` : ""}${value ? ' input-row-switch-active' : ''}`}
                    onClick={() => {
                        if (disabled || readOnly) return
                        if (onClick) onClick(!value)
                        if (onChange) onChange(!value)
                    }}
                >
                    {switchLabel &&
                        <div className="fs-14 weight-500">
                            {switchLabel}
                        </div>
                    }
                    <div>
                        <Switch
                            disabled={disabled}
                            active={value ? true : false}
                            label={label}
                        />
                    </div>
                </div>
            ) : selectOptions ? (
                <div className={`input-row-select${disabled ? ' bg-disabled' : ''}`}>
                    {selectOptions.map((item, index) => (
                        selectMultiple ?
                            <div
                                key={`${item}-${index}-select-${Math.random()}`}
                                onClick={() => {
                                    if (disabled || readOnly) return
                                    onChange(item)
                                }}>
                                    <CheckBox
                                        checked={value.includes(item.value)}
                                        className={`input-row-select-item${value.includes(item.value) ? ' input-row-select-item-checked' : ''}`}
                                        label={item.label}
                                    />
                            </div>
                        :
                        <div
                            key={`${item}-${index}-select-${Math.random()}`}
                            onClick={() => {
                                if (disabled || readOnly) return
                                onChange(item)
                            }}>
                                <CheckBox
                                    checked={active === item.value}
                                    rounded
                                    radio
                                    className={`input-row-select-item${active === item.value ? ' input-row-select-item-checked' : ''}`}
                                    label={item.label}
                                />
                        </div>
                    ))}
                </div>
            ) : (
            <div className={`input-row-input${props.classNameInput ? ` ${props.classNameInput}` : ''}`}
                onClick={(e) => {
                    e.stopPropagation()
                    if (disabled || readOnly) return
                    if ((dropdown && closeOnSelect) || searchable) setSearchOpen(!searchOpen)
                }}
            >
                {sign && <span className="input-row-sign">{sign}</span>}
                {type === 'textarea' ?
                    <textarea
                        className="input-row-input-inner w-100"
                        rows={props.rows || 2}
                        cols={props.cols || 15}
                        value={value}
                        autoFocus={autoFocus}
                        onChange={e => {
                            if (disabled || readOnly) return
                            if (onChange) onChange(e)
                        }}
                        placeholder={placeholder}
                        disabled={disabled || readOnly || dropdown}
                        onFocus={(e) => {
                            setFocused(true)
                            onFocus && onFocus(e)
                        }}
                        onBlur={(e) => {
                            setFocused(false)
                            onBlur ? onBlur(e) : null
                        }}
                        ref={inputRef}
                    />
                :
                props.customDropdownInput ?
                <div className="input-row-input-inner w-100 pointer"
                    ref={inputRef}
                    onClick={(e) => {
                        e.stopPropagation()
                        if (disabled || readOnly) return
                        if (dropdown || searchable) setSearchOpen(!searchOpen)
                    }}
                >
                    {props.customDropdownInput}
                </div>
                :
                    <input
                        className={`input-row-input-inner w-100`}
                        type={type}
                        accept={props.accept}
                        maxLength={maxLength}
                        max={max}
                        autoCapitalize={autocapitalize}
                        autoFocus={autoFocus}
                        min={min}
                        readOnly={(dropdown && !searchable) || readOnly}
                        onClick={(e) => {
                            e.stopPropagation()
                            if (disabled || readOnly) return
                            if (dropdown || searchable) setSearchOpen(!searchOpen)
                        }}
                        onWheel={(e) => {
                            e.target.blur()
                        }}
                        value={dropdown && props.customValue ? props.customValue : (searchable && dropdown) ? searchValue : 
                            dropdown && dropdownOptions
                            ? value ? ((dropdownOptions.find(item => item.value === value))?.label || value) : ''
                            : value}
                        onChange={e => {
                            if (type === 'tel') return onChange({target: {value: phoneFormatter(e.target.value)}})
                            if (maxLength) {
                                if (e.target.value.length > maxLength) return onChange({target: {value: e.target.value.slice(0, maxLength)}})
                            }
                            onChange(e)
                            if (searchable) {
                                setSearchValue(e.target.value)
                                setSearchOpen(true)
                                if (dropdown) {
                                    const foundItem = dropdownOptions.find(item => item.label.toLowerCase() === e.target.value.toLowerCase())
                                    if (foundItem) {
                                        onChange(foundItem)
                                        setSearchOpen(false)
                                    } else {
                                        onChange({target: {value: null}})
                                    }
                                }
                            }
                        }}
                        placeholder={placeholder}
                        disabled={disabled}
                        onFocus={(e) => {
                            setFocused(true)
                            onFocus && onFocus(e)
                            if (disabled || readOnly) return
                            if (searchable) inputRef?.current?.select()
                        }}
                        onBlur={(e) => {
                            setFocused(false)
                            onBlur ? onBlur(e) : null
                        }}
                        ref={inputRef}
                    />
                }
                {(searchable || dropdown) && (!disabled && !readOnly) && (
                    <span className="input-row-arrow"
                        onClick={(e) => {
                            e.stopPropagation()
                            if (disabled || readOnly) return
                            if (dropdown || searchable) setSearchOpen(!searchOpen)
                        }}
                    >{dropdown ? selectOptionsIcon : chevronDownIcon}</span>
                )}
                {(
                    (searchable && 
                        searchOptions && searchOptions.length > 0
                        && searchOptions.some(item => item.toLowerCase().includes(searchValue.toLowerCase()))
                    )
                    || dropdown) && searchOpen ? (
                    <div className={`input-row-search${openUp ? ' input-row-search-up' : ''}`}
                        style={{
                            position: 'absolute',
                            // width: inputRef?.current?.offsetWidth + 1,
                            top: `${offsetTop}px`,
                            left: - 1,
                            willChange: 'top, left',
                        }}
                        ref={inputSearchRef}
                    >
                    {(searchable && !dropdown) ?
                        <>
                            {searchOptions
                            ?.filter(item => item.toLowerCase().includes(searchValue?.toLowerCase()) || !searchValue || searchOptions?.some(item => item.toLowerCase() === searchValue?.toLowerCase()))
                            ?.map((item, index) => (
                                <div
                                    key={`${item}-${index}-search-${Math.random()}`}
                                    className={`input-row-search-item${value === item ? ' text-dark bg-secondary' : ''}`}
                                    onClick={() => {
                                        onChange({target: {value: item}})
                                        setSearchValue(item)
                                        if (closeOnSelect) setSearchOpen(false)
                                    }}
                                    onMouseDown={e => e.preventDefault()} 
                                >
                                    {item}
                                </div>
                            ))}
                            {
                                !searchOptions ||
                                searchOptions?.length === 0 ||
                                searchOptions
                                ?.filter(item => item.toLowerCase().includes(searchValue?.toLowerCase()))
                                .length === 0 ?
                                <div className="fs-12 text-secondary flex align-center justify-center p-4">
                                    No results found
                                </div>
                                : null
                            }
                        </>
                    :
                        <>
                            {props.dropdownIsLoading ? (
                                <div className="py-4 flex align-center justify-center"><div className="spinner"/></div>
                            ) : dropdownOptionsCustom ?
                            dropdownOptionsCustom
                            : !dropdownOptions || dropdownOptions?.length === 0 ? (
                                <div className="input-row-dropdown-item text-secondary">No results</div>
                            ) : (
                                <>
                                {dropdownOptions
                                ?.filter(item => value || !searchable || item?.label?.toLowerCase()?.includes(searchValue?.toLowerCase()))
                                ?.map((item, index) => (
                                    <div
                                        key={`${item}-${index}-search-${Math.random()}`}
                                        className={`input-row-dropdown-item${value && (active === item.label || active === item.value || (searchable && (searchValue &&  searchValue === item.label))) ? ' input-row-dropdown-item-checked bg-secondary' : ''}${item.disabled ? ' bg-disabled' : ''}${item.className ? ` ${item.className}` : ''}`}
                                        onClick={() => {
                                            if (disabled || readOnly || item.disabled) return
                                            onChange(item)
                                            if (searchable) setSearchValue(item.label)
                                            if (closeOnSelect) setSearchOpen(false)
                                        }}
                                        onMouseDown={e => e.preventDefault()} 
                                    >
                                        {item.left && <span className="me-2">{item.left()}</span>}
                                        {item.label}
                                    </div>
                                ))}
                                {dropdownOptions
                                ?.filter(item => value || !searchable || item?.label?.toLowerCase()?.includes(searchValue?.toLowerCase()))
                                .length === 0 &&
                                <div className="input-row-dropdown-item text-secondary">No results</div>
                                }
                                </>
                            )}
                        </>
                    }
                    </div>
                ) : null}
            </div>
            )}
            { warning && props.warningMsg ?
                    <div className="fs-12 line-height-1-3 text-warning mt-2 weight-500 border-radius">
                        {props.warningMsg}
                    </div>
            : error && errorMsg ?
                <div className="fs-12 line-height-1-3 text-danger mt-2 weight-500 border-radius">
                    {errorMsg}
                </div>
            : null}
        </div>
    )
}

export default InputRow