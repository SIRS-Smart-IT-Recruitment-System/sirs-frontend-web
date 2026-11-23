import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import "./Toast.css";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

function Toast({
    message,
    type = "success",
    duration = 3000,
    onClose,
}: ToastProps) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onClose, 250);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 250);
    };

    return (
        <div
            className={`toast toast-${type} ${isExiting ? "toast-exit" : ""}`}
            role="alert"
        >
            <span className="toast-icon">
                {type === "success" && <CheckCircle2 size={20} />}
                {type === "error" && <AlertCircle size={20} />}
                {type === "info" && <Info size={20} />}
            </span>
            <span className="toast-message">{message}</span>
            <button
                type="button"
                className="toast-close"
                onClick={handleClose}
                aria-label="Đóng thông báo"
            >
                <X size={16} />
            </button>
        </div>
    );
}

export default Toast;
