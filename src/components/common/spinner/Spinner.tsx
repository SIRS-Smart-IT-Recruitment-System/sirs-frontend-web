import "./Spinner.css";

type SpinnerSize = "xs" | "sm" | "md" | "lg";
type SpinnerColor = "primary" | "white";

interface SpinnerProps {
    size?: SpinnerSize;
    color?: SpinnerColor;
    label?: string;
    className?: string;
}

function Spinner({ size = "md", color = "primary", label, className = "" }: SpinnerProps) {
    if (label) {
        return (
            <div className={`spinner-wrapper ${className}`} role="status">
                <span className={`spinner spinner-${size} spinner-${color}`} />
                <span className="spinner-label">{label}</span>
            </div>
        );
    }

    return (
        <span
            className={`spinner spinner-${size} spinner-${color} ${className}`}
            role="status"
            aria-label="Đang tải..."
        />
    );
}

export default Spinner;
