import { useState } from "react";
import axios from "axios";
import { Mail, Lock, ArrowRight } from "lucide-react";

import { Button, Input, Checkbox, Toast } from "../../../components/common";
import SocialLogin from "../social-login/SocialLogin.tsx";
import { login, saveSession } from "../../../services/authService.ts";
import type { AuthResponse, LoginRequest } from "../../../types/authTypes.ts";
import styles from "./LoginForm.module.css";

interface LoginFormProps {
    onRegister: () => void;
    onForgotPassword: () => void;
    onLoginSuccess: (response: AuthResponse) => void;
}

const LoginForm = ({
    onRegister,
    onForgotPassword,
    onLoginSuccess,
}: LoginFormProps) => {
    const savedEmail = localStorage.getItem("rememberedEmail") || "";
    const [email, setEmail] = useState(savedEmail);
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(Boolean(savedEmail));

    const [isLoading, setIsLoading] = useState(false);
    const [toastError, setToastError] = useState<string | null>(null);

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    // Xử lý đăng nhập
    const handleContinue = async () => {
        if (isLoading) return;

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
        }

        setErrors(newErrors);

        // Nếu có lỗi thì không gọi API
        if (newErrors.email || newErrors.password) {
            return;
        }

        try {
            setIsLoading(true);
            setToastError(null);

            const loginData: LoginRequest = {
                email: email.trim(),
                password: password,
            };

            // Gọi API đăng nhập
            const result = await login(loginData);

            saveSession(result, loginData.email);

            // Lưu hoặc xoá email ghi nhớ
            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email.trim());
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            onLoginSuccess(result);
        } catch (error) {
            console.error("Login failed:", error);

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const backendMessage =
                    error.response?.data?.message;

                if (status === 400) {
                    setToastError(
                        backendMessage ||
                        "Thông tin đăng nhập không hợp lệ!"
                    );
                } else if (status === 401) {
                    setToastError(
                        backendMessage ||
                        "Email hoặc mật khẩu không chính xác!"
                    );
                } else if (status === 403) {
                    setToastError(
                        backendMessage ||
                        "Bạn không có quyền đăng nhập!"
                    );
                } else if (status === 404) {
                    setToastError(
                        backendMessage ||
                        "Không tìm thấy tài khoản!"
                    );
                } else if (status !== undefined && status >= 500) {
                    setToastError(
                        "Máy chủ đang gặp sự cố. Vui lòng thử lại sau!"
                    );
                } else if (!error.response) {
                    setToastError(
                        "Không thể kết nối đến API Gateway. Vui lòng kiểm tra kết nối mạng!"
                    );
                } else {
                    setToastError(
                        backendMessage ||
                        "Đăng nhập thất bại. Vui lòng thử lại!"
                    );
                }
            } else {
                setToastError("Đã xảy ra lỗi. Vui lòng thử lại!");
            }

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginForm}>
            {toastError && (
                <Toast
                    message={toastError}
                    type="error"
                    onClose={() => setToastError(null)}
                />
            )}

            <div className={styles.heading}>
                <h2>ĐĂNG NHẬP</h2>
                <p>
                    Đăng nhập vào tài khoản để tiếp tục sử dụng
                    các tính năng và khám phá những cơ hội mới
                </p>
            </div>

            <form onSubmit={(e) => {
                e.preventDefault();
                handleContinue();
            }}>

                <div className={styles.formGroup}>
                    <Input
                        type="email"
                        label="Email"
                        placeholder="Nhập email của bạn"
                        autoComplete="email"
                        leftIcon={<Mail size={18} />}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors((prev) => ({
                                ...prev,
                                email: "",
                            }));
                        }}
                        error={errors.email}
                    />
                </div>

                <div className={styles.formGroup}>
                    <Input
                        type="password"
                        label="Mật khẩu"
                        placeholder="Nhập mật khẩu"
                        autoComplete="current-password"
                        leftIcon={<Lock size={18} />}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors((prev) => ({
                                ...prev,
                                password: "",
                            }));
                        }}
                        error={errors.password}
                    />
                </div>

                <div className={styles.forgotPassword}>
                    <Checkbox
                        id="remember-me"
                        label="Ghi nhớ email"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className={styles.rememberCheckbox}
                    />

                    <button
                        type="button"
                        className={styles.forgotPasswordBtn}
                        onClick={onForgotPassword}
                    >
                        Quên mật khẩu?
                    </button>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                    className={styles.submitButton}
                >
                    {isLoading ? (
                        "Đang đăng nhập..."
                    ) : (
                        <>
                            <span>Đăng nhập</span>
                            <ArrowRight size={17} aria-hidden="true" />
                        </>
                    )}
                </Button>

            </form>

            <div className={styles.registerLink}>
                Chưa có tài khoản?

                <button
                    type="button"
                    className={styles.registerLinkBtn}
                    onClick={onRegister}
                >
                    Đăng ký ngay
                </button>
            </div>

            <SocialLogin />

        </div>
    );
};

export default LoginForm;
