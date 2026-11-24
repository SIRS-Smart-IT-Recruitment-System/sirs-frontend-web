import { FileCheck, FileText, Download, Upload } from "lucide-react";
import styles from "./BusinessLicense.module.css";

function BusinessLicense() {
    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <h2>Giấy phép kinh doanh</h2>

                <span className={styles.verified}>
                    <FileCheck size={14} />
                    Đã xác thực
                </span>
            </div>

            <div className={styles.document}>
                <div className={styles.documentIcon}>
                    <FileText size={28} />
                </div>

                <div className={styles.documentInfo}>
                    <h3>Giấy phép kinh doanh.pdf</h3>
                    <span>PDF • 2.4 MB</span>
                </div>

                <button
                    type="button"
                    className={styles.downloadButton}
                    aria-label="Tải giấy phép kinh doanh"
                    title="Tải xuống"
                >
                    <Download size={18} />
                </button>
            </div>

            <button type="button" className={styles.uploadButton}>
                <Upload size={17} />
                Tải lên giấy phép mới
            </button>

            <p className={styles.note}>
                Tài liệu được sử dụng để xác minh thông tin doanh nghiệp.
            </p>
        </section>
    );
}

export default BusinessLicense;
