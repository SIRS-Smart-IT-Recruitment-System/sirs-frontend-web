import type { ReactNode } from "react";
import "./Badge.css";

type BadgeVariant = "default" | "primary" | "success" | "danger" | "warning" | "info";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    className?: string;
}

function Badge({ children, variant = "default", size = "md", className = "" }: BadgeProps) {
    return (
        <span className={`badge badge-${variant} badge-${size} ${className}`}>
            {children}
        </span>
    );
}

export default Badge;
