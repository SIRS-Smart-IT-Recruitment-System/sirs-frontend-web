import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowDownUp,
    ArrowUpRight,
    BriefcaseBusiness,
    CirclePlus,
    Eye,
    FileText,
    Pencil,
    Power,
    Search,
    Trash2,
    Users,
} from "lucide-react";

import Badge from "../../../components/common/badge/Badge";
import Button from "../../../components/common/button/Button";
import Input from "../../../components/common/input/Input";
import Modal from "../../../components/common/modal/Modal";
import JobFormModal from "../../../features/jobs/JobFormModal";
import type { JobDraft } from "../../../features/jobs/JobFormModal";
import PreviewNotice from "../../../features/jobs/PreviewNotice";
import { COMPANY_JOB_PREVIEW_ITEMS } from "../../../features/jobs/jobPreviewData";
import type { JobPreview } from "../../../features/jobs/jobPreviewData";

import styles from "../../../features/jobs/JobsPreview.module.css";

type JobTab = "Tất cả tin" | "Đang mở" | "Đã đóng" | "Bản nháp";

const tabs: JobTab[] = [
    "Tất cả tin",
    "Đang mở",
    "Đã đóng",
    "Bản nháp",
];

function CompanyJobsPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [jobs, setJobs] = useState(COMPANY_JOB_PREVIEW_ITEMS);
    const [activeTab, setActiveTab] = useState<JobTab>("Tất cả tin");
    const [search, setSearch] = useState("");
    const [editingJob, setEditingJob] = useState<JobPreview | null>(null);
    const [deletingJob, setDeletingJob] = useState<JobPreview | null>(null);
    const [notice, setNotice] = useState("");
    const [formSession, setFormSession] = useState(0);

    const formOpen =
        location.pathname === "/company/jobs/create" || Boolean(editingJob);

    const visibleJobs = useMemo(() => {
        return jobs.filter((job) => {
            const matchesTab =
                activeTab === "Tất cả tin" || job.status === activeTab;
            const searchText = `${job.title} ${job.category}`
                .toLocaleLowerCase("vi");
            const matchesSearch =
                !search.trim() ||
                searchText.includes(search.trim().toLocaleLowerCase("vi"));

            return matchesTab && matchesSearch;
        });
    }, [activeTab, jobs, search]);

    const counts = useMemo(() => ({
        "Tất cả tin": jobs.length,
        "Đang mở": jobs.filter((job) => job.status === "Đang mở").length,
        "Đã đóng": jobs.filter((job) => job.status === "Đã đóng").length,
        "Bản nháp": jobs.filter((job) => job.status === "Bản nháp").length,
    }), [jobs]);

    const handleOpenCreateForm = () => {
        setEditingJob(null);
        setFormSession((currentSession) => currentSession + 1);
        navigate("/company/jobs/create");
    };

    const handleCloseForm = () => {
        setEditingJob(null);

        if (location.pathname === "/company/jobs/create") {
            navigate("/company/jobs");
        }
    };

    const handleSavePreview = (draft: JobDraft) => {
        if (editingJob) {
            setJobs((currentJobs) => currentJobs.map((job) => {
                if (job.id !== editingJob.id) {
                    return job;
                }

                return {
                    ...job,
                    ...draft,
                };
            }));
            setNotice("Đã cập nhật bản xem trước trong phiên hiện tại.");
        } else {
            const newJob: JobPreview = {
                ...draft,
                id: `preview-${Date.now()}`,
                company: "Công ty của bạn",
                initials: "CT",
                salaryMin: 0,
                salaryMax: 0,
                postedAt: "Bản xem trước vừa tạo",
                applicants: 0,
                status: "Bản nháp",
            };

            setJobs((currentJobs) => [newJob, ...currentJobs]);
            setActiveTab("Tất cả tin");
            setNotice("Đã thêm bản xem trước vào danh sách trong phiên hiện tại.");
        }

        handleCloseForm();
    };

    const handleToggleStatus = (job: JobPreview) => {
        const nextStatus: JobPreview["status"] =
            job.status === "Đang mở" ? "Đã đóng" : "Đang mở";

        setJobs((currentJobs) => currentJobs.map((currentJob) => {
            if (currentJob.id !== job.id) {
                return currentJob;
            }

            return {
                ...currentJob,
                status: nextStatus,
            };
        }));
        setNotice(`Đã đổi trạng thái xem trước thành “${nextStatus}”.`);
    };

    const handleDeletePreview = () => {
        if (!deletingJob) {
            return;
        }

        setJobs((currentJobs) => currentJobs.filter(
            (job) => job.id !== deletingJob.id
        ));
        setNotice("Đã xóa tin khỏi danh sách xem trước trong phiên hiện tại.");
        setDeletingJob(null);
    };

    const handleEditJob = (job: JobPreview) => {
        setEditingJob(job);
        setFormSession((currentSession) => currentSession + 1);
    };

    return (
        <>
            <div className={styles.page}>
                <PreviewNotice />

                <section className={styles.companyJobsHero}>
                    <div>
                        <span className={styles.eyebrow}>
                            <BriefcaseBusiness size={15} />
                            KHÔNG GIAN TUYỂN DỤNG
                        </span>
                        <h1>
                            Quản lý tin tuyển dụng
                        </h1>
                        <p>
                            Theo dõi trạng thái tin và số lượng ứng viên quan tâm.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={handleOpenCreateForm}
                    >
                        <CirclePlus size={17} />
                        Tạo tin mới
                    </Button>
                </section>

                <section
                    className={styles.summaryGrid}
                    aria-label="Tổng quan tin tuyển dụng"
                >
                    <SummaryCard
                        icon={<FileText size={19} />}
                        iconClassName={styles.summaryBlue}
                        label="Tổng tin tuyển dụng"
                        value={jobs.length}
                        detail="Trong bản xem trước"
                    />
                    <SummaryCard
                        icon={<Eye size={19} />}
                        iconClassName={styles.summaryGreen}
                        label="Đang hiển thị"
                        value={counts["Đang mở"]}
                        detail="Tin đang mở"
                    />
                    <SummaryCard
                        icon={<Users size={19} />}
                        iconClassName={styles.summaryViolet}
                        label="Ứng viên quan tâm"
                        value={jobs.reduce(
                            (total, job) => total + job.applicants,
                            0
                        )}
                        detail="Theo dữ liệu minh họa"
                    />
                </section>

                <section className={styles.managementPanel}>
                    <div className={styles.panelTitleRow}>
                        <div>
                            <span className={styles.sectionKicker}>
                                DANH SÁCH
                            </span>
                            <h2>
                                Tin tuyển dụng của bạn
                            </h2>
                        </div>
                        <span className={styles.previewCount}>
                            {visibleJobs.length} tin
                        </span>
                    </div>

                    <div
                        className={styles.jobTabs}
                        role="tablist"
                        aria-label="Lọc theo trạng thái"
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab}
                                className={
                                    activeTab === tab
                                        ? styles.jobTabActive
                                        : styles.jobTab
                                }
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                                <span>
                                    {counts[tab]}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className={styles.managementToolbar}>
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Tìm theo tên tin tuyển dụng"
                            leftIcon={<Search size={17} />}
                        />
                        <button
                            type="button"
                            className={styles.sortButton}
                            disabled
                        >
                            Ngày đăng
                            <ArrowDownUp size={15} />
                        </button>
                    </div>

                    {notice && (
                        <div className={styles.inlineNotice} role="status">
                            {notice}
                            <button
                                type="button"
                                onClick={() => setNotice("")}
                                aria-label="Đóng thông báo"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {visibleJobs.length > 0 ? (
                        <JobsTable
                            jobs={visibleJobs}
                            onEdit={handleEditJob}
                            onToggleStatus={handleToggleStatus}
                            onRequestDelete={setDeletingJob}
                        />
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <Search size={24} />
                            </div>
                            <h3>
                                Không tìm thấy tin tuyển dụng
                            </h3>
                            <p>
                                Thử đổi từ khóa hoặc chọn trạng thái khác.
                            </p>
                        </div>
                    )}

                    <div className={styles.tableFooter}>
                        <span>
                            Danh sách nội dung xem trước
                        </span>
                        <button
                            type="button"
                            className={styles.textLink}
                            onClick={handleOpenCreateForm}
                        >
                            Tạo tin tuyển dụng
                            <ArrowUpRight size={15} />
                        </button>
                    </div>
                </section>
            </div>

            <JobFormModal
                key={formSession}
                isOpen={formOpen}
                job={editingJob}
                onClose={handleCloseForm}
                onSave={handleSavePreview}
            />

            <Modal
                isOpen={Boolean(deletingJob)}
                onClose={() => setDeletingJob(null)}
                title="Xóa khỏi bản xem trước?"
                footer={(
                    <div className={styles.formFooter}>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingJob(null)}
                        >
                            Giữ lại
                        </Button>
                        <Button
                            type="button"
                            variant="danger"
                            onClick={handleDeletePreview}
                        >
                            Xóa bản xem trước
                        </Button>
                    </div>
                )}
            >
                <p className={styles.deletePrompt}>
                    “{deletingJob?.title}” sẽ bị xóa khỏi danh sách xem trước trên
                    màn hình này. Không có dữ liệu máy chủ nào bị thay đổi.
                </p>
            </Modal>
        </>
    );
}

interface SummaryCardProps {
    icon: ReactNode;
    iconClassName: string;
    label: string;
    value: number;
    detail: string;
}

function SummaryCard({
    icon,
    iconClassName,
    label,
    value,
    detail,
}: SummaryCardProps) {
    return (
        <div className={styles.summaryCard}>
            <span className={`${styles.summaryIcon} ${iconClassName}`}>
                {icon}
            </span>
            <span className={styles.summaryLabel}>
                {label}
            </span>
            <strong>
                {value.toString().padStart(2, "0")}
            </strong>
            <small>
                {detail}
            </small>
        </div>
    );
}

interface JobsTableProps {
    jobs: JobPreview[];
    onEdit: (job: JobPreview) => void;
    onToggleStatus: (job: JobPreview) => void;
    onRequestDelete: (job: JobPreview) => void;
}

function JobsTable({
    jobs,
    onEdit,
    onToggleStatus,
    onRequestDelete,
}: JobsTableProps) {
    return (
        <div className={styles.tableScroller}>
            <table className={styles.jobsTable}>
                <thead>
                    <tr>
                        <th>
                            TIN TUYỂN DỤNG
                        </th>
                        <th>
                            TRẠNG THÁI
                        </th>
                        <th>
                            ỨNG VIÊN
                        </th>
                        <th>
                            HẠN NỘP
                        </th>
                        <th>
                            THAO TÁC
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job) => (
                        <tr key={job.id}>
                            <td>
                                <div className={styles.tableJob}>
                                    <span className={styles.tableJobIcon}>
                                        <BriefcaseBusiness size={17} />
                                    </span>
                                    <span>
                                        <strong>
                                            {job.title}
                                        </strong>
                                        <small>
                                            {job.category} · {job.location}
                                        </small>
                                    </span>
                                </div>
                            </td>
                            <td>
                                <Badge
                                    variant={getStatusVariant(job.status)}
                                    size="sm"
                                >
                                    {job.status}
                                </Badge>
                            </td>
                            <td>
                                <span className={styles.applicantCount}>
                                    <Users size={15} />
                                    {job.applicants}
                                </span>
                            </td>
                            <td className={styles.deadlineCell}>
                                {job.deadline || "—"}
                            </td>
                            <td>
                                <div className={styles.rowActions}>
                                    <button
                                        type="button"
                                        title="Chỉnh sửa bản xem trước"
                                        aria-label={`Chỉnh sửa ${job.title}`}
                                        onClick={() => onEdit(job)}
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        title={getStatusActionLabel(job.status)}
                                        aria-label={getStatusActionLabel(job.status)}
                                        onClick={() => onToggleStatus(job)}
                                    >
                                        <Power size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.deleteAction}
                                        title="Xóa khỏi bản xem trước"
                                        aria-label={`Xóa ${job.title}`}
                                        onClick={() => onRequestDelete(job)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function getStatusVariant(
    status: JobPreview["status"]
): "success" | "default" | "warning" {
    if (status === "Đang mở") {
        return "success";
    }

    if (status === "Đã đóng") {
        return "default";
    }

    return "warning";
}

function getStatusActionLabel(status: JobPreview["status"]) {
    return status === "Đang mở"
        ? "Đóng tin trong bản xem trước"
        : "Mở tin trong bản xem trước";
}

export default CompanyJobsPage;
