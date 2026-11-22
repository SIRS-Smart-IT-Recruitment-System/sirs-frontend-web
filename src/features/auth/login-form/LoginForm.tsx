import styles from "./LoginForm.module.css";
import SocialLogin from "../social-login/SocialLogin.tsx";
import Button from "../../../components/common/button/Button.tsx";
import Input from "../../../components/common/input/Input.tsx";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { login } from "../../../services/authService.ts";
import type { LoginRequest } from "../../../types/authTypes.ts";
import { ROUTES } from "../../../routers/routePaths.ts";
import { ROLE } from "../../../constants/role.ts";

interface LoginFormProps {
    onRegister: () => void;
    onForgotPassword: () => void;
    onLoginSuccess?: (response: unknown) => void;
}

const LoginForm = ({
                       onRegister,
                       onForgotPassword,
                       onLoginSuccess,
                   }: LoginFormProps) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);

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

            const loginData: LoginRequest = {
                email: email.trim(),
                password: password,
            };

            // Gọi API đăng nhập
            const result = await login(loginData);

            console.log("Login successful:", result);

            // Lưu token đăng nhập vào localStorage
            if (result?.accessToken) {
                localStorage.setItem("accessToken", result.accessToken);
            }
            if (result?.role) {
                localStorage.setItem("role", result.role);
            }

            // Chuyển kết quả đăng nhập về auth-page hoặc tự chuyển hướng
            if (onLoginSuccess) {
                onLoginSuccess(result);
            } else {
                const userRole = (result?.role || "").toUpperCase();
                if (userRole === ROLE.RECRUITER) {
                    navigate(ROUTES.RECRUITER.PROFILE);
                } else {
                    navigate(ROUTES.CANDIDATE.PROFILE);
                }
            }

        } catch (error) {
            console.error("Login failed:", error);

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const backendMessage =
                    error.response?.data?.message;

                if (status === 400) {
                    alert(
                        backendMessage ||
                        "Thông tin đăng nhập không hợp lệ!"
                    );
                } else if (status === 401) {
                    alert(
                        backendMessage ||
                        "Email hoặc mật khẩu không chính xác!"
                    );
                } else if (status === 403) {
                    alert(
                        backendMessage ||
                        "Bạn không có quyền đăng nhập!"
                    );
                } else if (status === 404) {
                    alert(
                        backendMessage ||
                        "Không tìm thấy tài khoản!"
                    );
                } else if (status !== undefined && status >= 500) {
                    alert(
                        "Máy chủ đang gặp sự cố. Vui lòng thử lại sau!"
                    );
                } else if (!error.response) {
                    alert(
                        "Không thể kết nối đến API Gateway. Vui lòng kiểm tra kết nối mạng!"
                    );
                } else {
                    alert(
                        backendMessage ||
                        "Đăng nhập thất bại. Vui lòng thử lại!"
                    );
                }
            } else {
                alert("Đã xảy ra lỗi. Vui lòng thử lại!");
            }

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginForm}>

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
                        type="text"
                        label="Email"
                        placeholder="Nhập email của bạn"
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

                <Button
                    type="submit"
                    variant="primary"
                    className={styles.submitButton}
                    disabled={isLoading}
                >
                    {isLoading ? (
                            <>
                            Đang đăng nhập...
                        </>
                    ) : (
                        "Đăng nhập"
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
