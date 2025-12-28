import React from 'react'
import Dropdown from './Dropdown'
import Button from './Button'

const DropdownTab = ({children, active}) => {
    return (
        window.innerWidth < 800 ? 
            <div className="flex border-bottom border-secondary gap-3 justify-between">
                <div className="pos-relative flex flex-col">
                    <div className="flex-1 flex align-center">
                        <Button
                            label={active}
                            type="secondary"
                            variant="text"
                            className="mb-1 text-capitalize"
                            size="sm"
                        />
                    </div>
                    <div className="pos-absolute bottom-0 w-100 bg-brand border-radius"
                        style={{ height: '2px'}}
                    />
                </div>
                <Dropdown
                    customDropdown={
                        <Button
                            label="More"
                            type="brand"
                            variant="text"
                            className="mb-1"
                            size="sm"
                        />
                    }
                    closeOnSelect
                >
                    {children}
                </Dropdown>
            </div>
        : children
    )
}

export default DropdownTab