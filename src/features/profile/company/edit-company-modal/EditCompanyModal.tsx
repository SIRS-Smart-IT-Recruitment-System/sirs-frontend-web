import { useState } from "react";

import Button from "../../../../components/common/button/Button";
import Input from "../../../../components/common/input/Input";
import Modal from "../../../../components/common/modal/Modal";
import { updateCompanyProfile } from "../../../../services/companyProfileService";
import type {
    CompanyProfileRequest,
    CompanyProfileResponse,
} from "../../../../types/authTypes";
import styles from "./EditCompanyModal.module.css";
import feedback from "../../ProfileFeedback.module.css";

interface EditCompanyModalProps {
    company: CompanyProfileResponse;
    onClose: () => void;
    onSaved: (company: CompanyProfileResponse) => void;
}

function validateTaxCode(code: string): string {
    const trimmed = code.trim();
    if (!trimmed) return "Vui lòng nhập mã số thuế / đăng ký kinh doanh.";
    if (!/^\d+$/.test(trimmed)) return "Mã số chỉ được chứa chữ số.";
    if (trimmed.length !== 10 && trimmed.length !== 13) {
        return "Mã số phải có 10 hoặc 13 chữ số.";
    }
    return "";
}

function EditCompanyModal({ company, onClose, onSaved }: EditCompanyModalProps) {
    const [formData, setFormData] = useState<CompanyProfileRequest>({
        companyName: company.companyName,
        headquartersAddress: company.headquartersAddress,
        businessRegistrationNumber: company.businessRegistrationNumber,
        legalRepresentative: company.legalRepresentative,
    });
    const [formError, setFormError] = useState<
        Partial<Record<keyof CompanyProfileRequest, string>>
    >({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    function handleClose() {
        if (!isSaving) onClose();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormError((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = (): boolean => {
        const errors: Partial<Record<keyof CompanyProfileRequest, string>> = {};
        if (!formData.companyName.trim()) errors.companyName = "Vui lòng nhập tên công ty.";
        if (!formData.headquartersAddress.trim()) errors.headquartersAddress = "Vui lòng nhập địa chỉ trụ sở.";
        if (!formData.legalRepresentative.trim()) errors.legalRepresentative = "Vui lòng nhập người đại diện.";
        const taxErr = validateTaxCode(formData.businessRegistrationNumber);
        if (taxErr) errors.businessRegistrationNumber = taxErr;
        setFormError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;

        const trimmedData: CompanyProfileRequest = {
            companyName: formData.companyName.trim(),
            headquartersAddress: formData.headquartersAddress.trim(),
            businessRegistrationNumber: formData.businessRegistrationNumber.trim(),
            legalRepresentative: formData.legalRepresentative.trim(),
        };

        try {
            setIsSaving(true);
            setError("");
            const updated = await updateCompanyProfile(trimmedData);
            onSaved(updated);
        } catch {
            setError("Cập nhật hồ sơ thất bại. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            isOpen
            onClose={handleClose}
            title="Chỉnh sửa hồ sơ công ty"
            footer={
                <div className={styles.modalActions}>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSaving}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        form="edit-company-form"
                        loading={isSaving}
                        disabled={isSaving}
                    >
                        Lưu thay đổi
                    </Button>
                </div>
            }
        >
            {error && (
                <div className={feedback.alertError} role="alert">{error}</div>
            )}
            <form id="edit-company-form" onSubmit={handleSubmit} noValidate>
                <div className={styles.formGrid}>
                    <div className={styles.fullWidth}>
                        <Input
                            label="Tên công ty *"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Công ty TNHH ABC"
                            error={formError.companyName}
                        />
                    </div>
                    <Input
                        label="Mã số thuế / ĐKKD *"
                        name="businessRegistrationNumber"
                        value={formData.businessRegistrationNumber}
                        onChange={handleChange}
                        placeholder="0123456789 (10 hoặc 13 chữ số)"
                        error={formError.businessRegistrationNumber}
                    />
                    <Input
                        label="Người đại diện pháp luật *"
                        name="legalRepresentative"
                        value={formData.legalRepresentative}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        error={formError.legalRepresentative}
                    />
                    <div className={styles.fullWidth}>
                        <Input
                            label="Địa chỉ trụ sở chính *"
                            name="headquartersAddress"
                            value={formData.headquartersAddress}
                            onChange={handleChange}
                            placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
                            error={formError.headquartersAddress}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
}

export default EditCompanyModal;
