import './styles/LineButtonGroup.css'

const LineButtonGroup = ({ children, title, actionChildren }) => {
    return (
        <div className={`line-button-group`}>
            <div className={`line-button-group-content border border-radius border-secondary border-sm-none bg-secondary`}>
                {title && 
                    <div className="flex justify-between align-center">
                        <div className="fs-16 px-4 py-2 weight-500 border-secondary border-sm-none px-sm-3 border-top-radius">
                            {title}
                        </div>
                        {actionChildren && actionChildren}
                    </div>
                }
                <div className="border-radius overflow-hidden bg-main">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default LineButtonGroup