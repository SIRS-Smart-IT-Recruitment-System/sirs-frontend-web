import styles from "./RegisterForm.module.css";
import SocialLogin from "../SocialLogin/SocialLogin";
import Button from "../../ui/button/Button";
import Input from "../../ui/input/Input";

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
                    <Input
                        type="text"
                        label="Họ và tên"
                        placeholder="Nhập họ và tên"
                    />
                </div>

                <div className={styles.formGroup}>
                    <Input
                        type="text"
                        label="Email"
                        placeholder="Nhập email"
                    />
                </div>

                <div className={styles.formGroup}>
                    <Input
                        type="password"
                        label="Mật khẩu"
                        placeholder="Nhập mật khẩu"
                    />
                </div>

                <div className={styles.formGroup}>
                    <Input
                        type="password"
                        label="Xác nhận mật khẩu"
                        placeholder="Nhập lại mật khẩu"
                    />
                </div>

                <Button type="button" variant="primary" className={styles.registerButton}>
                    Đăng ký
                </Button>

            </form>

            <div className={styles.loginLink}>
                Đã có tài khoản?

                <button type="button" className={styles.loginLinkBtn} onClick={onLogin}>
                    Đăng nhập
                </button>
            </div>

            <SocialLogin />

        </div>
    );
};

export default RegisterForm;
