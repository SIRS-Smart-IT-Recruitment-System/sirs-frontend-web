import styles from "./LoginForm.module.css";
import SocialLogin from "../SocialLogin/SocialLogin";
import Button from "../../ui/button/Button";
import Input from "../../ui/input/Input";

interface LoginFormProps {
    onRegister: () => void;
    onForgotPassword: () => void;
}

const LoginForm = ({
                       onRegister,
                       onForgotPassword
                   }: LoginFormProps) => {

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
                    <Input
                        type="text"
                        label="Email"
                        placeholder="Nhập email của bạn"
                    />
                </div>

                <div className={styles.formGroup}>
                    <Input
                        type="password"
                        label="Mật khẩu"
                        placeholder="Nhập mật khẩu"
                    />
                </div>

                <div className={styles.forgotPassword}>
                    <label className={styles.rememberPassword}>
                        <input type="checkbox" />
                        <span>Nhớ mật khẩu</span>
                    </label>

                    <button
                        type="button"
                        className={styles.forgotPasswordBtn}
                        onClick={onForgotPassword}>
                        Quên mật khẩu?
                    </button>
                </div>

                <Button type="button" variant="primary" className={styles.loginButton}>
                    Đăng nhập
                </Button>

            </form>

            <div className={styles.registerLink}>
                Chưa có tài khoản?

                <button
                    type="button"
                    className={styles.registerLinkBtn}
                    onClick={onRegister}>
                    Đăng ký ngay
                </button>
            </div>

            <SocialLogin />

        </div>
    );
};

export default LoginForm;
