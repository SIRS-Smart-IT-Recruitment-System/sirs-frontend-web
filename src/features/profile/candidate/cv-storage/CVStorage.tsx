import { ExternalLink, FileText, Pencil } from "lucide-react";

import Button from "../../../../components/common/button/Button";
import styles from "./CVStorage.module.css";

interface CVStorageProps {
    cvUrl?: string;
    onEdit: () => void;
}

function CVStorage({ cvUrl, onEdit }: CVStorageProps) {
    const url = cvUrl?.trim();
    const canOpen = url && /^https?:\/\//i.test(url);

    return (
        <section id="cv" className={styles.card}>
            <h2><FileText size={20} /> CV của tôi</h2>
            {canOpen ? (
                <a href={url} target="_blank" rel="noopener noreferrer">
                    Mở CV trong hồ sơ <ExternalLink size={15} />
                </a>
            ) : (
                <p>Chưa có liên kết CV hợp lệ trong hồ sơ.</p>
            )}
            <Button variant="outline" onClick={onEdit}>
                <Pencil size={15} />
                {canOpen ? "Sửa liên kết CV" : "Thêm liên kết CV"}
            </Button>
        </section>
    );
}

export default CVStorage;
