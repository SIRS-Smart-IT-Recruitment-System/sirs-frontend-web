import styles from "./LoginForm.module.css";
import SocialLogin from "../SocialLogin/SocialLogin";
import Button from "../../common/button/Button";
import Input from "../../common/input/Input";
import {useState} from "react";

interface LoginFormProps {
    onRegister: () => void;
    onForgotPassword: () => void;
}

const LoginForm = ({ onRegister, onForgotPassword }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const handleContinue = () => {
        if (isLoading) return;

        // Bắt đầu Loading
        setIsLoading(true);

        setTimeout(() => {
            const newErrors = {
                email: "",
                password: "",
            };

            // Kiểm tra Email
            if (!email.trim()) {
                newErrors.email = "Vui lòng nhập email";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                newErrors.email = "Email không đúng định dạng";
            }

            // Kiểm tra mật khẩu
            if (!password.trim()) {
                newErrors.password = "Vui lòng nhập mật khẩu";
            } else if (password.length < 8) {
                newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
            }

            // Kết thúc Loading
            setIsLoading(false);

            // Hiển thị lỗi sau khi Loading kết thúc
            setErrors(newErrors);

        }, 2000);
    };

    return (
        <div className={styles.loginForm}>

            <div className={styles.heading}>
                <h2>ĐĂNG NHẬP</h2>
                <p>Đăng nhập vào tài khoản để tiếp tục sử dụng các tính năng và khám phá những cơ hội mới</p>
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

                <div className={styles.forgotPassword}>
                    <label className={styles.rememberPassword}>
                        <input type="checkbox" />
                        <span>Ghi nhớ mật khẩu</span>
                    </label>

                    <button
                        type="button"
                        className={styles.forgotPasswordBtn}
                        onClick={onForgotPassword}
                    >
                        Quên mật khẩu?
                    </button>
                </div>

                <Button type="button"
                        variant="primary"
                        className={styles.submitButton}
                        onClick={handleContinue}
                        disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className={styles.spinner} />
                            Đang đăng nhập...
                        </>
                    ) : (
                        "Đăng nhập"
                    )}
                </Button>

            </form>

            <div className={styles.registerLink}>
                Chưa có tài khoản?
                <button type="button" className={styles.registerLinkBtn} onClick={onRegister}>
                    Đăng ký ngay
                </button>
            </div>

            <SocialLogin />

        </div>
    );
};

export default LoginForm;
