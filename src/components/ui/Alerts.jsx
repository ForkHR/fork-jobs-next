import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/Alerts.css';

const Alerts = () => {
    const theme = useSelector((state) => state.local.theme);
    const [currTheme, setCurrTheme] = useState(theme);

    useEffect(() => {
        if(theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            setCurrTheme(systemTheme);
        } else if (theme === 'dark') {
            setCurrTheme('dark');
        } else {
            setCurrTheme('light');
        }
    }, [theme]);
    
    return (
        <ToastContainer
            position="bottom-center"
            theme={currTheme === 'dark' ? 'dark' : 'light'}
            autoClose={3000}
            transition={Slide}
            closeButtonClassName="toast-close"
            className="toast-container"
            draggable={false}
            limit={1}
            hideProgressBar={true}
            stacked={false}
            closeOnClick={true}
            closeButton={
                ({ closeToast }) => (
                    null
                )
            }
        />
    )
}

export default Alerts