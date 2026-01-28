'use client';

import { useState, useEffect, useRef } from 'react';
import './styles/FsModal.css';
import { createPortal } from 'react-dom';

const FsModal = ({
    children,
    title,
    secondary,
    fsmOpen,
    onClose,
    setIsFsmOpen,
    logo,
    classNameContainer,
    fullScreen,
    classNameTitle,
    titleMiddle,
    classNameBody,
    classNameHeader,
    ...props
}) => {
    const wrapperRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const closeModal = () => {
        if (setIsFsmOpen) {
            setIsFsmOpen(false);
        }
        if (onClose) {
            onClose();
        }
    }

    const onClickOutside = (e) => {
        if (fullScreen) return
        if (e.target.classList.contains('fsm-wrapper')) {
            closeModal();
        }
    }

    const onEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    }

    useEffect(() => {
        let timer;

        if (fsmOpen) {
            document.addEventListener('mousedown', onClickOutside);
            document.addEventListener('pointerdown', onClickOutside);
            document.addEventListener('keydown', onEsc);
        } else {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('pointerdown', onClickOutside);
            document.removeEventListener('keydown', onEsc);
        }

        if (!fsmOpen) {
            wrapperRef?.current?.addEventListener('transitionend', () => {
                setIsOpen(false);
            });
        } else {
            setIsOpen(true);
        }

        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('pointerdown', onClickOutside);
            document.removeEventListener('keydown', onEsc);
            clearTimeout(timer);
        }
    }, [fsmOpen]);

    useEffect(() => {
        return () => {
            document.removeEventListener('click', onClickOutside);
            document.removeEventListener('keydown', onEsc);
            document.body.style.overflow = 'auto';
        }
    }, []);

    return createPortal(
        isOpen ?
            <div 
                className={`fsm-wrapper${fsmOpen ? ' open' : ' closed'}${fullScreen ? ' fsm-full-screen' : ''}${props.mobileSlide ? ` fsm-mobile-slide` : ' fsm-mobile-default'}`}
                ref={wrapperRef}
            >
                <div className={`fsm${props.openBottom ? " fsm-bottom" : ""}${classNameContainer ? ` ${classNameContainer}` : ""}`}>
                    <div className={`fsm-body safe-area-bottom overflow-x-hidden${classNameBody ? ` ${classNameBody}` : ''}`}>
                        {children}
                    </div>
                </div>
            </div>
        : null
        ,
        document.body
    )
}

export default FsModal