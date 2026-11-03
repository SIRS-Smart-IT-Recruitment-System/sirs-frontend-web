<<<<<<< HEAD

=======
>>>>>>> origin/master
import { useState, useId } from "react";
import type { InputHTMLAttributes } from "react";
import "./Input.css";

interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    error?: string;
    type?: "text" | "password";
}

<<<<<<< HEAD
function Input({
                   label,
                   error,
                   type = "text",
                   id,
                   disabled = false,
                   className = "",
                   ...props
               }: InputProps) {
=======
function Input({label, error, type = "text", id, disabled = false, className = "", ...props}: InputProps) {
>>>>>>> origin/master

    const generatedId = useId();
    const inputId = id ?? generatedId;


    const [showPassword, setShowPassword] = useState(false);


    const inputType =
        type === "password" && showPassword ? "text" : type;

    return (
        <div className="input-group">
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                </label>
            )}

            <div className={`input-wrapper ${error ? "has-error" : ""}`}>
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
