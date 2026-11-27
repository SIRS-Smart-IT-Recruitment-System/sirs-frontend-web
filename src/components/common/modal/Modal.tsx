import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import "./Modal.css";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
}

function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
    const titleId = useId();
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        dialogRef.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;

            if (previousFocus instanceof HTMLElement) {
                previousFocus.focus();
            }
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
                return;
            }

            if (event.key !== "Tab" || !dialogRef.current) {
                return;
            }

            const dialog = dialogRef.current;
            const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
                'a[href], button, input, select, textarea, [tabindex]'
            )).filter((element) =>
                element.tabIndex >= 0 &&
                !element.matches(":disabled") &&
                element.getClientRects().length > 0
            );
            const first = focusable[0];
            const last = focusable.at(-1);
            const active = document.activeElement;

            if (!first || !last) {
                event.preventDefault();
            } else if (event.shiftKey && (active === first || active === dialog)) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div
                ref={dialogRef}
                className="modal-container"
                role="dialog"
                tabIndex={-1}
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 id={titleId} className="modal-title">
                        {title}
                    </h2>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Đóng hộp thoại"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </div>

                <div className="modal-body">
                    {children}
                </div>

                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}

export default Modal;
