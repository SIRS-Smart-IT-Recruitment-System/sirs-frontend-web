import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Eye } from "lucide-react";
import { ROUTES } from "../../../routers/routePaths";

import MainLayout from "../../../layouts/templates/main-layout/MainLayout";

import CompanyInfo from "../../../features/profile/company/company-info/CompanyInfo";
import ContactInfo from "../../../features/profile/company/contact-info/ContactInfo";
import CompanyIntroduction from "../../../features/profile/company/company-introduction/CompanyIntroduction";
import BusinessLicense from "../../../features/profile/company/business-license/BusinessLicense";
import ImageGallery from "../../../features/profile/company/image-gallery/ImageGallery";
import ActiveJobs from "../../../features/profile/company/active-jobs/ActiveJobs";

import Modal from "../../../components/common/modal/Modal";
import Button from "../../../components/common/button/Button";
import Input from "../../../components/common/input/Input";
import Spinner from "../../../components/common/spinner/Spinner";

import {
    getCompanyProfile,
    updateCompanyProfile,
} from "../../../services/companyProfileService";

import type {
    CompanyProfileRequest,
    CompanyProfileResponse,
} from "../../../types/authTypes";

import styles from "./CompanyProfile.module.css";

function validateTaxCode(code: string): string {
    const trimmed = code.trim();
    if (!trimmed) return "Vui lòng nhập mã số thuế / đăng ký kinh doanh.";
    if (!/^\d+$/.test(trimmed)) return "Mã số chỉ được chứa chữ số.";
    if (trimmed.length !== 10 && trimmed.length !== 13) {
        return "Mã số phải có 10 hoặc 13 chữ số.";
    }
    return "";
}

function CompanyProfile() {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!token) {
            navigate(ROUTES.LOGIN, { replace: true });
        }
    }, [navigate, token]);

    const [companyProfile, setCompanyProfile] = useState<CompanyProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState<CompanyProfileRequest>({
        companyName: "",
        headquartersAddress: "",
        businessRegistrationNumber: "",
        legalRepresentative: "",
    });

    const [formError, setFormError] = useState<Partial<Record<keyof CompanyProfileRequest, string>>>({});

    useEffect(() => {
        if (!token) return;

        const fetchCompanyProfile = async () => {
            try {
                setIsLoading(true);
                setError("");
                const data = await getCompanyProfile();
                setCompanyProfile(data);
                setFormData({
                    companyName: data.companyName,
                    headquartersAddress: data.headquartersAddress,
                    businessRegistrationNumber: data.businessRegistrationNumber,
                    legalRepresentative: data.legalRepresentative,
                });
            } catch (err) {
                console.error("Lỗi tải hồ sơ công ty:", err);
                setError("Không thể tải hồ sơ công ty. Vui lòng thử lại.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanyProfile();
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormError((prev) => ({ ...prev, [name]: "" }));
    };

    const handleEdit = () => {
        if (!companyProfile) return;
        setFormData({
            companyName: companyProfile.companyName,
            headquartersAddress: companyProfile.headquartersAddress,
            businessRegistrationNumber: companyProfile.businessRegistrationNumber,
            legalRepresentative: companyProfile.legalRepresentative,
        });
        setFormError({});
        setError("");
        setSuccess("");
        setIsEditing(true);
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
            setSuccess("");
            const updatedData = await updateCompanyProfile(trimmedData);
            setCompanyProfile(updatedData);
            setFormData({
                companyName: updatedData.companyName,
                headquartersAddress: updatedData.headquartersAddress,
                businessRegistrationNumber: updatedData.businessRegistrationNumber,
                legalRepresentative: updatedData.legalRepresentative,
            });
            setIsEditing(false);
            setSuccess("Cập nhật hồ sơ công ty thành công!");
            setTimeout(() => setSuccess(""), 4000);
        } catch (err) {
            console.error("Lỗi cập nhật hồ sơ:", err);
            setError("Cập nhật hồ sơ thất bại. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    };

    const companyName = companyProfile?.companyName || "Công ty ABC";

    return (
        <MainLayout
            role="company"
            progress={80}
            userName={companyName}
            userRole="Nhà tuyển dụng"
        >
            <div className={styles.page}>

                {/* Header */}
                <div className={styles.pageHeader}>
                    <div className={styles.pageTitle}>
                        <h1>QUẢN LÝ HỒ SƠ CÔNG TY</h1>
                        <p>Quản lý thông tin và hồ sơ doanh nghiệp của bạn.</p>
                    </div>

                    <div className={styles.headerActions}>
                        <Button
                            variant="primary"
                            onClick={handleEdit}
                            disabled={!companyProfile || isLoading}
                        >
                            <Pencil size={16} />
                            Chỉnh sửa hồ sơ
                        </Button>
                        <Button variant="outline">
                            <Eye size={16} />
                            Xem trang công khai
                        </Button>
                    </div>
                </div>

                {/* Thông báo */}
                {success && (
                    <div className={styles.alertSuccess} role="status">{success}</div>
                )}

                {isLoading && (
                    <div className={styles.loadingWrapper}>
                        <Spinner size="md" label="Đang tải thông tin hồ sơ công ty..." />
                    </div>
                )}

                {!isLoading && error && !isEditing && (
                    <div className={styles.alertError} role="alert">{error}</div>
                )}

                {/* Profile Content */}
                {!isLoading && companyProfile && (
                    <div className={styles.contentGrid}>
                        <div className={styles.leftColumn}>
                            <div className={styles.companyCard}>
                                <CompanyInfo
                                    companyName={companyProfile.companyName}
                                    taxCode={companyProfile.businessRegistrationNumber}
                                    address={companyProfile.headquartersAddress}
                                />
                            </div>
                            <div className={styles.introductionCard}>
                                <CompanyIntroduction />
                            </div>
                            <div className={styles.galleryCard}>
                                <ImageGallery />
                            </div>
                        </div>

                        <div className={styles.rightColumn}>
                            <div className={styles.contactCard}>
                                <ContactInfo
                                    contactPerson={companyProfile.legalRepresentative}
                                />
                            </div>
                            <div className={styles.licenseCard}>
                                <BusinessLicense />
                            </div>
                            <div className={styles.jobsCard}>
                                <ActiveJobs />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditing}
                onClose={() => { setIsEditing(false); setError(""); }}
                title="Chỉnh sửa hồ sơ công ty"
                footer={
                    <div className={styles.modalActions}>
                        <Button
                            variant="outline"
                            onClick={() => { setIsEditing(false); setError(""); }}
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
                    <div className={styles.alertError} role="alert" style={{ marginBottom: 16 }}>{error}</div>
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
        </MainLayout>
    );
}

export default CompanyProfile;
