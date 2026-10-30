import { useState } from "react";
import styles from "./LoginForm.module.css";
import SocialLogin from "../SocialLogin/SocialLogin";

interface LoginFormProps {
    onRegister: () => void;
    onForgotPassword: () => void;
}

const LoginForm = ({
                       onRegister,
                       onForgotPassword
                   }: LoginFormProps) => {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={styles.loginForm}>

            <div className={styles.heading}>
                <h2>ĐĂNG NHẬP</h2>
                <p>
                    Chào mừng bạn quay trở lại.
                    Vui lòng đăng nhập tài khoản.
                </p>
            </div>

            <form>

                <div className={styles.formGroup}>
                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="Nhập email của bạn"/>
                </div>

                <div className={styles.formGroup}>
                    <label>Mật khẩu</label>

                    <div className={styles.passwordInput}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu"/>

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "Ẩn" : "Hiện"}
                        </button>
                    </div>
                </div>

                <div className={styles.forgotPassword}>
                    <label className={styles.rememberPassword}>
                        <input type="checkbox" />
                        <span>Nhớ mật khẩu</span>
                    </label>

                    <button
                        type="button"
                        onClick={onForgotPassword}>
                        Quên mật khẩu?
                    </button>
                </div>

                <button
                    type="button"
                    className={styles.loginButton}>
                    Đăng nhập
                </button>

            </form>

            <div className={styles.registerLink}>
                Chưa có tài khoản?

                <button
                    type="button"
                    onClick={onRegister}>
                    Đăng ký ngay
                </button>
            </div>

            <SocialLogin />

        </div>
    );
};

export default LoginForm;