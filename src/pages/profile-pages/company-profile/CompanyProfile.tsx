import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import Button from "../../../components/common/button/Button";
import CompanyProfileSummary from "../../../features/profile/company/company-profile-summary/CompanyProfileSummary";
import CompanyStatistics from "../../../features/profile/company/profile-statistics/CompanyStatistics";
import ActiveJobs from "../../../features/profile/company/active-jobs/ActiveJobs";
import CompanyTeam from "../../../features/profile/company/company-team/CompanyTeam";
import RecruitmentExpertise from "../../../features/profile/company/recruitment-expertise/RecruitmentExpertise";
import RecruitmentActivity from "../../../features/profile/company/recruitment-activity/RecruitmentActivity";
import RecruitmentTools from "../../../features/profile/company/recruitment-tools/RecruitmentTools";
import InterviewSchedule from "../../../features/profile/company/interview-schedule/InterviewSchedule";
import CompanyRecords from "../../../features/profile/company/company-records/CompanyRecords";
import EditCompanyModal from "../../../features/profile/company/edit-company-modal/EditCompanyModal";
import { COMPANY_JOB_PREVIEW_ITEMS } from "../../../features/jobs/jobPreviewData";
import { getCompanyProfile } from "../../../services/companyProfileService";
import type { CompanyProfileResponse } from "../../../types/authTypes";
import feedback from "../../../features/profile/ProfileFeedback.module.css";
import styles from "./CompanyProfile.module.css";

const openJobs = COMPANY_JOB_PREVIEW_ITEMS.filter((job) => job.status === "Đang mở");

function CompanyProfile() {
    const email = localStorage.getItem("accountEmail");
    const [company, setCompany] = useState<CompanyProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let active = true;
        getCompanyProfile()
            .then((data) => {
                if (active) setCompany(data);
            })
            .catch((err) => {
                if (!active) return;
                const missing = isAxiosError(err) && err.response?.status === 404;
                setError(missing
                    ? "Tài khoản chưa có hồ sơ doanh nghiệp."
                    : "Không thể tải hồ sơ doanh nghiệp."
                );
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [attempt]);

    function retryCompany() {
        setLoading(true);
        setError("");
        setAttempt((previous) => previous + 1);
    }

    function handleSaved(updated: CompanyProfileResponse) {
        setCompany(updated);
        setEditing(false);
        setSaved(true);
    }

    return (
        <>
            <div className={styles.page}>
                <CompanyProfileSummary
                    company={company}
                    email={email}
                    loading={loading}
                    onEdit={() => {
                        setSaved(false);
                        setEditing(true);
                    }}
                />
                {error && (
                    <div className={feedback.alertError} role="alert">
                        {error}
                        <Button variant="outline" onClick={retryCompany}>
                            Thử lại
                        </Button>
                    </div>
                )}
                {saved && (
                    <p className={feedback.alertSuccess} role="status">
                        Đã cập nhật hồ sơ doanh nghiệp.
                    </p>
                )}
                <CompanyStatistics openJobs={openJobs.length} />
                <div className={styles.columns}>
                    <div className={styles.stack}>
                        <ActiveJobs jobs={openJobs} />
                        <RecruitmentExpertise />
                        <RecruitmentActivity />
                    </div>
                    <aside className={`${styles.stack} ${styles.details}`}>
                        {!loading && <CompanyTeam company={company} email={email} />}
                        <RecruitmentTools />
                        <InterviewSchedule />
                    </aside>
                </div>
                {company && <CompanyRecords company={company} />}
            </div>
            {editing && company && (
                <EditCompanyModal
                    company={company}
                    onClose={() => setEditing(false)}
                    onSaved={handleSaved}
                />
            )}
        </>
    );
}

export default CompanyProfile;
