import { useState, useEffect } from "react";
import { Pencil, Eye } from "lucide-react";
import MainLayout from "../../../layouts/main-layout/MainLayout";
import CompanyInfo from "../../../components/profile/recruiter/company-info/CompanyInfo";
import ContactInfo from "../../../components/profile/recruiter/contact-info/ContactInfo";
import CompanyIntroduction from "../../../components/profile/recruiter/company-introduction/CompanyIntroduction";
import BusinessLicense from "../../../components/profile/recruiter/business-license/BusinessLicense";
import ImageGallery from "../../../components/profile/recruiter/image-gallery/ImageGallery";
import ActiveJobs from "../../../components/profile/recruiter/active-jobs/ActiveJobs";
import { getCompanyProfile } from "../../../services/companyProfileService";
import type { CompanyProfileResponse } from "../../../types/authTypes";
import styles from "./RecruiterProfile.module.css";

function RecruiterProfile() {
    const [companyProfile, setCompanyProfile] = useState<CompanyProfileResponse | null>(null);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await getCompanyProfile();
                setCompanyProfile(data);
            } catch (error) {
                console.warn("Chưa tải được hồ sơ công ty từ API hoặc chưa có dữ liệu:", error);
            }
        };

        fetchCompany();
    }, []);

    const companyName = companyProfile?.companyName || "Công ty ABC";

    return (
        <MainLayout
            role="recruiter"
            progress={80}
            userName={companyName}
            userRole="Nhà tuyển dụng"
        >
            <div className={styles.page}>

                {/* Page Header */}
                <div className={styles.pageHeader}>
                    <div className={styles.pageTitle}>
                        <h1>QUẢN LÝ HỒ SƠ CÔNG TY</h1>

                        <p>
                            Quản lý thông tin và hồ sơ doanh nghiệp của bạn.
                        </p>
                    </div>

                    <div className={styles.headerActions}>
                        <button
                            type="button"
                            className={styles.editButton}
                        >
                            <Pencil size={16} />
                            Chỉnh sửa hồ sơ
                        </button>

                        <button
                            type="button"
                            className={styles.previewButton}
                        >
                            <Eye size={16} />
                            Xem trang công khai
                        </button>
                    </div>
                </div>

                {/* Profile Content */}
                <div className={styles.contentGrid}>

                    {/* Left Column */}
                    <div className={styles.leftColumn}>
                        <div className={styles.companyCard}>
                            <CompanyInfo
                                companyName={companyProfile?.companyName}
                                taxCode={companyProfile?.businessRegistrationNumber}
                                address={companyProfile?.headquartersAddress}
                            />
                        </div>

                        <div className={styles.introductionCard}>
                            <CompanyIntroduction />
                        </div>

                        <div className={styles.galleryCard}>
                            <ImageGallery />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className={styles.rightColumn}>
                        <div className={styles.contactCard}>
                            <ContactInfo
                                contactPerson={companyProfile?.legalRepresentative}
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
            </div>
        </MainLayout>
    );
}

export default RecruiterProfile;
