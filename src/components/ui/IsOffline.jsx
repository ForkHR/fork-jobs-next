'use client';

import { useEffect, useState } from "react"
import { toast } from 'react-toastify';
import Icon from "./Icon";
import { wifiOffIcon } from "../../assets/img/icons";


const IsOffline = () => {
    const [isOffline, setIsOffline] = useState(false)

    useEffect(() => {
        const handleOffline = () => {setIsOffline(true); console.log('offline')}
        const handleOnline = () => {setIsOffline(false); console.log('online')}

        window.addEventListener('offline', handleOffline)
        window.addEventListener('online', handleOnline)

        return () => {
            window.removeEventListener('offline', handleOffline)
            window.removeEventListener('online', handleOnline)
        }
    }, [])

    return (
        isOffline ?
        <div className="top-alert bg-warning-text text-white w-100 text-center animation-slide-up transition-duration"
            style={{zIndex: 9999}}
        >
            <div className="flex gap-3 align-center justify-center">
                <Icon
                    icon={wifiOffIcon}
                    size="sm"
                    className="fill-white"
                />
                <div className="fs-12 weight-500">
                    No internet connection
                </div>
            </div>
        </div>
        : null
    )
}

export default IsOffline