import type { ReactNode } from "react";
import styles from "./AuthLayout.module.css";
import logoSrc from "../../assets/logo.png";
import qcSrc from "../../assets/qc.png";

interface AuthLayoutProps {
    children: ReactNode;
    onBack?: () => void;
}

const AuthLayout = ({ children, onBack }: AuthLayoutProps) => {
    return (
        <div className={styles.authContainer}>

            <div className={styles.leftPanel}>
                <div className={styles.leftContent}>
                    <h1 className={styles.leftTitle}>
                        Kết nối nhân tài – Kiến tạo tương lai
                    </h1>

                    <p className={styles.leftDesc}>
                        Tối ưu hóa quy trình tuyển dụng với nền tảng quản lý
                        thông minh, hỗ trợ doanh nghiệp tiếp cận nguồn nhân lực
                        chất lượng, theo dõi hồ sơ ứng viên và đưa ra quyết định
                        tuyển dụng hiệu quả.
                    </p>
                </div>
                <div className={styles.illustrationWrapper}>
                    <img src={qcSrc} alt="Recruitment illustration" className={styles.illustrationImg} />
                </div>
            </div>

            <div className={styles.rightPanel}>

                <div className={styles.panelHeader}>
                    {onBack && (
                        <button
                            type="button"
                            className={styles.backBtn}
                            onClick={onBack}> ←
                        </button>
                    )}
                </div>

                <div className={styles.centerArea}>
                    <div className={styles.logoWrapper}>
                        <img src={logoSrc} alt="SIRS Logo" className={styles.logoImg} />
                    </div>

                    <div className={styles.formContainer}>
                        {children}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default AuthLayout;
