import { useId } from "react";
import type { TextareaHTMLAttributes } from "react";
import "./Textarea.css";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

function Textarea({ label, error, hint, disabled = false, className = "", id, ...props }: TextareaProps) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
        <div className="textarea-group">
            {label && (
                <label htmlFor={textareaId} className="textarea-label">
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                className={`textarea-field ${error ? "has-error" : ""} ${className}`}
                disabled={disabled}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
                {...props}
            />
            {hint && !error && (
                <span id={`${textareaId}-hint`} className="textarea-hint">{hint}</span>
            )}
            {error && (
                <span id={`${textareaId}-error`} className="textarea-error">{error}</span>
            )}
        </div>
    );
}

export default Textarea;
