import React from 'react'

const ContentBox = ({ title, label, active, className, onClick }) => {
    return (
        <div className={`p-3 p-sm-2 flex-1 border border-radius pointer${active ? " border-brand text-brand fill-brand weight-600 outline-brand border-color-brand" : " color-border-on-hover border-secondary text-secondary fill-secondary"}${className ? ` ${className}` : ""}`}
            onClick={onClick}
        >
            <div className="flex flex-col h-100">
                {title !== undefined ?
                    <div className="fs-14 fs-sm-12 flex-1 line-height-1">
                        {title}
                    </div>
                : null }
                {label !== undefined ?
                    <div className={`fs-16 fs-sm-14 weight-600`}>
                        {label}
                    </div>
                    : null }
            </div>
        </div>
    )
}

export default ContentBox