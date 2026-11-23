import { useState } from "react";
import type { ReactNode } from "react";
import "./Tooltip.css";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
    content: ReactNode;
    position?: TooltipPosition;
    children: ReactNode;
    className?: string;
}

function Tooltip({ content, position = "top", children, className = "" }: TooltipProps) {
    const [visible, setVisible] = useState(false);

    return (
        <div
            className={`tooltip-wrapper ${className}`}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onFocus={() => setVisible(true)}
            onBlur={() => setVisible(false)}
        >
            {children}
            {visible && content && (
                <div
                    className={`tooltip-content tooltip-${position}`}
                    role="tooltip"
                >
                    {content}
                </div>
            )}
        </div>
    );
}

export default Tooltip;
