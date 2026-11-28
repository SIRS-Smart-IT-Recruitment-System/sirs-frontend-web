import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CircleAlert, FlaskConical } from "lucide-react";
import { Button, Spinner } from "../../components/common";
import MainLayout from "../../layouts/templates/main-layout/MainLayout";
import { ROUTES } from "../../routers/routePaths";
import { getCompanyProfile } from "../../services/companyProfileService";
import { loadRecruiterSample, saveRecruiterSample } from "../../services/recruiterMockService";
import type { RecruitmentData } from "./model";
import type { WorkspaceContext } from "./useRecruitment";
import styles from "./Recruitment.module.css";

const titles = {
    [ROUTES.RECRUITER.CANDIDATES]: "Quản lý ứng viên",
    [ROUTES.RECRUITER.INTERVIEWS]: "Lịch phỏng vấn",
    [ROUTES.RECRUITER.DASHBOARD]: "Tổng quan tuyển dụng",
};

export default function RecruiterWorkspace() {
    const { pathname } = useLocation();
    const [company, setCompany] = useState("");
    const [sample, setSample] = useState<Awaited<ReturnType<typeof loadRecruiterSample>> | null>(null);
    const [error, setError] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let active = true;
        getCompanyProfile()
            .then((profile) => {
                if (active) setCompany(profile.companyName);
            })
            .catch(() => {
                /* The header can display the role when the company name is unavailable. */
            });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        loadRecruiterSample(localStorage.getItem("accessToken") ?? "", controller.signal)
            .then((result) => {
                if (!controller.signal.aborted) setSample(result);
            })
            .catch(() => {
                if (!controller.signal.aborted) setError(true);
            });
        return () => controller.abort();
    }, [attempt]);

    function save(data: RecruitmentData) {
        if (!sample) throw new Error("Chưa tải được dữ liệu mẫu.");
        saveRecruiterSample(sample.key, data);
        setSample({ ...sample, data });
    }

    const context: WorkspaceContext | null = sample ? { data: sample.data, save } : null;
    const title = titles[pathname.replace(/\/$/, "")] || "Tuyển dụng";
    return (
        <MainLayout role="company" userName={company} sectionTitle={title}>
            <div className={styles.page}>
                <aside className={styles.notice}>
                    <FlaskConical size={16} />
                    <span>
                        <strong>Dữ liệu mẫu</strong> · Thay đổi chỉ lưu trong phiên của tab này.
                    </span>
                </aside>
                {!sample && (
                    <div className={styles.heading}>
                        <h1>{title}</h1>
                    </div>
                )}
                {error ? (
                    <section className={styles.state} role="alert">
                        <CircleAlert size={32} />
                        <h2>Không thể tải dữ liệu tuyển dụng</h2>
                        <p>Hãy kiểm tra kết nối và quyền lưu trữ của trình duyệt.</p>
                        <Button
                            onClick={() => {
                                setError(false);
                                setAttempt(attempt + 1);
                            }}
                        >
                            Thử lại
                        </Button>
                    </section>
                ) : context ? (
                    <Outlet context={context} />
                ) : (
                    <section className={styles.loading} aria-busy="true">
                        <Spinner label="Đang tải dữ liệu tuyển dụng…" />
                        <div className={styles.skeletonCards} aria-hidden="true">
                            <i />
                            <i />
                            <i />
                        </div>
                        <div className={styles.skeletonList} aria-hidden="true">
                            <i />
                            <i />
                            <i />
                        </div>
                    </section>
                )}
            </div>
        </MainLayout>
    );
}
