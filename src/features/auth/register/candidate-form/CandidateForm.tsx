import { useState } from "react";

import styles from "./CandidateForm.module.css";

import Button from "../../../../components/common/button/Button.tsx";
import Input from "../../../../components/common/input/Input.tsx";
import { Select } from "../../../../components/common";

import type {
    CandidateProfileRequest,
    CandidateJobStatus,
} from "../../../../types/authTypes";

interface CandidateFormProps {
    onBack?: () => void;
    onSubmit: (data: CandidateProfileRequest) => Promise<void>;
}

const JOB_STATUS_OPTIONS: {
    label: string;
    value: CandidateJobStatus;
}[] = [
        {
            label: "Đang tìm việc",
            value: "OPEN_FOR_WORK",
        },
        {
            label: "Sẵn sàng nhận cơ hội",
            value: "READY_FOR_OPPORTUNITY",
        },
        {
            label: "Không tìm việc",
            value: "NOT_LOOKING",
        },
    ];

const CandidateForm = ({ onSubmit }: CandidateFormProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");

    const [workStatus, setWorkStatus] =
        useState<CandidateJobStatus>("OPEN_FOR_WORK");

    const [errors, setErrors] = useState({
        fullName: "",
        phone: "",
        workStatus: "",
    });

    const handleCompleteRegister = async () => {
        if (isLoading) return;

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
        } else if (!/^0\d{9}$/.test(phone.trim())) {
            newErrors.phone =
                "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0";
        }

        if (!workStatus) {
            newErrors.workStatus =
                "Vui lòng chọn trạng thái công việc";
        }

        setErrors(newErrors);

        if (
            newErrors.fullName ||
            newErrors.phone ||
            newErrors.workStatus
        ) {
            return;
        }

        try {
            setIsLoading(true);

            const candidateData: CandidateProfileRequest = {
                name: fullName.trim(),
                phoneNumber: phone.trim(),
                bio: bio.trim(),
                cvUrl: "",
                avatarUrl: "",
                jobStatus: workStatus,
            };

            console.log(
                "Candidate registration payload:",
                candidateData
            );

            await onSubmit(candidateData);
        } catch (error) {
            console.error(
                "Lỗi hoàn tất đăng ký ứng viên:",
                error
            );
        } finally {
            setIsLoading(false);
        }
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
                        <rect
                            width="36"
                            height="36"
                            rx="8"
                            fill="#EBF4FF"
                        />

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

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleCompleteRegister();
                }}
            >
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
                    <Select
                        label="Trạng thái công việc"
                        name="jobStatus"
                        value={workStatus}
                        onChange={(e) => {
                            setWorkStatus(
                                e.target.value as CandidateJobStatus
                            );

                            setErrors((prev) => ({
                                ...prev,
                                workStatus: "",
                            }));
                        }}
                        options={JOB_STATUS_OPTIONS}
                        error={errors.workStatus}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.uploadLabel}>
                        Sơ yếu lý lịch
                    </label>

                    <label className={styles.uploadArea}>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            hidden
                        />

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

                        <span className={styles.uploadText}>
                            Tải lên
                        </span>

                        <span className={styles.uploadHint}>
                            PDF, DOC (MAX = 10MB)
                        </span>
                    </label>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    className={styles.submitButton}
                    disabled={isLoading}
                >
                    {isLoading
                        ? "Đang đăng ký..."
                        : "Hoàn tất đăng ký"}
                </Button>
            </form>
        </div>
    );
};

export default CandidateForm;