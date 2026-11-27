import { useState } from "react";
import "./Avatar.css";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    initials?: string;
    size?: AvatarSize;
    className?: string;
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("");
}

function Avatar({ src, alt, name, initials: customInitials, size = "md", className = "" }: AvatarProps) {
    const [imgError, setImgError] = useState(false);

    const showImage = src && !imgError;
    const initials = customInitials ?? (name ? getInitials(name) : "?");

    return (
        <div className={`avatar avatar-${size} ${className}`} aria-label={alt ?? name}>
            {showImage ? (
                <img
                    src={src}
                    alt={alt ?? name ?? "Avatar"}
                    className="avatar-img"
                    onError={() => setImgError(true)}
                />
            ) : (
                <span>{initials}</span>
            )}
        </div>
    );
}

export default Avatar;
