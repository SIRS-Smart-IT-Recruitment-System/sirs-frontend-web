
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Pencil } from "lucide-react";
import { ROUTES } from "../../../routers/routePaths";

import MainLayout from "../../../layouts/templates/main-layout/MainLayout";

import Button from "../../../components/common/button/Button";
import Badge from "../../../components/common/badge/Badge";
import Input from "../../../components/common/input/Input";
import Textarea from "../../../components/common/textarea/Textarea";
import Select from "../../../components/common/select/Select";
import Modal from "../../../components/common/modal/Modal";
import Avatar from "../../../components/common/avatar/Avatar";
import Spinner from "../../../components/common/spinner/Spinner";

import ProfileStatistics from "../../../features/profile/candidate/profile-statistics/ProfileStatistics.tsx";
import CandidateSkills from "../../../features/profile/candidate/candidate-skills/CandidateSkills.tsx";
import CandidatePortfolio from "../../../features/profile/candidate/candidate-portfolio/CandidatePortfolio.tsx";
import CVStorage from "../../../features/profile/candidate/cv-storage/CVStorage.tsx";

import {
    getCandidateProfile,
    updateCandidateProfile,
} from "../../../services/candidateProfileService.ts";

import type {
    CandidateProfileRequest,
    CandidateProfileResponse,
    CandidateJobStatus,
} from "../../../types/authTypes";

import styles from "./CandidateProfile.module.css";

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

function getStatusBadge(status: CandidateJobStatus) {
    const map: Record<
        CandidateJobStatus,
        {
            label: string;
            variant:
                | "success"
                | "warning"
                | "info"
                | "danger"
                | "default";
        }
    > = {
        OPEN_FOR_WORK: {
            label: "Đang tìm việc",
            variant: "success",
        },
        READY_FOR_OPPORTUNITY: {
            label: "Sẵn sàng nhận cơ hội",
            variant: "info",
        },
        NOT_LOOKING: {
            label: "Không tìm việc",
            variant: "default",
        },
    };

    return map[status] ?? {
        label: status,
        variant: "default",
    };
}

function CandidateProfile() {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!token) {
            navigate(ROUTES.LOGIN, { replace: true });
        }
    }, [navigate, token]);

    const [profile, setProfile] =
        useState<CandidateProfileResponse | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] =
        useState<CandidateProfileRequest>({
            name: "",
            phoneNumber: "",
            bio: "",
            cvUrl: "",
            avatarUrl: "",
            jobStatus: "OPEN_FOR_WORK",
        });

    const [formError, setFormError] = useState<
        Partial<Record<keyof CandidateProfileRequest, string>>
    >({});

    // Lấy hồ sơ ứng viên
    useEffect(() => {
        if (!token) return;

        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                setError("");

                const data = await getCandidateProfile();

                setProfile(data);
            } catch (err) {
                console.error("Lỗi tải hồ sơ ứng viên:", err);

                setError(
                    "Không thể tải hồ sơ ứng viên. Vui lòng thử lại sau."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Mở modal chỉnh sửa
    const handleOpenEdit = () => {
        if (!profile) return;

        setFormData({
            name: profile.name ?? "",
            phoneNumber: profile.phoneNumber ?? "",
            bio: profile.bio ?? "",
            cvUrl: profile.cvUrl ?? "",
            avatarUrl: profile.avatarUrl ?? "",
            jobStatus: profile.jobStatus ?? "OPEN_FOR_WORK",
        });

        setFormError({});
        setError("");
        setSuccess("");

        setIsEditing(true);
    };

    // Xử lý thay đổi input
    const handleInputChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setFormError((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // Validate dữ liệu
    const validate = (): boolean => {
        const errors: Partial<
            Record<keyof CandidateProfileRequest, string>
        > = {};

        if (!formData.name.trim()) {
            errors.name = "Vui lòng nhập họ tên.";
        }

        const phone = formData.phoneNumber.trim();

        if (!phone) {
            errors.phoneNumber = "Vui lòng nhập số điện thoại.";
        } else if (!/^(0|\+84)[0-9]{9,10}$/.test(phone)) {
            errors.phoneNumber = "Số điện thoại không hợp lệ.";
        }

        if (!formData.jobStatus) {
            errors.jobStatus =
                "Vui lòng chọn trạng thái việc làm.";
        }

        setFormError(errors);

        return Object.keys(errors).length === 0;
    };

    // Lưu hồ sơ
    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setIsSaving(true);
            setError("");

            const trimmedData: CandidateProfileRequest = {
                name: formData.name.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                bio: formData.bio.trim(),
                cvUrl: formData.cvUrl?.trim() ?? "",
                avatarUrl: formData.avatarUrl?.trim() ?? "",
                jobStatus: formData.jobStatus,
            };

            console.log(
                "Candidate profile payload:",
                trimmedData
            );

            const updated =
                await updateCandidateProfile(trimmedData);

            setProfile(updated);
            setIsEditing(false);

            setSuccess("Cập nhật hồ sơ thành công!");

            setTimeout(() => {
                setSuccess("");
            }, 4000);
        } catch (err) {
            console.error("Lỗi cập nhật hồ sơ:", err);

            setError(
                "Cập nhật hồ sơ thất bại. Vui lòng thử lại."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const statusInfo = profile
        ? getStatusBadge(profile.jobStatus)
        : null;

    return (
        <MainLayout
            role="candidate"
            userName={profile?.name}
            userRole="Ứng viên"
        >
            <div className={styles.page}>
                {/* Profile Header Card */}
                <div className={styles.profileHeader}>
                    <div className={styles.profileHeaderLeft}>
                        <Avatar
                            src={profile?.avatarUrl}
                            name={profile?.name}
                            size="xl"
                        />

                        <div className={styles.profileInfo}>
                            {isLoading ? (
                                <Spinner
                                    size="sm"
                                    label="Đang tải..."
                                />
                            ) : profile ? (
                                <>
                                    <h1 className={styles.profileName}>
                                        {profile.name}
                                    </h1>

                                    <div className={styles.profileMeta}>
                                        {profile.phoneNumber && (
                                            <span
                                                className={styles.metaItem}
                                            >
                                                <Phone size={14} />
                                                {profile.phoneNumber}
                                            </span>
                                        )}

                                        {statusInfo && (
                                            <Badge
                                                variant={statusInfo.variant}
                                            >
                                                {statusInfo.label}
                                            </Badge>
                                        )}
                                    </div>

                                    {profile.bio && (
                                        <p className={styles.profileBio}>
                                            {profile.bio}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className={styles.noProfile}>
                                    Chưa có thông tin hồ sơ.
                                </p>
                            )}
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        onClick={handleOpenEdit}
                        disabled={isLoading || !profile}
                    >
                        <Pencil size={15} />
                        Chỉnh sửa hồ sơ
                    </Button>
                </div>

                {/* Thông báo */}
                {success && (
                    <div
                        className={styles.alertSuccess}
                        role="status"
                    >
                        {success}
                    </div>
                )}

                {!isLoading && error && (
                    <div
                        className={styles.alertError}
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {/* Statistics */}
                <ProfileStatistics />

                {/* Skills */}
                <CandidateSkills />

                {/* Portfolio & CV */}
                <div className={styles.documentSection}>
                    <CandidatePortfolio />
                    <CVStorage />
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditing}
                onClose={() => {
                    setIsEditing(false);
                    setError("");
                }}
                title="Chỉnh sửa hồ sơ ứng viên"
                footer={
                    <div className={styles.modalActions}>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditing(false);
                                setError("");
                            }}
                            disabled={isSaving}
                        >
                            Hủy
                        </Button>

                        <Button
                            variant="primary"
                            type="submit"
                            form="edit-candidate-form"
                            loading={isSaving}
                            disabled={isSaving}
                        >
                            Lưu thay đổi
                        </Button>
                    </div>
                }
            >
                {error && (
                    <div
                        className={styles.alertError}
                        role="alert"
                        style={{ marginBottom: 16 }}
                    >
                        {error}
                    </div>
                )}

                <form
                    id="edit-candidate-form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className={styles.formGrid}>
                        <Input
                            label="Họ và tên *"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Nguyễn Văn A"
                            error={formError.name}
                        />

                        <Input
                            label="Số điện thoại *"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="0901234567"
                            error={formError.phoneNumber}
                        />

                        <div className={styles.fullWidth}>
                            <Textarea
                                label="Giới thiệu bản thân (Bio)"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Mô tả ngắn về bản thân, kinh nghiệm và mục tiêu nghề nghiệp..."
                                rows={4}
                                hint="Tối đa 500 ký tự"
                                maxLength={500}
                            />
                        </div>

                        <Select
                            label="Trạng thái tìm việc *"
                            name="jobStatus"
                            value={formData.jobStatus}
                            onChange={handleInputChange}
                            options={JOB_STATUS_OPTIONS}
                            error={formError.jobStatus}
                        />

                        <Input
                            label="Link CV (tùy chọn)"
                            name="cvUrl"
                            value={formData.cvUrl ?? ""}
                            onChange={handleInputChange}
                            placeholder="https://drive.google.com/..."
                        />
                    </div>
                </form>
            </Modal>
        </MainLayout>
    );
}

export default CandidateProfile;
