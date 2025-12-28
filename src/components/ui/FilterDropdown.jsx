import { useState } from "react"
import { closeIcon, chevronDownIcon } from "../../assets/img/icons"
import Button from "./Button"
import Dropdown from "./Dropdown"
import "./styles/FilterDropdown.css"
import IconButton from "./IconButton"

const FilterDropdown = ({ children, label, applied, hideLabel, onApply, onClear, mobileDropdown, classNameParent, className, appliedText, hideAppliedText, showFilteredLabel, closeOnSelect }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dropdown
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            classNameParent={classNameParent}
            mobileDropdown={mobileDropdown}
            dropdownLabel={mobileDropdown ? `${label}` : null}
            closeOnSelect={closeOnSelect}
            classNameDropdown="p-0"
            customDropdown={
                <div className={`filter-dropdown${applied.length > 0 ? " filter-applied": ""}`}>
                    {showFilteredLabel && applied.length > 0 ?
                    <>
                    <div className="fs-12 weight-500 text-secondary-light">
                        {label}
                    </div>
                    <div className="fs-12 weight-500 text-secondary-light">
                        |
                    </div>
                    </>
                    : null}
                    <div className={`filter-dropdown-label flex-1 flex-shrink-0 text-start${className ? ` ${className}` : " text-nowrap"}`}>{ appliedText ? appliedText : label || 'Filter' }</div>
                    { hideAppliedText ? null : applied?.length > 0 ?
                    <>
                    <div className="filter-dropdown-applied weight-500 text-nowrap">{applied?.length}</div>
                    </>
                    : null }
                    <div className={`pointer-events-none user-select-none transition-duration filter-dropdown-icon${isOpen ? " transform-rotate-180" : ""}`}>
                        {chevronDownIcon}
                    </div>
                </div>
            }
            
        >
            <div>
                { hideLabel ? null :
                mobileDropdown && window.innerWidth < 768 ? null :
                label &&
                <div className="flex justify-between gap-4 overflow-hidden p-2 align-center">
                    <div className="fs-14 weight-600 text-ellipsis">{label}</div>
                    <IconButton
                        icon={closeIcon}
                        type="secondary"
                        muted
                        variant="text"
                        onClick={() => setIsOpen(false)}
                    />
                </div>
                }
                {children}
                { (onApply || onClear) ?
                <div className="flex gap-2 align-center justify-end pt-1">
                    {onClear &&
                    <Button
                        label="Clear"
                        variant="default"
                        type="secondary"
                        onClick={() => {
                            onClear && onClear()
                            setIsOpen(false)
                        }}
                        size="sm"
                        smSize="lg"
                        borderRadius="lg"
                        className="text-center justify-center w-sm-100"
                    />
                    }
                    {onApply &&
                        <Button
                            label="Apply"
                            variant="filled"
                            type="secondary"
                            onClick={() => {
                                setIsOpen(false)
                                onApply()
                            }}
                            size="sm"
                            smSize="lg"
                            borderRadius="lg"
                            className="text-center justify-center w-sm-100"
                        />
                    }
                </div>
                : null
                }
            </div>
        </Dropdown>
    )
}

export default FilterDropdown