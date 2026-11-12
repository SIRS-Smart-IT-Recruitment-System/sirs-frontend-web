import { useState } from "react";

import AuthLayout from "../../components/auth/AuthLayout/AuthLayout";
import LoginForm from "../../components/auth/LoginForm/LoginForm";
import RegisterForm from "../../components/auth/Register/RegisterForm/RegisterForm";
import RoleSelect from "../../components/auth/Register/RoleSelect/RoleSelect";
import CandidateForm from "../../components/auth/Register/CandidateForm/CandidateForm";
import CompanyForm from "../../components/auth/Register/CompanyForm/CompanyForm";
import ForgotPasswordModal from "../../components/auth/ForgotPasswordModal/ForgotPasswordModal";
import ResetPasswordModal from "../../components/auth/ResetPasswordModal/ResetPasswordModal";

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

    const backPage = backMap[currentPage];
    const handleBack = backPage ? () => setCurrentPage(backPage) : undefined;

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
                    onContinue={() => setCurrentPage("roleSelect")}
                />
            )}

            {currentPage === "roleSelect" && (
                <RoleSelect
                    onBack={() => setCurrentPage("register")}
                    onSelectCandidate={() => setCurrentPage("candidateForm")}
                    onSelectCompany={() => setCurrentPage("companyForm")}
                />
            )}

            {currentPage === "candidateForm" && (
                <CandidateForm
                    onBack={() => setCurrentPage("roleSelect")}
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
