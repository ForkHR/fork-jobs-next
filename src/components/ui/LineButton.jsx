import { useState } from "react"
import { checkIcon, copyIcon, chevronRightIcon } from "../../assets/img/icons"
import IconButton from "./IconButton"


const LineButton = ({column, label, title, placeholder, viewOnly, icon, onClick, type, noAction, disabled, rightIcon, rightLabel, rightCustom, secondary, className, classNameContainer, borderWidth,  isLoading, children, copy, showOverflowLabel}) => {
    const [isCopied, setIsCopied] = useState(false)

    return (
        <div className={`line-button display-on-hover-parent ${viewOnly || (copy && !onClick) || noAction ? '' : 'bg-tertiary-hover transition-duration pointer '} ${isLoading ? ' bg-tertiary cursor-disabled' : disabled ? " text-secondary cursor-disabled" : ""}${classNameContainer ? `${classNameContainer} ` : ""}`}>
        <div className={`${className ? `${className} ` : ""}flex justify-between overflow-hidden gap-3 align-center${column ? '' : ' mx-2'} ${borderWidth ? borderWidth : 'border-w-1'}${viewOnly || copy || noAction ? '' : ' hover-border-transparent '} border-secondary`}
            onClick={viewOnly ? undefined : !disabled && !isLoading ? onClick ? onClick : undefined : undefined}>
            <div className="flex align-center flex-grow-1 overflow-hidden">
                {title ?
                <div className={`flex flex-sm-col flex-grow-1 w-min-0${column ? ' flex-col' : ''}`}>
                    <div className={`flex flex-col flex-1 pb-sm-0 w-set-sm-auto${column ? ' px-0 pt-2 pb-1' : ' px-1 w-set-200-px py-3'}`}>
                        <div className="flex align-center text-secondary">
                            {icon &&
                                <span className={`icon me-2 icon-xs`}>
                                    {icon}
                                </span>
                            }
                            <span className="fs-12 weight-400">
                                {title}
                            </span>
                        </div>
                    </div>
                    <div className="flex-grow-1">
                    {children ? (
                        children
                        ) : (
                            <div className="flex overflow-hidden">
                            <div className={`fs-14 fs-sm-16 flex gap-2 align-center text-wrap-anywhere${column ? ' pt-0 pb-2 px-0' : ' py-3 px-1'}${noAction ? "" : ""}${!showOverflowLabel ? " text-ellipsis " : ""} overflow-hidden${type ? ` text-${type}` : ""}`}>
                                {label ? label: <span className="text-secondary">{placeholder}</span>}
                                {copy && label?.length && label !== '-' ?
                                    <div className="flex align-center justify-center"
                                        title="Copy to clipboard"
                                    >
                                        <IconButton
                                            variant="link"
                                            size="sm"
                                            className="ms-2 p-0"
                                            icon={isCopied ? checkIcon : copyIcon}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigator.clipboard.writeText(label)
                                                setIsCopied(true)
                                                setTimeout(() => setIsCopied(false), 2000)
                                            }}
                                            muted
                                            />
                                        </div>
                                    : null}
                            </div>
                            </div>
                        )}
                    </div>
                </div>
                :
                <div className="px-1 py-3 flex gap-3 align-center">
                    {icon &&
                        <div className={`icon icon-sm${type ? ` fill-${type}` : ""}`}>
                            {icon}
                        </div>
                    }
                    <div className="flex flex-col">
                        <div>
                            <div className={`fs-16 ${type ? ` text-${type}` : ""}`}>
                                {label ? label : <span className="text-secondary">{placeholder}</span>}
                            </div>
                        </div>
                        {secondary &&
                            <div>
                                <div className="fs-14 mt-1 text-secondary">
                                    {secondary}
                                </div>
                            </div>
                        }
                    </div>
                </div>
                }
            </div>
            { rightIcon === 'none' ?
                null
            : rightCustom ?
                rightCustom
            : rightIcon ?
                <div className="icon icon-sm px-1 py-3">
                    {rightIcon}
                </div>
            : rightLabel ?
                <div className="fs-14 px-1 py-3">
                    {rightLabel}
                </div>
            : !noAction && !viewOnly ?
                <div className={`icon icon-xs${isLoading ? ' spinner' : " px-1 py-3 display-on-hover"}`}>
                    {isLoading ? null : !disabled ? chevronRightIcon : null}
                </div>
            : null}
        </div>
        </div>
    )
}

export default LineButton