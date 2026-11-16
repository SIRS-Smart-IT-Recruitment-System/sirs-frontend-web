import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../layouts/Auth-layout/AuthLayout";
import LoginForm from "../../components/auth/LoginForm/LoginForm";
import RegisterForm from "../../components/auth/Register/RegisterForm/RegisterForm";
import RoleSelect from "../../components/auth/Register/RoleSelect/RoleSelect";
import CandidateForm from "../../components/auth/Register/CandidateForm/CandidateForm";
import CompanyForm from "../../components/auth/Register/CompanyForm/CompanyForm";
import ForgotPasswordModal from "../../components/auth/ForgotPasswordModal/ForgotPasswordModal";
import ResetPasswordModal from "../../components/auth/ResetPasswordModal/ResetPasswordModal";
import { register } from "../../services/authService";
import { createCandidateProfile } from "../../services/candidateProfileService";
import { createCompanyProfile } from "../../services/companyProfileService";

import type {
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

    const [currentPage, setCurrentPage] = useState<Page>("login");
    const [activeModal, setActiveModal] = useState<ModalType>(null);

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
    const handleLoginSuccess = (loginResult: any) => {
        const userRole = (loginResult?.role || localStorage.getItem("role") || "").toUpperCase();

        if (userRole === ROLE.RECRUITER) {
            navigate(ROUTES.RECRUITER.PROFILE);
        } else {
            navigate(ROUTES.CANDIDATE.PROFILE);
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

            console.log(
                "Register account successful:",
                registerResult
            );

            // Lưu token và thông tin đăng nhập tự động để bước sau gọi API tạo hồ sơ
            if (registerResult?.accessToken) {
                localStorage.setItem("accessToken", registerResult.accessToken);
            }
            if (registerResult?.role) {
                localStorage.setItem("role", registerResult.role);
            }

            // Bước 2: Tạo hồ sơ Candidate
            const profileResult = await createCandidateProfile(
                candidateData
            );

            console.log(
                "Create candidate profile successful:",
                profileResult
            );

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

            console.log(
                "Register recruiter account successful:",
                registerResult
            );

            // Lưu token đăng nhập vào localStorage
            if (registerResult?.accessToken) {
                localStorage.setItem("accessToken", registerResult.accessToken);
            }
            if (registerResult?.role) {
                localStorage.setItem("role", registerResult.role);
            }

            // Bước 2: Tạo hồ sơ Company
            const profileResult = await createCompanyProfile(companyData);

            console.log(
                "Create company profile successful:",
                profileResult
            );

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

            {/* Đăng nhập */}
            {currentPage === "login" && (
                <LoginForm
                    onRegister={() => setCurrentPage("register")}
                    onForgotPassword={() => setActiveModal("forgot")}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}

            {/* Đăng ký tài khoản */}
            {currentPage === "register" && (
                <RegisterForm
                    onLogin={() => setCurrentPage("login")}
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
                            role: ROLE.RECRUITER,
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
