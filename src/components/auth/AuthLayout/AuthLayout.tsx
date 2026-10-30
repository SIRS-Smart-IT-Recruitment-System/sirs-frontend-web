import type { ReactNode } from "react";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className={styles.authContainer}>

            <div className={styles.leftPanel}>

                <div className={styles.logo}>
                    <div className={styles.logoIcon}>^.^</div>
                    <span>SIRS</span>
                </div>

                <div className={styles.intro}>
                    <h1>Welcome to SIRS</h1>
                    <p>
                        Your journey starts here.
                        Connect, explore and experience
                        something meaningful.
                    </p>
                </div>

                <div className={styles.leftFooter}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

            </div>

            <div className={styles.rightPanel}>
                <div className={styles.formContainer}>
                    {children}
                </div>
            </div>

        </div>
    );
};

export default AuthLayout;