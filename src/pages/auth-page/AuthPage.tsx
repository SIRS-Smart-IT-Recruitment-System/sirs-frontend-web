import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../layouts/templates/auth-layout/AuthLayout";
import LoginForm from "../../features/auth/login-form/LoginForm";
import RegisterForm from "../../features/auth/register/register-form/RegisterForm";
import RoleSelect from "../../features/auth/register/role-select/RoleSelect";
import CandidateForm from "../../features/auth/register/candidate-form/CandidateForm";
import CompanyForm from "../../features/auth/register/company-form/CompanyForm";
import ForgotPasswordModal from "../../features/auth/forgot-password-modal/ForgotPasswordModal";
import ResetPasswordModal from "../../features/auth/reset-password-modal/ResetPasswordModal";
import Toast from "../../components/common/toast/Toast";
import { register, saveSession } from "../../services/authService";
import { createCandidateProfile } from "../../services/candidateProfileService";
import { createCompanyProfile } from "../../services/companyProfileService";

import type {
    AuthResponse,
    RegisterRequest,
    CandidateProfileRequest,
    CompanyProfileRequest,
} from "../../types/authTypes";

import { ROLE } from "../../constants/role";
import { ROUTES } from "../../routers/routePaths";

type Page =
    | "login"
    | "register"
    | "roleSelect"
    | "candidateForm"
    | "companyForm";

type ModalType = "forgot" | "reset" | null;

// Quản lý điều hướng quay lại
const backMap: Partial<Record<Page, Page>> = {
    roleSelect: "register",
    candidateForm: "roleSelect",
    companyForm: "roleSelect",
};

function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [currentPage, setCurrentPage] = useState<Page>(() =>
        location.pathname === ROUTES.REGISTER ? "register" : "login"
    );
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const toastMessage = location.state?.toastMessage as string | undefined;

    // Lưu thông tin đăng ký tài khoản
    const [registerData, setRegisterData] = useState<RegisterRequest>({
        email: "",
        password: "",
        role: ROLE.CANDIDATE,
    });

    // Trạng thái xử lý đăng ký
    const [isRegistering, setIsRegistering] = useState(false);

    // Xử lý nút quay lại
    const backPage = backMap[currentPage];

    const handleBack = backPage
        ? () => setCurrentPage(backPage)
        : undefined;

    // Xử lý sau khi đăng nhập thành công: chuyển hướng theo vai trò
    const handleLoginSuccess = (loginResult: AuthResponse) => {
        const userRole = loginResult.role.toUpperCase();

        if (userRole === ROLE.RECRUITER) {
            navigate(ROUTES.RECRUITER.PROFILE);
        } else {
            navigate(ROUTES.CANDIDATE.DASHBOARD);
        }
    };

    // Đăng ký tài khoản và tạo hồ sơ Candidate
    const handleRegisterCandidate = async (
        candidateData: CandidateProfileRequest
    ) => {
        if (isRegistering) return;

        try {
            setIsRegistering(true);

            // Bước 1: Đăng ký tài khoản Candidate
            const accountData: RegisterRequest = {
                ...registerData,
                email: registerData.email.trim(),
                role: ROLE.CANDIDATE,
            };

            const registerResult = await register(accountData);

            saveSession(registerResult, accountData.email);
            await createCandidateProfile(candidateData);

            // Thông báo đăng ký thành công
            alert("Đăng ký tài khoản và hồ sơ thành công!");

            // Bước 3: Chuyển đến trang Candidate Profile
            navigate(ROUTES.CANDIDATE.PROFILE);

        } catch (error) {
            console.error(
                "Candidate registration failed:",
                error
            );

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                const backendMessage =
                    error.response?.data?.message;

                if (status === 400) {
                    alert(
                        backendMessage ||
                        "Thông tin đăng ký không hợp lệ!"
                    );
                } else if (status === 401) {
                    alert(
                        backendMessage ||
                        "Bạn chưa được xác thực. Vui lòng đăng nhập lại!"
                    );
                } else if (status === 403) {
                    alert(
                        backendMessage ||
                        "Bạn không có quyền thực hiện thao tác này!"
                    );
                } else if (status === 409) {
                    alert(
                        backendMessage ||
                        "Email hoặc thông tin đã tồn tại!"
                    );
                } else if (status === 500) {
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
                        "Đăng ký thất bại. Vui lòng thử lại!"
                    );
                }
            } else {
                alert("Đã xảy ra lỗi. Vui lòng thử lại!");
            }

        } finally {
            setIsRegistering(false);
        }
    };

    // Đăng ký tài khoản và tạo hồ sơ Doanh nghiệp (Recruiter)
    const handleRegisterCompany = async (
        companyData: CompanyProfileRequest
    ) => {
        if (isRegistering) return;

        try {
            setIsRegistering(true);

            // Bước 1: Đăng ký tài khoản Recruiter
            const accountData: RegisterRequest = {
                ...registerData,
                email: registerData.email.trim(),
                role: ROLE.RECRUITER,
            };

            const registerResult = await register(accountData);

            saveSession(registerResult, accountData.email);
            await createCompanyProfile(companyData);

            // Thông báo thành công
            alert("Đăng ký tài khoản và hồ sơ doanh nghiệp thành công!");

            // Bước 3: Chuyển hướng sang trang Recruiter Profile
            navigate(ROUTES.RECRUITER.PROFILE);

        } catch (error) {
            console.error("Company registration failed:", error);

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const backendMessage = error.response?.data?.message;

                if (status === 400) {
                    alert(backendMessage || "Thông tin đăng ký không hợp lệ!");
                } else if (status === 401) {
                    alert(backendMessage || "Bạn chưa được xác thực. Vui lòng đăng nhập lại!");
                } else if (status === 403) {
                    alert(backendMessage || "Bạn không có quyền thực hiện thao tác này!");
                } else if (status === 409) {
                    alert(backendMessage || "Email hoặc mã số doanh nghiệp đã tồn tại!");
                } else if (status === 500) {
                    alert("Máy chủ đang gặp sự cố. Vui lòng thử lại sau!");
                } else if (!error.response) {
                    alert("Không thể kết nối đến API Gateway. Vui lòng kiểm tra kết nối mạng!");
                } else {
                    alert(backendMessage || "Đăng ký thất bại. Vui lòng thử lại!");
                }
            } else {
                alert("Đã xảy ra lỗi. Vui lòng thử lại!");
            }
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <AuthLayout onBack={handleBack}>
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type="success"
                    onClose={() => navigate(location.pathname, { replace: true, state: null })}
                />
            )}

            {/* Đăng nhập */}
            {currentPage === "login" && (
                <LoginForm
                    onRegister={() => navigate(ROUTES.REGISTER)}
                    onForgotPassword={() => setActiveModal("forgot")}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}

            {/* Đăng ký tài khoản */}
            {currentPage === "register" && (
                <RegisterForm
                    onLogin={() => navigate(ROUTES.LOGIN)}
                    onContinue={(email, password) => {
                        setRegisterData({
                            email,
                            password,
                            role: ROLE.CANDIDATE,
                        });

                        setCurrentPage("roleSelect");
                    }}
                />
            )}

            {/* Chọn vai trò */}
            {currentPage === "roleSelect" && (
                <RoleSelect
                    onBack={() => setCurrentPage("register")}
                    onSelectCandidate={() => {
                        setRegisterData((prev) => ({
                            ...prev,
                            role: ROLE.CANDIDATE,
                        }));

                        setCurrentPage("candidateForm");
                    }}
                    onSelectCompany={() => {
                        setRegisterData((prev) => ({
                            ...prev,
                            role: ROLE.COMPANY,
                        }));
                        setCurrentPage("companyForm");
                    }}
                />
            )}

            {/* Đăng ký hồ sơ Candidate */}
            {currentPage === "candidateForm" && (
                <CandidateForm
                    onBack={() => setCurrentPage("roleSelect")}
                    onSubmit={handleRegisterCandidate}
                />
            )}

            {/* Đăng ký hồ sơ Company */}
            {currentPage === "companyForm" && (
                <CompanyForm
                    onBack={() => setCurrentPage("roleSelect")}
                    onSubmit={handleRegisterCompany}
                    isLoading={isRegistering}
                />
            )}

            {/* Quên mật khẩu */}
            <ForgotPasswordModal
                isOpen={activeModal === "forgot"}
                onClose={() => setActiveModal(null)}
                onContinue={() => setActiveModal("reset")}
            />

            {/* Đặt lại mật khẩu */}
            <ResetPasswordModal
                isOpen={activeModal === "reset"}
                onClose={() => setActiveModal(null)}
                onBack={() => setActiveModal("forgot")}
            />

        </AuthLayout>
    );
}

export default AuthPage;
