import { useEffect, useRef, useState } from "react";

export const useLoadingBar = () => {
    const [progress, setProgress] = useState(0);
    const [active, setActive] = useState(false);
    const intervalRef = useRef(null);

    const start = () => {
        setProgress(0);
        setActive(true);

        intervalRef.current = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + Math.random() * 10 : prev));
        }, 200);
    };

    const finish = () => {
        clearInterval(intervalRef.current);
        setProgress(100);

        setTimeout(() => {
        setActive(false);
        setProgress(0);
        }, 500);
    };

    useEffect(() => () => clearInterval(intervalRef.current), []);

    return { progress, active, start, finish };
};
