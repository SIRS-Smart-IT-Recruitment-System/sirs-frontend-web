
import { FileText } from "lucide-react";
import styles from "./CompanyIntroduction.module.css";

interface CompanyIntroductionProps {
    introduction?: string;
}

function CompanyIntroduction({
                                 introduction = "",
                             }: CompanyIntroductionProps) {
    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.title}>
                    <FileText size={19} />
                    <h2>Giới thiệu công ty</h2>
                </div>
            </div>

            <p className={styles.description}>
                {introduction || "Chưa cập nhật thông tin giới thiệu."}
            </p>

        </section>
    );
}

export default CompanyIntroduction;
