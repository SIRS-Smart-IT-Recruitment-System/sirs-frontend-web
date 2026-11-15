import Modal from "../../common/modal/Modal";
import Button from "../../common/button/Button";
import Input from "../../common/input/Input";
import styles from "./ResetPasswordModal.module.css";

interface ResetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
}

const ResetPasswordModal = ({
                                isOpen,
                                onClose,
                                onBack
                            }: ResetPasswordModalProps) => {

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="ĐẶT LẠI MẬT KHẨU"
            footer={
                <>
                    <button type="button" className={styles.backButton} onClick={onBack}>
                        Quay lại
                    </button>

                    <Button type="button" variant="primary">
                        Xác nhận
                    </Button>
                </>
            }
        >
            <p className={styles.subtitle}>
                Vui lòng nhập mật khẩu mới cho tài khoản.
            </p>

            <div className={styles.formGroup}>
                <Input
                    type="password"
                    label="Mật khẩu mới"
                    placeholder="Nhập mật khẩu mới"
                />
            </div>
        </Modal>
    );
};

export default ResetPasswordModal;
