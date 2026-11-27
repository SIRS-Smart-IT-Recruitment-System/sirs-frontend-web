import { useState } from "react";

import FileUpload from "../../../../components/common/file-upload/FileUpload";
import styles from "./ImageGallery.module.css";

function ImageGallery() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <h2>Thư viện hình ảnh</h2>
            </div>

            <div className={styles.picker}>
                <FileUpload
                    label="Chọn hình ảnh"
                    extensions={[".jpg", ".jpeg", ".png", ".webp"]}
                    onSelect={setSelectedFile}
                />
                {selectedFile && (
                    <p role="status">{selectedFile.name} · Chưa tải lên</p>
                )}
            </div>
            <p className={styles.note}>
                Hình ảnh chỉ dùng để xem trước trong phiên này.
            </p>
        </section>
    );
}

export default ImageGallery;
