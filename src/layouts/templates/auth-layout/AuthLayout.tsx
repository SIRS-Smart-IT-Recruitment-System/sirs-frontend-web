import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/common";
import AuthHero from "../../../features/auth/auth-hero/AuthHero";
import logoSrc from "../../../assets/logo.png";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
    children: ReactNode;
    onBack?: () => void;
}

const AuthLayout = ({ children, onBack }: AuthLayoutProps) => {
    return (
        <div className={styles.authContainer}>

            {/* ===== LEFT HERO PANEL ===== */}
            <section className={styles.leftPanel} aria-label="Giới thiệu SIRS">

                <AuthHero />
            </section>

            {/* ===== RIGHT FORM PANEL ===== */}
            <section className={styles.rightPanel} aria-label="Xác thực tài khoản">

                {onBack && (
                    <div className={styles.panelHeader}>
                        <Button
                            type="button"
                            variant="outline"
                            className={styles.backBtn}
                            onClick={onBack}
                        >
                            <ArrowLeft size={16} aria-hidden="true" />
                            <span>Quay lại</span>
                        </Button>
                    </div>
                )}

                <div className={styles.centerArea}>
                    {/* Brand logo */}
                    <div className={styles.logoWrapper}>
                        <img src={logoSrc} alt="SIRS Logo" className={styles.logoImg} />
                    </div>

                    {/* Page content (LoginForm / RegisterForm, etc.) */}
                    <div className={styles.formContainer}>
                        {children}
                    </div>
                </div>

            </section>

        </div>
    );
};

export default AuthLayout;
