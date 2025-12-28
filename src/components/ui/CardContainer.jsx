import Link from 'next/link'
import './styles/CardContainer.css'

const CardContainer = ({ children, className, onClick, to, borderNone }) => {
    return (
        <>
        {to ?
            <Link href={to} legacyBehavior>
                <a>
                    <div className={`card-container pos-relative${className ? ` ${className}` : ''}`}>
                        <div className={`overflow-hidden border-secondary py-3 flex justify-between align-center flex-grow-1 mx-3${borderNone ? ` border-none` : ''}`}>
                            {children}
                        </div>
                    </div>
                </a>
            </Link>
            :
            <div className={`card-container${className ? ` ${className}` : ''}`}
                onClick={onClick ? onClick : null}
            >
                <div className={`overflow-hidden border-secondary py-3 flex justify-between align-center flex-grow-1 ${!onClick ? `` : ' mx-3'}${borderNone ? ` border-none` : ''}`}>
                    {children}
                </div> 
            </div>
        }
        </>
    )
}

export default CardContainer