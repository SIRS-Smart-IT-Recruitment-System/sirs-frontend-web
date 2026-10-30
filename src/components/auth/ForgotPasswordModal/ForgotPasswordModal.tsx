
import styles from "./ForgotPasswordModal.module.css";

interface ForgotPasswordModalProps {
    onClose: () => void;
    onContinue: () => void;
}

const ForgotPasswordModal = ({
                                 onClose,
                                 onContinue
                             }: ForgotPasswordModalProps) => {

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>

                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}>
                    ×
                </button>

                <div className={styles.heading}>
                    <h2>QUÊN MẬT KHẨU?</h2>
                    <p>
                        Nhập email để nhận mã xác nhận đặt lại mật khẩu.
                    </p>
                </div>

                <form>
                    <div className={styles.formGroup}>
                        <label>Email</label>

                        <div className={styles.emailInput}>
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"/>

                            <button
                                type="button"
                                className={styles.sendCodeButton}>
                                Gửi mã
                            </button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Mã xác nhận</label>

                        <input
                            type="text"
                            placeholder="Nhập mã xác nhận"
                            maxLength={6}/>
                    </div>

                    <button
                        type="button"
                        className={styles.submitButton}
                        onClick={onContinue}>
                        Xác nhận mã
                    </button>
                </form>

                <button
                    type="button"
                    className={styles.backButton}
                    onClick={onClose}>
                    Quay lại đăng nhập
                </button>

            </div>
        </div>
    );
};

export default ForgotPasswordModal;
