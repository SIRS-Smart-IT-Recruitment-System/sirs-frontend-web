import { FileText } from "lucide-react";
import { company } from "../recruiterProfileData";
import styles from "./CompanyIntroduction.module.css";

function CompanyIntroduction() {
    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.title}>
                    <FileText size={19} />
                    <h2>Giới thiệu công ty</h2>
                </div>
            </div>

            <p className={styles.description}>
                {company.introduction}
            </p>

            <div className={styles.additionalInfo}>
                <span>Thông tin về doanh nghiệp</span>
                <p>
                    Công ty luôn hướng đến việc phát triển nguồn nhân lực
                    chất lượng cao và tạo cơ hội nghề nghiệp cho ứng viên.
                </p>
            </div>
        </section>
    );
}

export default CompanyIntroduction;