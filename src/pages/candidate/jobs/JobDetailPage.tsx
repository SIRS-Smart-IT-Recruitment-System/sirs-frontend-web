import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ArrowUpRight,
    BriefcaseBusiness,
    CalendarDays,
    Check,
    Clock3,
    MapPin,
    ShieldCheck,
    Sparkles,
    Wallet,
} from "lucide-react";

import Button from "../../../components/common/button/Button";
import FileUpload from "../../../components/common/file-upload/FileUpload";
import Modal from "../../../components/common/modal/Modal";
import PreviewNotice from "../../../features/jobs/PreviewNotice";
import { JOB_PREVIEW_ITEMS } from "../../../features/jobs/jobPreviewData";

import styles from "../../../features/jobs/JobsPreview.module.css";

function JobDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showApplyNote, setShowApplyNote] = useState(false);
    const [selectedCv, setSelectedCv] = useState<File | null>(null);
    const [applyInfo, setApplyInfo] = useState("");
    const job = JOB_PREVIEW_ITEMS.find((item) => item.id === id);

    const handleCloseApplyPreview = () => {
        setShowApplyNote(false);
        setSelectedCv(null);
        setApplyInfo("");
    };

    const handlePreviewApplication = () => {
        if (!selectedCv) {
            return;
        }

        setApplyInfo(
            `Đã chọn “${selectedCv.name}” cho bản xem trước. Hồ sơ chưa được gửi vì chưa có API ứng tuyển.`
        );
    };

    const handleCvChange = (file: File) => {
        setSelectedCv(file);
        setApplyInfo("");
    };

    return (
        <>
            <div className={styles.page}>
                <PreviewNotice />

                <button
                    type="button"
                    className={styles.backLink}
                    onClick={() => navigate("/candidate/jobs")}
                >
                    <ArrowLeft size={17} />
                    Quay lại danh sách việc làm
                </button>

                {!job ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <BriefcaseBusiness size={25} />
                        </div>
                        <h3>
                            Không tìm thấy tin xem trước
                        </h3>
                        <p>
                            Tin này không có trong bộ nội dung minh họa hiện tại.
                        </p>
                        <Button
                            type="button"
                            onClick={() => navigate("/candidate/jobs")}
                        >
                            Mở danh sách việc làm
                        </Button>
                    </div>
                ) : (
                    <div className={styles.detailLayout}>
                        <main className={styles.detailMain}>
                            <section className={styles.detailHero}>
                                <div className={styles.companyMarkLarge}>
                                    {job.initials}
                                </div>

                                <div className={styles.detailHeroInfo}>
                                    <span className={styles.detailCompany}>
                                        {job.company}
                                        <ShieldCheck size={15} />
                                    </span>
                                    <h1>
                                        {job.title}
                                    </h1>
                                    <div className={styles.detailQuickMeta}>
                                        <span>
                                            <MapPin size={16} />
                                            {job.location}
                                        </span>
                                        <span>
                                            <BriefcaseBusiness size={16} />
                                            {job.level}
                                        </span>
                                        <span>
                                            <Clock3 size={16} />
                                            {job.workType}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className={styles.shareButton}
                                    disabled
                                    title="Chia sẻ sẽ được bổ sung sau"
                                >
                                    <ArrowUpRight size={16} />
                                    Chia sẻ
                                </Button>
                            </section>

                            <JobDetailSection
                                icon={<BriefcaseBusiness size={18} />}
                                kicker="VỀ VỊ TRÍ"
                                title="Mô tả công việc"
                            >
                                <p className={styles.descriptionText}>
                                    {job.description}
                                </p>
                            </JobDetailSection>

                            <JobDetailSection
                                icon={<Check size={18} />}
                                kicker="BẠN SẼ PHÙ HỢP NẾU"
                                title="Yêu cầu công việc"
                            >
                                <DetailList items={job.requirements} />
                            </JobDetailSection>

                            <JobDetailSection
                                icon={<Sparkles size={18} />}
                                kicker="ĐIỀU BẠN NHẬN ĐƯỢC"
                                title="Quyền lợi"
                            >
                                <DetailList items={job.benefits} />
                            </JobDetailSection>
                        </main>

                        <aside className={styles.detailAside}>
                            <section className={styles.applyCard}>
                                <span className={styles.sectionKicker}>
                                    CƠ HỘI CỦA BẠN
                                </span>
                                <h2>
                                    {job.salary}
                                </h2>
                                <p className={styles.salaryCaption}>
                                    mức lương minh họa
                                </p>

                                <div className={styles.applyFacts}>
                                    <div>
                                        <Wallet size={17} />
                                        <span>
                                            Mức lương
                                            <strong>
                                                {job.salary}
                                            </strong>
                                        </span>
                                    </div>
                                    <div>
                                        <CalendarDays size={17} />
                                        <span>
                                            Hạn nộp
                                            <strong>
                                                {job.deadline}
                                            </strong>
                                        </span>
                                    </div>
                                    <div>
                                        <BriefcaseBusiness size={17} />
                                        <span>
                                            Hồ sơ quan tâm
                                            <strong>
                                                {job.applicants} ứng viên
                                            </strong>
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    className={styles.applyButton}
                                    onClick={() => setShowApplyNote(true)}
                                >
                                    Ứng tuyển ngay
                                    <ArrowUpRight size={17} />
                                </Button>
                                <p className={styles.applyHint}>
                                    Đây là bản xem trước, hồ sơ chưa được gửi.
                                </p>
                            </section>

                            <section className={styles.companyCard}>
                                <span className={styles.sectionKicker}>
                                    NHÀ TUYỂN DỤNG
                                </span>
                                <div className={styles.companyCardBrand}>
                                    <div className={styles.companyMark}>
                                        {job.initials}
                                    </div>
                                    <div>
                                        <strong>
                                            {job.company}
                                        </strong>
                                        <span>
                                            Công ty công nghệ · minh họa
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={styles.companyLink}
                                    disabled
                                >
                                    Xem hồ sơ công ty
                                    <ArrowUpRight size={15} />
                                </Button>
                            </section>
                        </aside>
                    </div>
                )}
            </div>

            <Modal
                isOpen={showApplyNote}
                onClose={handleCloseApplyPreview}
                title="Nộp CV ứng tuyển"
            >
                <div className={styles.previewApplyForm}>
                    <p>
                        Chọn tệp CV để xem trước bước nộp hồ sơ. Tệp chỉ được
                        chọn trong trình duyệt, không tải lên máy chủ.
                    </p>

                    <FileUpload
                        label="Chọn tệp CV"
                        extensions={[".pdf", ".doc", ".docx"]}
                        onSelect={handleCvChange}
                    />

                    {selectedCv && (
                        <div className={styles.selectedFile}>
                            <FileLabel />
                            <span>
                                <strong>
                                    {selectedCv.name}
                                </strong>
                                <small>
                                    {(selectedCv.size / 1024 / 1024).toFixed(2)}
                                    {" MB · Chưa tải lên"}
                                </small>
                            </span>
                        </div>
                    )}

                    {applyInfo && (
                        <div className={styles.inlineNotice} role="status">
                            {applyInfo}
                        </div>
                    )}

                    <div className={styles.applyModalFooter}>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseApplyPreview}
                        >
                            Đóng
                        </Button>
                        <Button
                            type="button"
                            disabled={!selectedCv}
                            onClick={handlePreviewApplication}
                        >
                            Xem trước nộp hồ sơ
                        </Button>
                    </div>

                    <p className={styles.applyApiNote}>
                        <ShieldCheck size={15} />
                        Chưa có API nộp hồ sơ trong tài liệu hiện tại. Nút này
                        không gửi CV.
                    </p>
                </div>
            </Modal>
        </>
    );
}

interface JobDetailSectionProps {
    icon: ReactNode;
    kicker: string;
    title: string;
    children: ReactNode;
}

function JobDetailSection({
    icon,
    kicker,
    title,
    children,
}: JobDetailSectionProps) {
    return (
        <section className={styles.detailSection}>
            <div className={styles.detailSectionTitle}>
                <span className={styles.sectionIcon}>
                    {icon}
                </span>
                <div>
                    <span className={styles.sectionKicker}>
                        {kicker}
                    </span>
                    <h2>
                        {title}
                    </h2>
                </div>
            </div>
            {children}
        </section>
    );
}

interface DetailListProps {
    items: string[];
}

function DetailList({ items }: DetailListProps) {
    return (
        <ul className={styles.detailList}>
            {items.map((item) => (
                <li key={item}>
                    <span>
                        <Check size={14} />
                    </span>
                    {item}
                </li>
            ))}
        </ul>
    );
}

function FileLabel() {
    return (
        <span className={styles.fileBadge}>
            CV
        </span>
    );
}

export default JobDetailPage;
