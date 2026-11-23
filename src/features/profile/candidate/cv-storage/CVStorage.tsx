import { useRef, useState } from "react";
import type { ChangeEvent } from "react";

import {
    FileText,
    FolderOpen,
    Plus,
    Eye,
    Trash2,
} from "lucide-react";

import styles from "./CVStorage.module.css";

interface CVFile {
    id: number;
    name: string;
    size: string;
    uploadedAt: string;
}

function CVStorage() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [cvFiles, setCVFiles] = useState<CVFile[]>([
        {
            id: 1,
            name: "NguyenVanA_Frontend_Developer.pdf",
            size: "2.4 MB",
            uploadedAt: "15/11/2026",
        },
        {
            id: 2,
            name: "NguyenVanA_CV_2026.pdf",
            size: "1.8 MB",
            uploadedAt: "10/11/2026",
        },
    ]);

    const [selectedCV, setSelectedCV] = useState<number | null>(1);

    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files) return;

        const availableSlots = 3 - cvFiles.length;

        const newFiles: CVFile[] = Array.from(files)
            .filter((file) => /\.(pdf|doc|docx)$/i.test(file.name))
            .slice(0, availableSlots)
            .map((file, index) => ({
                id: Date.now() + index,
                name: file.name,
                size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                uploadedAt: new Date().toLocaleDateString("vi-VN"),
            }));

        setCVFiles((prev) => [...newFiles, ...prev]);
        event.target.value = "";
    };

    const handleDelete = (id: number) => {
        setCVFiles((prev) => prev.filter((file) => file.id !== id));

        if (selectedCV === id) {
            setSelectedCV(null);
        }
    };

    return (
        <section className={styles.card}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <div className={styles.icon}>
                        <FileText size={19} />
                    </div>

                    <div>
                        <h3>Quản lý CV</h3>
                        <p>Danh sách hồ sơ đã tải lên</p>
                    </div>
                </div>

                <span className={styles.count}>
                    {cvFiles.length}/3 CV
                </span>
            </div>

            <div className={styles.toolbar}>
                <span>
                    <FolderOpen size={15} />
                    Kho lưu trữ
                </span>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={cvFiles.length >= 3}
                >
                    <Plus size={15} />
                    Thêm CV
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    hidden
                    onChange={handleUpload}
                />
            </div>

            <div className={styles.cvList}>
                {cvFiles.length > 0 ? (
                    cvFiles.map((file) => (
                        <div
                            key={file.id}
                            className={`${styles.cvItem} ${
                                selectedCV === file.id ? styles.active : ""
                            }`}
                        >
                            <div className={styles.fileIcon}>
                                <FileText size={20} />
                            </div>

                            <div className={styles.fileInfo}>
                                <h4>{file.name}</h4>
                                <p>
                                    {file.size} • {file.uploadedAt}
                                </p>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    type="button"
                                    title="Chọn CV"
                                    onClick={() => setSelectedCV(file.id)}
                                >
                                    <Eye size={17} />
                                </button>

                                <button
                                    type="button"
                                    title="Xóa CV"
                                    onClick={() => handleDelete(file.id)}
                                >
                                    <Trash2 size={17} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>
                        <FileText size={30} />
                        <p>Chưa có CV nào được tải lên.</p>
                    </div>
                )}
            </div>

            <div className={styles.footer}>
                <span>
                    {selectedCV ? "Đã chọn CV" : "Chưa chọn CV"}
                </span>

                <span>PDF, DOC, DOCX</span>
            </div>
        </section>
    );
}

export default CVStorage;
