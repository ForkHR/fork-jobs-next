import './styles/ProgressBar.css'

const ProgressBar = ({ value, type, dynamic, size, pendingColor, customProgressColor }) => {
    return (
        <div className={`progress-bar${customProgressColor ? ' progress-bar-custom' : dynamic ? value >= 90 ? ' progress-bar-primary' : value >= 50 ? ' progress-bar-success' : value >= 10 ? ' progress-bar-warning' : ' progress-bar-danger' : '' }${type ? ` progress-bar-${type}` : ''}`}
            style={{
                '--progress-bar-width': `${value >= 100 ? 100 : value}%`,
                '--progress-bar-height': `${size || 10}px`,
                backgroundColor: pendingColor || 'var(--color-border)',
                '--progress-bar-color': customProgressColor || 'var(--color-brand)',
            }}
        />
        );
    };

export default ProgressBar