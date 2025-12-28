import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import Banner from './Banner'
import ErrorInfo from './ErrorInfo'

const ConfirmAction = ({ children, title, secondary, isLoading, type, onClick, className, content, actionDangerBtnText, actionBtnText, disabled }) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!isLoading) setOpen(false)
    }, [isLoading])

    // add listener to close modal on escape key or enter to confirm action
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
            } else if (event.key === 'Enter' && open && onClick) {
                onClick(event);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onClick]);


    return (
        <>
            <Modal
                modalIsOpen={open}
                setModalIsOpen={setOpen}
                headerNone
                isLoading={isLoading}
                actionBtnText={onClick ? actionBtnText ? actionBtnText : "Confirm" : ''}
                onSubmit={onClick}
                actionDangerBtnText={actionDangerBtnText ? actionDangerBtnText : "Cancel"}
                onSubmitDanger={(e) => {
                    e.stopPropagation()
                    setOpen(false)
                }}
                smallWindow
                smallWindowCenter
                type={type}
                classNameContent={type === 'danger' ? 'text-danger' : ''}
                classNameBody="overflow-hidden"
                dialogWindow
                disabledAction={disabled}
            >
                {content ?
                    content
                :
                <div className="flex flex-col gap-1 text-center">
                    <div className="fs-18 weight-600">
                        {title}
                    </div>
                    <div className="fs-14">
                        {secondary}
                    </div>
                </div>
                }
            </Modal>
            <div
                onClick={(e) => {
                    e.stopPropagation()
                    setOpen(true)}}
                className={className ? `${className}` : ''}
            >
                {children}
            </div>
        </>
    )
}

export default ConfirmAction