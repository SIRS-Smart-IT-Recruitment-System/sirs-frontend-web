import { useId, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Upload } from "lucide-react";

import Button from "../button/Button";
import "./FileUpload.css";

interface FileUploadProps {
    label: string;
    extensions: string[];
    onSelect: (file: File) => void;
    disabled?: boolean;
}

function FileUpload({
    label,
    extensions,
    onSelect,
    disabled = false,
}: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const errorId = useId();
    const [error, setError] = useState("");

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) {
            return;
        }

        const validExtension = extensions.some((extension) =>
            file.name.toLowerCase().endsWith(extension.toLowerCase())
        );

        if (!validExtension) {
            setError(`Chọn tệp có định dạng ${extensions.join(", ")}.`);
            return;
        }

        setError("");
        onSelect(file);
    };

    return (
        <div className="file-upload">
            <input
                ref={inputRef}
                type="file"
                accept={extensions.join(",")}
                aria-label={label}
                onChange={handleChange}
                disabled={disabled}
                hidden
            />

            <Button
                type="button"
                variant="outline"
                disabled={disabled}
                aria-describedby={error ? errorId : undefined}
                onClick={() => inputRef.current?.click()}
            >
                <Upload size={17} aria-hidden="true" />
                {label}
            </Button>

            {error && (
                <p id={errorId} className="file-upload-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

export default FileUpload;
