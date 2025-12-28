import React from 'react'
import Avatar from './Avatar'

const AvatarGroup = ({items, limit, size}) => {
    return (
        <div className="flex">
            {items && items.length && items
            .slice(0, items.length === limit ? limit : limit - 1)
            .map((item, index) => (
                <div
                    key={index}
                    className="outline border-radius-50 outline-main outline-w-2"
                    style={{
                        marginLeft: index > 0 ? '-10px' : '0px',
                        zIndex: items.length - index,
                    }}
                >
                    <Avatar
                        img={item.img}
                        name={item.name}
                        rounded
                        dataTooltipContent={item.name}
                        size={size ? size : "xs" }
                        sizeSm={size ? size : "xs" }
                    />
                </div>
            ))}
            {items && items.length > limit && (
                <div
                    className="outline border-radius-50 outline-main outline-w-2"
                    style={{
                        marginLeft: '-10px',
                        zIndex: 0,
                    }}
                >
                    <Avatar
                        img={`https://ui-avatars.com/api/?name=%2B${items.length - limit+1}&rounded=true&size=64&length=3&font-size=0.33`}
                        name={`+${items.length - limit+1}`}
                        len={3}
                        rounded
                        dataTooltipContent={`+${items.length - limit+1} more`}
                        size={size ? size : "xs" }
                        sizeSm={size ? size : "xs" }
                    />
                </div>
            )}
        </div>
    )
}

export default AvatarGroup