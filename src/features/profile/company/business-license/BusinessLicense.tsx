import { useState } from "react";
import { FileText } from "lucide-react";

import FileUpload from "../../../../components/common/file-upload/FileUpload";
import styles from "./BusinessLicense.module.css";

function BusinessLicense() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <h2>Giấy phép kinh doanh</h2>
            </div>

            <div className={styles.document}>
                <div className={styles.documentIcon}>
                    <FileText size={24} aria-hidden="true" />
                </div>
                <div className={styles.documentInfo}>
                    <h3>
                        {selectedFile ? selectedFile.name : "Chưa có tài liệu"}
                    </h3>
                    {selectedFile && <span role="status">Chưa tải lên</span>}
                </div>
            </div>

            <FileUpload
                label="Chọn giấy phép"
                extensions={[".pdf"]}
                onSelect={setSelectedFile}
            />
            <p className={styles.note}>
                Bạn có thể chọn tệp PDF để xem trước. Hồ sơ công ty hiện chưa
                hỗ trợ lưu tài liệu này.
            </p>
        </section>
    );
}

export default BusinessLicense;
