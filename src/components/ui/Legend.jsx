import Link from 'next/link'
import Icon from './Icon'
import { arrowDownShortIcon, chevronDownIcon, chevronRightIcon } from '../../assets/img/icons'
import Dropdown from './Dropdown'
import Button from './Button'

const Legend = ({items}) => {
    return (
        items && items.length &&
        <div className="flex gap-2 flex-wrap">
            {items.map((item, index) => (
                <div className="flex gap-2 align-center"
                    key={index}
                >
                    {item.onClick ?
                        <div
                            onClick={item.onClick}
                            className={`fs-14 weight-500 transition-duration pointer${!item.active ? ' opacity-50 hover-opacity-100' : ''}`}
                        >
                            {item.label}
                        </div>
                    : item.dropdownItems ?
                        <Dropdown
                            closeOnSelect
                            customDropdown={
                                <div className="flex gap-2 align-center">
                                    <div className={`fs-14 weight-500 transition-duration pointer${!item.active ? ' opacity-50 hover-opacity-100' : ''}`}>
                                        {item.label}
                                    </div>
                                    <Icon
                                        icon={chevronDownIcon}
                                        size="xs"
                                    />
                                </div>
                            }
                        >
                            <div className="flex flex-col">
                            {item.dropdownItems.map((dropdownItem, index) => (
                                <Button
                                    key={index}
                                    label={dropdownItem.label}
                                    type="secondary"
                                    variant="text"
                                    className="justify-start"
                                    size="sm"
                                    to={dropdownItem.to}
                                />
                            ))}
                            </div>
                        </Dropdown>
                    :
                    <Link
                        key={index}
                        href={item.url}
                        className={`fs-14 weight-500 hover-opacity-75 transition-duration pointer${!item.active ? ' opacity-50' : ''}`}
                    >
                        {item.label}
                    </Link>
                    }
                    {item.active ?
                        null
                    :
                        <Icon
                            icon={chevronRightIcon}
                            size="xs"
                            className="opacity-75"
                        />
                    }   
                </div>
            ))}
        </div>
    )
}

export default Legend