import { Eye } from "lucide-react";
import styles from "./JobsPreview.module.css";

function PreviewNotice() {
    return (
        <div className={styles.previewNotice} role="note">
            <span className={styles.previewNoticeIcon}>
                <Eye size={16} />
            </span>
            <span>
                <strong>
                    Chế độ xem trước
                </strong>
                {" · Nội dung minh họa, chưa kết nối Jobs API và không được "}
                lưu lên máy chủ.
            </span>
        </div>
    );
}

export default PreviewNotice;
