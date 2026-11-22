import styles from "./RegisterForm.module.css";
import {useState} from "react";
import SocialLogin from "../../social-login/SocialLogin.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import Input from "../../../../components/common/input/Input.tsx";

interface RegisterFormProps {
    onLogin: () => void;
    onContinue: (email: string, password: string) => void;
}

const RegisterForm = ({ onLogin, onContinue }: RegisterFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleContinue = () => {
        const newErrors = {
            email: "",
            password: "",
            confirmPassword: "",
        };

        if (!email.trim()) {
            newErrors.email = "Vui lòng nhập email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Email không đúng định dạng";
        }

        if (!password.trim()) {
            newErrors.password = "Vui lòng nhập mật khẩu";
        } else if (password.length < 8) {
            newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        setErrors(newErrors);

        if (
            !newErrors.email &&
            !newErrors.password &&
            !newErrors.confirmPassword
        ) {
            onContinue(email, password);
        }
    };
    return (
        <div className={styles.registerForm}>

            <div className={styles.heading}>
                <h2>ĐĂNG KÝ TÀI KHOẢN</h2>
                <p>Đăng ký tài khoản ngay hôm nay để bắt đầu trải nghiệm các tính năng của nền tảng</p>
            </div>

            <form>

                <div className={styles.formGroup}>
                    <Input
                        type="text"
                        label="Email"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        error={errors.email}
                    />
                </div>

                <div className={styles.formGroup}>
                    <Input
                        type="password"
                        label="Mật khẩu"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors((prev) => ({ ...prev, password: "" }));
                        }}
                        error={errors.password}
                    />
                </div>

                <div className={styles.formGroup}>
                    <Input
                        type="password"
                        label="Xác nhận mật khẩu"
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setErrors((prev) => ({
                                ...prev,
                                confirmPassword: "",
                            }));
                        }}
                        error={errors.confirmPassword}
                    />
                </div>

                <Button
                    type="button"
                    variant="primary"
                    className={styles.submitButton}
                    onClick={handleContinue}
                >
                    Tiếp tục
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
