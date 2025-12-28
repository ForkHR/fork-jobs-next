import { useEffect, useRef, useState } from 'react';
import "./styles/Menu.css"

const Menu = ({ children, open, setOpen, index, items, ...props }) => {
    const menuRef = useRef();
    const menuBtnRef = useRef();
    const [topOffset, setTopOffset] = useState(0);

    const openMenuOnClick = (e) => {
        if(open) {
            if (e.target.classList.contains('menu') || e.target.classList.contains('menu-item') || e.target.classList.contains('menu-btn') || menuBtnRef?.current?.contains(e.target) || menuRef?.current?.contains(e.target)) {
                if(index) {
                    if(+e.target.dataset.menuIndex !== +index) setOpen(false)
                    else return
                } else return
            } else {
                setOpen(false);
            }
        }
    }


    useEffect(() => {
        window.addEventListener('click', openMenuOnClick);

        return () => {
            window.removeEventListener('click', openMenuOnClick);
        }
    }, [open]);

    useEffect(() => {
        if(!menuBtnRef.current) return;
        const menuBtnHeight = menuBtnRef.current.offsetHeight;
        const menuBtnTop = menuBtnRef.current.getBoundingClientRect().top;
        setTopOffset(menuBtnHeight + menuBtnTop - 4);
    }, [menuBtnRef]);

    return (
        <div className="pos-relative">
        {props?.menuButton ? (
            <div className="menu-btn" onClick={() => setOpen(!open)} ref={menuBtnRef}>
                {props?.menuButton}
            </div>
        ) : null}
        <div className={`menu${open ? ' menu-open' : ' menu-hidden'}`}
            ref={menuRef}
            style={{
                    top: `${topOffset}px`,
                }}
            >
            {items ? items.map((item, i) => (
                <div className="menu-item"
                    key={`menu-item-${i}`}
                    onClick={() => {
                        item.onClick();
                    }}
                >
                    <span className="menu-item-icon">{item.icon}</span>
                    {item.title}
                </div>
                )) : children
            }
        </div>
        </div>
    )
}

export default Menu