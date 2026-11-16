import { useState } from "react";
import AuthLayout from "../../layouts/Auth-layout/AuthLayout";
import LoginForm from "../../components/auth/LoginForm/LoginForm";
import RegisterForm from "../../components/auth/Register/RegisterForm/RegisterForm";
import RoleSelect from "../../components/auth/Register/RoleSelect/RoleSelect";
import CandidateForm from "../../components/auth/Register/CandidateForm/CandidateForm";
import CompanyForm from "../../components/auth/Register/CompanyForm/CompanyForm";
import ForgotPasswordModal from "../../components/auth/ForgotPasswordModal/ForgotPasswordModal";
import ResetPasswordModal from "../../components/auth/ResetPasswordModal/ResetPasswordModal";
import { register } from "../../services/authService";
import type { RegisterRequest, CandidateProfileRequest, CandidateRegisterRequest, } from "../../types/authTypes";
import axios from "axios";
import { ROLE } from "../../constants/role";

type Page = "login" | "register" | "roleSelect" | "candidateForm" | "companyForm";
type ModalType = "forgot" | "reset" | null;

const backMap: Partial<Record<Page, Page>> = {
    roleSelect:    "register",
    candidateForm: "roleSelect",
    companyForm:   "roleSelect",
};

function AuthPage() {
    const [currentPage, setCurrentPage] = useState<Page>("login");
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const [registerData, setRegisterData] = useState<RegisterRequest>({
        email: "",
        password: "",
        role: ROLE.CANDIDATE,
    });

    const [isRegistering, setIsRegistering] = useState(false);

    const backPage = backMap[currentPage];
    const handleBack = backPage ? () => setCurrentPage(backPage) : undefined;

    const handleRegisterCandidate = async (
        candidateData: CandidateProfileRequest
    ) => {
        if (isRegistering) return;

        try {
            setIsRegistering(true);

            const requestData: CandidateRegisterRequest = {
                ...registerData,
                ...candidateData,
                role: ROLE.CANDIDATE,
            };

            const result = await register(requestData);

            console.log("Register successful:", result);

            alert("Đăng ký tài khoản thành công!");

            setCurrentPage("login");

        } catch (error) {
            console.error("Register failed:", error);

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const backendMessage = error.response?.data?.message;

                if (status === 500) {
                    alert("Máy chủ đang gặp sự cố. Vui lòng thử lại sau!");
                } else {
                    alert(
                        backendMessage ||
                        "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!"
                    );
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

            {currentPage === "login" && (
                <LoginForm
                    onRegister={() => setCurrentPage("register")}
                    onForgotPassword={() => setActiveModal("forgot")}
                />
            )}

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
                    onSelectCompany={() => {}}
                />
            )}

            {currentPage === "candidateForm" && (
                <CandidateForm
                    onBack={() => setCurrentPage("roleSelect")}
                    onSubmit={handleRegisterCandidate}
                />
            )}

            {currentPage === "companyForm" && (
                <CompanyForm
                    onBack={() => setCurrentPage("roleSelect")}
                />
            )}

            <ForgotPasswordModal
                isOpen={activeModal === "forgot"}
                onClose={() => setActiveModal(null)}
                onContinue={() => setActiveModal("reset")}
            />

            <ResetPasswordModal
                isOpen={activeModal === "reset"}
                onClose={() => setActiveModal(null)}
                onBack={() => setActiveModal("forgot")}
            />

        </AuthLayout>
    );
}

export default AuthPage;
