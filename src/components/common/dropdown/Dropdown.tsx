import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import "./Dropdown.css";

interface DropdownItem {
    label: string;
    onClick?: () => void;
    icon?: ReactNode;
    danger?: boolean;
    disabled?: boolean;
    divider?: boolean;
}

interface DropdownProps {
    trigger: ReactNode;
    items: DropdownItem[];
    align?: "left" | "right";
    className?: string;
}

function Dropdown({ trigger, items, align = "left", className = "" }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleOutsideClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setIsOpen(false);
        }
        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className={`dropdown ${className}`} ref={dropdownRef}>
            <button
                type="button"
                className={`dropdown-trigger ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {trigger}
                <svg
                    className={`dropdown-chevron ${isOpen ? "open" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {isOpen && (
                <div className={`dropdown-menu ${align === "right" ? "align-right" : ""}`} role="menu">
                    {items.map((item, index) => {
                        if (item.divider) {
                            return <div key={`divider-${index}`} className="dropdown-divider" />;
                        }
                        return (
                            <button
                                key={index}
                                type="button"
                                className={`dropdown-item ${item.danger ? "danger" : ""}`}
                                onClick={() => {
                                    item.onClick?.();
                                    setIsOpen(false);
                                }}
                                disabled={item.disabled}
                                role="menuitem"
                            >
                                {item.icon && <span>{item.icon}</span>}
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Dropdown;
