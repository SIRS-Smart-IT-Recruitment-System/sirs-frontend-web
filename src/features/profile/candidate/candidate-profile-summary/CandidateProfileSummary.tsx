import {
    Award,
    Banknote,
    BrainCircuit,
    CalendarDays,
    FileText,
    Gauge,
    Mail,
    Pencil,
    Phone,
    Share2,
} from "lucide-react";

import { Avatar, Button, Spinner } from "../../../../components/common";
import { JOB_STATUS_OPTIONS } from "../../../../constants/candidateJobStatus";
import type { CandidateProfileResponse } from "../../../../types/authTypes";
import { profilePreview } from "../profilePreview";

import styles from "./CandidateProfileSummary.module.css";

const indicators = [
    {
        label: "SIRS AI Score",
        value: profilePreview.matchScore + "/100",
        icon: BrainCircuit,
        tone: "blue",
    },
    {
        label: "Mức lương kỳ vọng",
        value: profilePreview.salary,
        icon: Banknote,
        tone: "green",
    },
    {
        label: "Tỷ lệ tương tác",
        value: "100%",
        icon: Gauge,
        tone: "violet",
    },
    {
        label: "Chứng chỉ",
        value: "AWS Pro & CKA",
        icon: Award,
        tone: "amber",
    },
];

interface CandidateProfileSummaryProps {
    profile: CandidateProfileResponse | null;
    email?: string;
    loading: boolean;
    canEdit: boolean;
    cvUrl?: string;
    onEdit: () => void;
    onShare: () => void;
}

function CandidateProfileSummary({
    profile,
    email,
    loading,
    canEdit,
    cvUrl,
    onEdit,
    onShare,
}: CandidateProfileSummaryProps) {
    const name = profile?.name?.trim() || email || "Chưa cập nhật tên";
    const status = JOB_STATUS_OPTIONS.find((option) => option.value === profile?.jobStatus);
    const updatedAt = profile?.updatedAt ? new Date(profile.updatedAt) : null;

    return (
        <header className={styles.hero}>
            <div className={styles.cover} aria-hidden="true" />
            <div className={styles.identity}>
                <Avatar
                    key={profile?.avatarUrl}
                    className={styles.avatar}
                    src={profile?.avatarUrl}
                    name={name}
                    size="xl"
                />
                <div className={styles.coverName}>
                    {loading ? (
                        <Spinner size="sm" label="Đang tải hồ sơ…" />
                    ) : (
                        <>
                            <h1>{name}</h1>
                            {profile && (
                                <span className={styles.jobStatus}>
                                    <i aria-hidden="true" /> {status?.label ?? "Chưa cập nhật trạng thái"}
                                </span>
                            )}
                        </>
                    )}
                </div>
                <div className={styles.identityDetails}>
                    {profile?.bio?.trim() && (
                        <p className={styles.identityDescription}>{profile.bio.trim()}</p>
                    )}
                    <div className={styles.meta}>
                        {email && (
                            <span className={styles.detail}>
                                <Mail size={15} /> {email}
                            </span>
                        )}
                        {profile?.phoneNumber && (
                            <span className={styles.detail}>
                                <Phone size={15} /> {profile.phoneNumber}
                            </span>
                        )}
                        {updatedAt && Number.isFinite(updatedAt.getTime()) && (
                            <span className={styles.detail}>
                                <CalendarDays size={15} />
                                <time dateTime={profile?.updatedAt}>
                                    Cập nhật {updatedAt.toLocaleDateString("vi-VN")}
                                </time>
                            </span>
                        )}
                    </div>
                </div>
                {canEdit && (
                    <div className={styles.profileActions} id="cv">
                        <Button onClick={onEdit}>
                            <Pencil size={16} />
                            {profile ? "Chỉnh sửa hồ sơ" : "Tạo hồ sơ"}
                        </Button>
                        {cvUrl && (
                            <a
                                className={styles.secondaryAction}
                                href={cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FileText size={16} /> Xem CV
                            </a>
                        )}
                        {profile && (
                            <Button variant="outline" onClick={onShare}>
                                <Share2 size={16} /> Chia sẻ
                            </Button>
                        )}
                    </div>
                )}
            </div>
            {profile && (
                <section className={styles.indicators} aria-labelledby="candidate-indicators">
                    <h2 id="candidate-indicators">Chỉ số tham khảo</h2>
                    <dl className={styles.metrics}>
                        {indicators.map(({ label, value, icon: Icon, tone }) => (
                            <div key={label} data-tone={tone}>
                                <dt>
                                    <Icon size={18} aria-hidden="true" />
                                    {label}
                                </dt>
                                <dd>{value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}
        </header>
    );
}

export default CandidateProfileSummary;
