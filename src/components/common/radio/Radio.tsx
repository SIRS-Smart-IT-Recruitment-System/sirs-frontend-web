import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import "./Radio.css";

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
}

function Radio({ label, disabled = false, className = "", id, ...props }: RadioProps) {
    const generatedId = useId();
    const radioId = id ?? generatedId;

    return (
        <label
            htmlFor={radioId}
            className={`radio-wrapper ${disabled ? "disabled" : ""} ${className}`}
        >
            <input
                id={radioId}
                type="radio"
                className="radio-input"
                disabled={disabled}
                {...props}
            />
            <span className="radio-circle" />
            {label && <span className="radio-label">{label}</span>}
        </label>
    );
}

export default Radio;
