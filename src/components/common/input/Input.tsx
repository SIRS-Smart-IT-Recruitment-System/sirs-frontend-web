import { useState, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import "./Input.css";

interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    error?: string;
    type?: "text" | "password" | "email" | "number" | "url";
    leftIcon?: ReactNode;
}

function Input({
    label,
    error,
    type = "text",
    leftIcon,
    id,
    disabled = false,
    className = "",
    ...props
}: InputProps) {

    const generatedId = useId();
    const inputId = id ?? generatedId;

    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;
    const hasIcon = Boolean(leftIcon);
    const hasToggle = type === "password";

    return (
        <div className="input-group">
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                </label>
            )}

            <div className={`input-wrapper ${hasIcon ? "has-icon" : ""} ${hasToggle ? "has-toggle" : ""} ${error ? "has-error" : ""}`}>
                {leftIcon && (
                    <span className="input-icon" aria-hidden="true">
                        {leftIcon}
                    </span>
                )}

                <input
                    id={inputId}
                    type={inputType}
                    className={`input-field ${className}`}
                    disabled={disabled}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...props}
                />

                {type === "password" && (
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={disabled}
                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                        {showPassword ? "Ẩn" : "Hiện"}
                    </button>
                )}
            </div>

            {error && (
                <span id={`${inputId}-error`} className="input-error">
                    {error}
                </span>
            )}
        </div>
    );
}

export default Input;
