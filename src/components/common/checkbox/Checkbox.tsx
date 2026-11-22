import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import "./Checkbox.css";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
}

function Checkbox({ label, disabled = false, className = "", id, ...props }: CheckboxProps) {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    return (
        <label
            htmlFor={checkboxId}
            className={`checkbox-wrapper ${disabled ? "disabled" : ""} ${className}`}
        >
            <input
                id={checkboxId}
                type="checkbox"
                className="checkbox-input"
                disabled={disabled}
                {...props}
            />
            <span className="checkbox-box" />
            {label && <span className="checkbox-label">{label}</span>}
        </label>
    );
}

export default Checkbox;
