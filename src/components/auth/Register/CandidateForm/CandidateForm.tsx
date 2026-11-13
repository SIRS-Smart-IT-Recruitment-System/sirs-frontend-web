import { useState } from "react";
import styles from "./CandidateForm.module.css";
import Button from "../../../ui/button/Button";
import Input from "../../../ui/input/Input";

interface CandidateFormProps {
    onBack?: () => void;
}

const CandidateForm = (_props: CandidateFormProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [workStatus, setWorkStatus] = useState("");

    const [errors, setErrors] = useState({
        fullName: "",
        phone: "",
        workStatus: "",
    });

    const handleCompleteRegister = () => {
        if (isLoading) return;

        // Bắt đầu Loading
        setIsLoading(true);

        setTimeout(() => {
            const newErrors = {
                fullName: "",
                phone: "",
                workStatus: "",
            };

            if (!fullName.trim()) {
                newErrors.fullName = "Vui lòng nhập họ và tên";
            }

            if (!phone.trim()) {
                newErrors.phone = "Vui lòng nhập số điện thoại";
            } else if (!/^0\d{9}$/.test(phone)) {
                newErrors.phone = "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0";
            }

            if (!workStatus.trim()) {
                newErrors.workStatus = "Vui lòng nhập trạng thái công việc";
            }

            setIsLoading(false);

            setErrors(newErrors);

            if (
                !newErrors.fullName &&
                !newErrors.phone &&
                !newErrors.workStatus
            ) {
                console.log("Thông tin hồ sơ cá nhân hợp lệ");
            }
        }, 2000);
    };

    return (
        <div className={styles.candidateForm}>
            <div className={styles.heading}>
                <h2>ĐĂNG KÝ HỒ SƠ CÁ NHÂN</h2>
            </div>

            <div className={styles.avatarWrapper}>
                <label className={styles.avatar}>
                    <input type="file" accept="image/*" hidden />

                    <svg
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                    >
                        <rect width="36" height="36" rx="8" fill="#EBF4FF" />
                        <path
                            d="M8 15a1.5 1.5 0 0 1 1.5-1.5h1.2l1.3-2h8l1.3 2h1.2A1.5 1.5 0 0 1 28 15v9a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 8 24V15z"
                            stroke="#2563EB"
                            strokeWidth="1.4"
                            fill="none"
                        />
                        <circle
                            cx="18"
                            cy="20"
                            r="3"
                            stroke="#2563EB"
                            strokeWidth="1.4"
                            fill="none"
                        />
                    </svg>
                </label>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className={styles.formGroup}>
                    <Input
                        type="text"
                        label="Họ và tên"
                        placeholder="Nhập họ tên đầy đủ"
                        value={fullName}
                        onChange={(e) => {
                            setFullName(e.target.value);
                            setErrors((prev) => ({
                                ...prev,
                                fullName: "",
                            }));
                        }}
                        error={errors.fullName}
                    />
                </div>

                <div className={styles.formGroup}>
                    <Input
                        type="text"
                        label="Số điện thoại"
                        placeholder="Nhập số điện thoại"
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                            setErrors((prev) => ({
                                ...prev,
                                phone: "",
                            }));
                        }}
                        error={errors.phone}
                    />
                </div>

                <div className={styles.formGroup}>
                    <Input
                        type="text"
                        label="Tiểu sử"
                        placeholder="Nhập tiểu sử của bạn"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <Input
                        type="text"
                        label="Trạng thái công việc"
                        placeholder="Đang tìm việc / Đang đi làm..."
                        value={workStatus}
                        onChange={(e) => {
                            setWorkStatus(e.target.value);
                            setErrors((prev) => ({
                                ...prev,
                                workStatus: "",
                            }));
                        }}
                        error={errors.workStatus}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.uploadLabel}>
                        Sơ yếu lý lịch
                    </label>

                    <label className={styles.uploadArea}>
                        <input type="file" accept=".pdf,.doc,.docx" hidden />

                        <div className={styles.uploadIcon}>
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                                />
                            </svg>
                        </div>

                        <span className={styles.uploadText}>Tải lên</span>

                        <span className={styles.uploadHint}>
                            PDF, DOC (MAX = 10MB)
                        </span>
                    </label>
                </div>

                <Button
                    type="button"
                    variant="primary"
                    className={styles.submitButton}
                    onClick={handleCompleteRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className={styles.spinner} />
                            Đang đăng ký...
                        </>
                    ) : (
                        "Hoàn tất đăng ký"
                    )}
                </Button>
            </form>
        </div>
    );
};

export default CandidateForm;