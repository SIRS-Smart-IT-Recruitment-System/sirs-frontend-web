import { useState } from "react";

import AuthLayout from "../../components/auth/AuthLayout/AuthLayout";
import LoginForm from "../../components/auth/LoginForm/LoginForm";
import RegisterForm from "../../components/auth/RegisterForm/RegisterForm";

import ForgotPasswordModal from "../../components/auth/ForgotPasswordModal/ForgotPasswordModal";
import ResetPasswordModal from "../../components/auth/ResetPasswordModal/ResetPasswordModal";

type ModalType = "forgot" | "reset" | null;

function AuthPage() {
    const [currentPage, setCurrentPage] = useState("login");
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    return (
        <AuthLayout>
            {currentPage === "login" && (
                <LoginForm
                    onRegister={() => setCurrentPage("register")}
                    onForgotPassword={() => setActiveModal("forgot")}
                />
            )}

            {currentPage === "register" && (
                <RegisterForm
                    onLogin={() => setCurrentPage("login")}
                />
            )}

            {activeModal === "forgot" && (
                <ForgotPasswordModal
                    onClose={() => setActiveModal(null)}
                    onContinue={() => setActiveModal("reset")}
                />
            )}

            {activeModal === "reset" && (
                <ResetPasswordModal
                    onClose={() => setActiveModal(null)}
                    onBack={() => setActiveModal("forgot")}
                />
            )}
        </AuthLayout>
    );
}

export default AuthPage;