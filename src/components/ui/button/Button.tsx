import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    loading?: boolean;
}

function Button({children, variant = "primary", loading = false, disabled = false, className = "", ...props}: ButtonProps) {

    return (
        <button
            className={`btn btn-${variant} ${className}`}
            disabled={disabled || loading}
            aria-busy={loading}
            {...props}
        >
            {loading && <span className="btn-spinner" />}
            {children}
        </button>
    );
}

export default Button;
