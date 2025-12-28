const Icon = ({size, sizeSm, icon, className, type, dataTooltipContent, onClick, dataTooltipId, dataTooltipPosition}) => {
    return (
        <div className={`icon${size ? ` icon-${sizeSm && window.innerWidth < 800 ? sizeSm : size}` : ' icon-md'}${className ? ` ${className}` : ''}${type ? ` fill-${type}` : ''}`}
            data-tooltip-id={`${dataTooltipId ? dataTooltipId : dataTooltipContent ? 'tooltip-default' : ''}`}
            data-tooltip-content={dataTooltipContent}
            data-tooltip-place={dataTooltipPosition ? dataTooltipPosition : 'bottom'}
            onClick={onClick}
        >
            {icon}
        </div>
    )
}

export default Icon