'use client';
import { useRef, useState, useEffect } from 'react';
import './styles/Tabs.css';

const Tabs = ({items, active, onChange, iconOnly, size, setActiveTabName, activeTabName}) => {
    const activeRef = useRef(null);
    const indicatorRef = useRef(null);
    const containerRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [indicatorWidth, setIndicatorWidth] = useState(0);
    const [indicatorLeft, setIndicatorLeft] = useState(0);

    useEffect(() => {
        window.addEventListener('resize', () => {
            setWindowWidth(window.innerWidth);
        }, false);

        return () => {
            window.removeEventListener('resize', () => {
                setWindowWidth(window.innerWidth);
            }, false);
        }
    }, []);

    useEffect(() => {
        const activeTab = activeRef.current;
        const indicator = indicatorRef.current;
        if (indicator && activeTab) {
            const activeTabWidth = activeTab?.getBoundingClientRect()?.width;
            // Get not rounded offsetLeft
            const activeTabLeft = activeTab?.getBoundingClientRect()?.left - containerRef.current.getBoundingClientRect().left;
            setIndicatorWidth(activeTabWidth); // Subtract 2px for border
            setIndicatorLeft(activeTabLeft);
        }
    }, [active, windowWidth, activeTabName, items]);

    useEffect(() => {
        if (indicatorRef) {
            setTimeout(() => {
                indicatorRef?.current?.classList?.remove('animation-prevent');
            }, 300);
        }
    }, [indicatorRef]);

    return (
        <div className={`tabs${size ? ` tabs-${size}` : ''}`} ref={containerRef}>
            <div className="tabs-container">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`tab${(active === index) || (activeTabName && activeTabName === item?.label?.toLowerCase()) ? ' active': ''}`}
                        onClick={
                            () => { 
                                onChange && onChange(index);
                                setActiveTabName && setActiveTabName(item.label.toLowerCase());
                            }
                        }
                        ref={(active === index) || (activeTabName && activeTabName === item?.label?.toLowerCase()) ? activeRef : null}
                        data-tooltip-id={item.dataTooltipContent ? "tooltip-default" : null}
                        data-tooltip-content={item.dataTooltipContent ? item.dataTooltipContent : null}
                    >
                        {item.icon && <span className={`tab-icon${!item.label ? ' no-label' : ''}`}>{item.icon}</span>}
                        {item.icon && iconOnly ? null : item.label && <span className="tab-label">{item.label}</span>}
                    </div>
                ))}
            </div>
            <span className="tabs-indicator animation-prevent" ref={indicatorRef}
                style={{
                    width: indicatorWidth,
                    left: indicatorLeft,
                }}
            />
        </div>
    )
}

export default Tabs