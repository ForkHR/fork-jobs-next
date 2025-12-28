import './styles/RangeSlider.css'

const RangeSlider = ({value, onChange, min, max, className, step}) => {
    return (
        <div className="flex align-center pos-relative">
            <div className="fs-16 weight-500 pos-absolute left-0 px-4 text-secondary mask-right pointer-events-none"
                style={{
                    left: "6px",
                }}
            >
                <span className="bold pe-4">
                    {min}
                </span>
                Slide to rate {`> > > > > > >`}
            </div>
            <div className="fs-16 bold pos-absolute right-0  text-secondary pointer-events-none flex justify-center align-center"
                style={{
                    right: "12px",
                    width: "28px"
                }}
            >
                {max}
            </div>
            <input
                className={`range-input${!value ? " range-input-empty" : ""}${className ? ` ${className}` : ""}`}
                type="range"
                step={step}
                min={min}
                max={max}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}

export default RangeSlider