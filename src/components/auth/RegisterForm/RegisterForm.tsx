
import styles from "./RegisterForm.module.css";
import SocialLogin from "../SocialLogin/SocialLogin";

interface RegisterFormProps {
    onLogin: () => void;
}

const RegisterForm = ({ onLogin }: RegisterFormProps) => {
    return (
        <div className={styles.registerForm}>

            <div className={styles.heading}>
                <h2>ĐĂNG KÝ</h2>
                <p>Tạo tài khoản để bắt đầu trải nghiệm SIRS.</p>
            </div>

            <form>

                <div className={styles.formGroup}>
                    <label>Họ và tên</label>
                    <input
                        type="text"
                        placeholder="Nhập họ và tên"/>
                </div>

                <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Nhập email"/>
                </div>

                <div className={styles.formGroup}>
                    <label>Mật khẩu</label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu"/>
                </div>

                <div className={styles.formGroup}>
                    <label>Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        placeholder="Nhập lại mật khẩu"/>
                </div>

                <button
                    type="button"
                    className={styles.registerButton}>
                    Đăng ký
                </button>

            </form>

            <div className={styles.loginLink}>
                Đã có tài khoản?

                <button type="button" onClick={onLogin}>
                    Đăng nhập
                </button>
            </div>

            <SocialLogin />

        </div>
    );
};

export default RegisterForm;
