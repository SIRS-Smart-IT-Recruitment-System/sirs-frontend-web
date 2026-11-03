<<<<<<< HEAD

=======
>>>>>>> origin/master
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

<<<<<<< HEAD
function Button({
                    children,
                    variant = "primary",
                    loading = false,
                    disabled = false,
                    className = "",
                    ...props
                }: ButtonProps) {
=======
function Button({children, variant = "primary", loading = false, disabled = false, className = "", ...props}: ButtonProps) {
>>>>>>> origin/master

    return (
        <button
            className={`btn btn-${variant} ${className}`}
            disabled={disabled || loading}
            aria-busy={loading}
            {...props}
        >
            {loading && <span className="btn-spinner" />}
<<<<<<< HEAD

=======
>>>>>>> origin/master
            {children}
        </button>
    );
}

export default Button;
