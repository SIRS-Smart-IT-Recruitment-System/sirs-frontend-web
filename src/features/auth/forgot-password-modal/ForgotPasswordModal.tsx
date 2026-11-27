import Modal from "../../../components/common/modal/Modal.tsx";
import Button from "../../../components/common/button/Button.tsx";
import Input from "../../../components/common/input/Input.tsx";
import styles from "./ForgotPasswordModal.module.css";

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
}

const ForgotPasswordModal = ({
    isOpen,
    onClose,
    onContinue
}: ForgotPasswordModalProps) => {

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="QUÊN MẬT KHẨU?"
            footer={
                <>
                    <button type="button" className={styles.backButton} onClick={onClose}>
                        Quay lại đăng nhập
                    </button>

                    <Button type="button" variant="primary" onClick={onContinue}>
                        Xem bước đặt lại
                    </Button>
                </>
            }
        >
            <p className={styles.subtitle}>
                Bạn đang xem trước biểu mẫu khôi phục. Hệ thống chưa gửi mã.
            </p>

            <div className={styles.formGroup}>
                <div className={styles.emailInput}>
                    <Input
                        type="email"
                        label="Email"
                        placeholder="Nhập email của bạn"
                    />

                    <Button
                        type="button"
                        variant="secondary"
                        className={styles.sendCodeButton}
                        disabled
                    >
                        Gửi mã
                    </Button>
                </div>
            </div>

            <div className={styles.formGroup}>
                <Input
                    type="text"
                    label="Mã xác nhận"
                    placeholder="Nhập mã xác nhận"
                    maxLength={6}
                />
            </div>
        </Modal>
    );
};

export default ForgotPasswordModal;
