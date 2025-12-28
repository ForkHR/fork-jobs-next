import { checkIcon, dotIcon, uncheckIcon } from '../../assets/img/icons'
import './styles/CheckBox.css'

const CheckBox = ({checked, uncheck,  label, labelLeft, onClick, className, disabled, fontSize, rounded, type, isLoading, size, secondaryLabel, radio, dataTooltipContent, readOnly }) => {

    return (
        <div className={`checkbox-wrapper${readOnly ? " checkbox-read-only" : ""}${checked ? ' checkbox-wrapper-checked' : ''}${className ? ` ${className}` : ''}${disabled ? ' disabled' : ''}${fontSize ? ` fs-${fontSize}` : ''}${rounded ? ' checkbox-rounded' : ''}${type ? ` checkbox-${type}` : ''}${size ? ` checkbox-${size}` : ''}`}
            onClick={isLoading || disabled || readOnly ? null : onClick ? onClick : null}
                data-tooltip-id={`tooltip-default`}
                data-tooltip-content={dataTooltipContent ? dataTooltipContent : null}
        >
            {labelLeft ? <span className="checkbox-label text-ellipsis-2">{labelLeft}</span> : null}
            {isLoading ? <span className="spinner"></span> : 
            radio ?
                <div className="checkbox">
                    {checked ? <span className="checkbox-checked">{dotIcon} </span> : null}  
                </div>
            :
                <div className="checkbox">
                    {checked ? <span className="checkbox-checked">{uncheck ? uncheckIcon : checkIcon}</span> : null}
                </div>
            }
            {label ? 
                <div className="flex overflow-hidden flex-col">
                    <span className="checkbox-label text-ellipsis-2">{label}</span>
                    {secondaryLabel ? <span className="fs-12 text-secondary">{secondaryLabel}</span> : null}
                </div>
            : null}
        </div>
    )
}

export default CheckBox