import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { isAxiosError } from "axios";

import {
    Button,
    Input,
    Modal,
    Select,
    Textarea,
} from "../../../../components/common";
import { JOB_STATUS_OPTIONS } from "../../../../constants/candidateJobStatus";
import {
    createCandidateProfile,
    updateCandidateProfile,
} from "../../../../services/candidateProfileService";
import type {
    CandidateJobStatus,
    CandidateProfileRequest,
    CandidateProfileResponse,
} from "../../../../types/authTypes";

import styles from "./EditCandidateModal.module.css";

interface EditCandidateModalProps {
    profile: CandidateProfileResponse | null;
    onClose: () => void;
    onSaved: (profile: CandidateProfileResponse) => void;
}

function EditCandidateModal({ profile, onClose, onSaved }: EditCandidateModalProps) {
    const [form, setForm] = useState({
        name: profile?.name ?? "",
        phoneNumber: profile?.phoneNumber ?? "",
        bio: profile?.bio ?? "",
        jobStatus: profile?.jobStatus ?? "",
        cvUrl: profile?.cvUrl ?? "",
        avatarUrl: profile?.avatarUrl ?? "",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        setError("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (saving) return;

        const data: CandidateProfileRequest = {
            name: form.name.trim(),
            phoneNumber: form.phoneNumber.trim() || undefined,
            bio: form.bio.trim(),
            jobStatus: (form.jobStatus || undefined) as CandidateJobStatus | undefined,
            cvUrl: form.cvUrl.trim(),
            avatarUrl: form.avatarUrl.trim(),
        };

        if (!data.name) {
            setError("Vui lòng nhập họ và tên.");
            return;
        }

        setSaving(true);
        setError("");
        try {
            const saved = profile
                ? await updateCandidateProfile(data)
                : await createCandidateProfile(data);
            onSaved(saved);
        } catch (cause) {
            const message = isAxiosError(cause) && cause.response?.data?.message;
            setError(typeof message === "string" ? message : "Không thể lưu hồ sơ. Vui lòng thử lại.");
            setSaving(false);
        }
    }

    return (
        <Modal
            isOpen
            onClose={() => { if (!saving) onClose(); }}
            title={profile ? "Chỉnh sửa hồ sơ cá nhân" : "Tạo hồ sơ cá nhân"}
            footer={
                <div className={styles.modalActions}>
                    <Button variant="outline" disabled={saving} onClick={onClose}>
                        Hủy
                    </Button>
                    <Button type="submit" form="edit-candidate-form" loading={saving}>
                        Lưu hồ sơ
                    </Button>
                </div>
            }
        >
            <form
                id="edit-candidate-form"
                className={styles.formGrid}
                onSubmit={handleSubmit}
            >
                {error && (
                    <p className={styles.fullWidth} role="alert">{error}</p>
                )}
                <Input
                    label="Họ và tên *"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Số điện thoại"
                    name="phoneNumber"
                    inputMode="tel"
                    autoComplete="tel"
                    pattern={String.raw`(0|\+84)[0-9]{9,10}`}
                    title="Bắt đầu bằng 0 hoặc +84, tiếp theo là 9 đến 10 chữ số."
                    value={form.phoneNumber}
                    onChange={handleChange}
                />
                <div className={styles.fullWidth}>
                    <Textarea
                        label="Giới thiệu bản thân"
                        name="bio"
                        rows={4}
                        value={form.bio}
                        onChange={handleChange}
                    />
                </div>
                <Select
                    label="Trạng thái tìm việc"
                    name="jobStatus"
                    options={JOB_STATUS_OPTIONS}
                    value={form.jobStatus}
                    onChange={handleChange}
                />
                <Input
                    label="Liên kết CV"
                    name="cvUrl"
                    type="url"
                    pattern="https?://.+"
                    placeholder="https://…"
                    value={form.cvUrl}
                    onChange={handleChange}
                />
                <div className={styles.fullWidth}>
                    <Input
                        label="Liên kết ảnh đại diện"
                        name="avatarUrl"
                        type="url"
                        pattern="https?://.+"
                        placeholder="https://…"
                        value={form.avatarUrl}
                        onChange={handleChange}
                    />
                </div>
            </form>
        </Modal>
    );
}

export default EditCandidateModal;
