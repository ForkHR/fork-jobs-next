import { useRef, useState, useEffect } from 'react';
import './styles/TabContent.css';

const TabContent = ({ items, active, onChange, setActive, setActiveTabName, activeTabName, classNameContainer, classNameItem }) => {
    const activeRef = useRef(null);
    const indicatorRef = useRef(null);
    const containerRef = useRef(null);
    const [indicatorWidth, setIndicatorWidth] = useState(0);
    const [indicatorLeft, setIndicatorLeft] = useState(0);

    useEffect(() => {
        const updateScrollPosition = () => {
            const activeTab = activeRef.current;
            const container = containerRef.current;

            if (activeTab && container) {
                const activeTabWidth = activeTab.offsetWidth;
                const activeTabLeft = activeTab.offsetLeft;
                const containerWidth = container.offsetWidth;
                const containerScrollLeft = container.scrollLeft;
                const containerHalfWidth = containerWidth / 2;
                const activeTabHalfWidth = activeTabWidth / 2;

                // Calculate the center position for the active tab
                const activeTabCenter = activeTabLeft + activeTabHalfWidth;
                const scrollLeft = activeTabCenter - containerHalfWidth;

                // Smoothly scroll the container to the calculated position
                container.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth',
                });

                // Update the indicator position and width
                setIndicatorWidth(activeTabWidth);
                setIndicatorLeft(activeTabLeft);
            }
        };

        updateScrollPosition();
    }, [active, items, activeTabName]);

    useEffect(() => {
        let timeout = null;
        if (indicatorRef.current) {
            timeout = setTimeout(() => {
                indicatorRef.current?.classList?.remove('animation-prevent');
            }, 200);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [indicatorRef, active, items, activeTabName, indicatorWidth, indicatorLeft]);

    return (
        <div className="tabs-content" ref={containerRef}>
            <div className={`tabs-content-container${classNameContainer ? ` ${classNameContainer}` : ''}`}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`tab-content p-1${classNameItem ? ` ${classNameItem}` : ''}${
                            active == index || (activeTabName && (activeTabName?.toLowerCase() == item?.label.toLowerCase() || activeTabName?.toLowerCase() == item?.to?.toLowerCase())) ? ' active' : ''
                        }`}
                        onClick={() => {
                            setActive && setActive(index);
                            setActiveTabName && setActiveTabName(item?.label?.toLowerCase());
                            onChange && onChange(item);
                        }}
                        ref={active == index || (activeTabName && (activeTabName?.toLowerCase() == item?.label?.toLowerCase() || activeTabName?.toLowerCase() == item?.to?.toLowerCase())) ? activeRef : null}
                    >
                        {item.icon && <span className="tab-content-icon">{item.icon}</span>}
                        <div className="tab-content-label p-2">{item.label}</div>
                        {item.count && <span className="tab-content-count border border-radius-sm border-secondary px-2 fs-12 weight-500">{item.count >= 10 ? '9+' : item.count}</span>}
                    </div>
                ))}
            </div>
            <span
                className="tabs-content-indicator animation-prevent"
                ref={indicatorRef}
                style={{
                    width: indicatorWidth,
                    left: indicatorLeft,
                }}
            />
        </div>
    );
};

export default TabContent;