import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { FileSearch, FolderOpen, Search, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge, Button } from "../../components/common";
import s from "./Recruitment.module.css";

export function Metric({
    label,
    value,
    icon: Icon,
    hint,
    link,
}: {
    label: string;
    value: number | string;
    icon: LucideIcon;
    hint: string;
    link?: ReactNode;
}) {
    return (
        <article className={s.metric}>
            <header>
                <span>{label}</span>
                <i>
                    <Icon size={19} />
                </i>
            </header>
            <strong>{value}</strong>
            <small>{hint}</small>
            {link}
        </article>
    );
}

export function Status({ value }: { value: string }) {
    const variant =
        value === "Đã từ chối" || value === "Đã hủy"
            ? "danger"
            : value.startsWith("Chờ")
            ? "warning"
            : value === "Phỏng vấn"
            ? "primary"
            : "success";
    return (
        <Badge size="sm" variant={variant}>
            {value}
        </Badge>
    );
}

export function Empty({
    title,
    filtered = false,
    onReset,
}: {
    title: string;
    filtered?: boolean;
    onReset?: () => void;
}) {
    const Icon = filtered ? FileSearch : FolderOpen;
    return (
        <div className={s.state} role="status">
            <Icon size={32} />
            <h3>{title}</h3>
            {filtered && (
                <>
                    <p>Thử từ khóa khác hoặc xóa các điều kiện đang chọn.</p>
                    <Button variant="outline" onClick={onReset}>
                        Xóa bộ lọc
                    </Button>
                </>
            )}
        </div>
    );
}

export function SearchField({
    value,
    onChange,
    label,
}: {
    value: string;
    onChange: (value: string) => void;
    label: string;
}) {
    return (
        <label className={s.search}>
            <Search size={17} />
            <input
                type="search"
                aria-label={label}
                placeholder={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
}

// Native modal focus handling keeps keyboard navigation and Escape inside the active surface.
export function Surface({
    title,
    drawer,
    onClose,
    children,
    footer,
}: {
    title: string;
    drawer?: boolean;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    useEffect(() => {
        const dialog = ref.current!;
        dialog.showModal();
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            dialog.close();
            document.body.style.overflow = overflow;
        };
    }, []);
    return (
        <dialog
            ref={ref}
            className={drawer ? s.drawer : s.dialog}
            aria-labelledby={titleId}
            onCancel={(e) => {
                e.preventDefault();
                onClose();
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    const box = e.currentTarget.getBoundingClientRect();
                    if (
                        e.clientX < box.left ||
                        e.clientX > box.right ||
                        e.clientY < box.top ||
                        e.clientY > box.bottom
                    )
                        onClose();
                }
            }}
        >
            <header className={s.surfaceHead}>
                <h2 id={titleId}>{title}</h2>
                <button type="button" aria-label="Đóng" onClick={onClose}>
                    <X size={20} />
                </button>
            </header>
            <div className={s.surfaceBody}>{children}</div>
            {footer && <footer className={s.surfaceFoot}>{footer}</footer>}
        </dialog>
    );
}
