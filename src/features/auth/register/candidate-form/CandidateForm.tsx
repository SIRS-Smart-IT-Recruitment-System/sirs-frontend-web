import { useState } from "react";
import { JOB_STATUS_OPTIONS } from "../../../../constants/candidateJobStatus";

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

const CandidateForm = ({ onSubmit }: CandidateFormProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [cvUrl, setCvUrl] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

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
                cvUrl: cvUrl.trim(),
                avatarUrl: avatarUrl.trim(),
                jobStatus: workStatus,
            };

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
                    <Input
                        type="url"
                        label="Liên kết ảnh đại diện (tùy chọn)"
                        placeholder="https://..."
                        pattern="https?://.+"
                        value={avatarUrl}
                        onChange={(event) => setAvatarUrl(event.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <Input
                        type="url"
                        label="Liên kết CV (tùy chọn)"
                        placeholder="https://..."
                        pattern="https?://.+"
                        value={cvUrl}
                        onChange={(event) => setCvUrl(event.target.value)}
                    />
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
