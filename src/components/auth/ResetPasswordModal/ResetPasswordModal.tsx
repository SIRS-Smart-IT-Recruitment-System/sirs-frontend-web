import { useState } from "react";
import styles from "./ResetPasswordModal.module.css";

interface ResetPasswordModalProps {
    onClose: () => void;
    onBack: () => void;
}

const ResetPasswordModal = ({
                                onClose,
                                onBack
                            }: ResetPasswordModalProps) => {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>

                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                >
                    ×
                </button>

                <div className={styles.heading}>
                    <h2>ĐẶT LẠI MẬT KHẨU</h2>
                    <p>
                        Vui lòng nhập mật khẩu mới cho tài khoản.
                    </p>
                </div>

                <form>
                    <div className={styles.formGroup}>
                        <label>Mật khẩu mới</label>

                        <div className={styles.passwordInput}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu mới"/>

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? "Ẩn" : "Hiện"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        className={styles.submitButton}>
                        Xác nhận
                    </button>
                </form>

                <button
                    type="button"
                    className={styles.backButton}
                    onClick={onBack}>
                    Quay lại
                </button>

            </div>
        </div>
    );
};

export default ResetPasswordModal;