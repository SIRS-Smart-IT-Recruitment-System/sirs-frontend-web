import { FolderOpen, Plus } from "lucide-react";
import styles from "./CandidatePortfolio.module.css";

function CandidatePortfolio() {
    return (
        <section className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h3>Portfolio của tôi</h3>
                    <p>Giới thiệu dự án và sản phẩm cá nhân</p>
                </div>

                <div className={styles.icon}>
                    <FolderOpen size={19} />
                </div>
            </div>

            <div className={styles.preview}>
                <FolderOpen size={48} strokeWidth={1.4} />

                <h4>Chưa có Portfolio</h4>

                <p>
                    Thêm liên kết Portfolio để nhà tuyển dụng
                    có thể xem các dự án của bạn.
                </p>
            </div>

            <button type="button" className={styles.addButton}>
                <Plus size={16} />
                Thêm Portfolio
            </button>
        </section>
    );
}

export default CandidatePortfolio;
