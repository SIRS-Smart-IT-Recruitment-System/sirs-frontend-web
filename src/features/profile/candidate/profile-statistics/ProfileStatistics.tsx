import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { isAxiosError } from "axios";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../routers/routePaths";
import { ArrowUpRight, ChartNoAxesCombined, Sparkles } from "lucide-react";
import { profilePreview } from "../profilePreview";

import {
    gitAnalysisService,
    type GitVerificationReport,
} from "../../../../services/gitAnalysisService";
import styles from "./ProfileStatistics.module.css";

const scoreDetails = [
    { field: "contributionScore", label: "Đóng góp", max: 35 },
    { field: "bestPracticeScore", label: "Thực hành kỹ thuật", max: 30 },
    { field: "consistencyScore", label: "Tính nhất quán", max: 20 },
    { field: "complexityScore", label: "Độ phức tạp", max: 15 },
] as const;

const previewScores = [
    { label: "Chuyên môn backend", value: 98, max: 100 },
    { label: "Kiến trúc hệ thống", value: 96, max: 100 },
    { label: "Tối ưu dữ liệu", value: 94, max: 100 },
    { label: "Giao tiếp kỹ thuật", value: 92, max: 100 },
];

function getRecommendation(summaryJson: string) {
    try {
        const summary = JSON.parse(summaryJson);
        if (typeof summary?.recommendation === "string") {
            return summary.recommendation.trim();
        }
    } catch {
        // Một số báo cáo cũ không có phần nhận xét JSON.
    }
    return "";
}

interface ProfileStatisticsProps {
    candidateId: string;
}

function ProfileStatistics({ candidateId }: ProfileStatisticsProps) {
    const [report, setReport] = useState<GitVerificationReport | null>(null);
    const [message, setMessage] = useState("Đang tải báo cáo…");

    const [selection, setSelection] = useState<"git" | "preview" | null>(null);
    const [missing, setMissing] = useState(false);

    useEffect(() => {
        let active = true;

        async function loadReport() {
            try {
                const data = await gitAnalysisService.getLatestReport(candidateId);
                if (!active) return;

                if (data?.status === "COMPLETED") {
                    setReport(data);
                } else if (data?.status === "FAILED") {
                    setMessage("Lần đánh giá gần nhất chưa thành công.");
                } else if (data?.status === "PROCESSING" || data?.status === "PENDING") {
                    setMessage("Báo cáo đang được xử lý.");
                } else {
                    setMissing(true);
                    setMessage("Chưa có báo cáo đánh giá Git.");
                }
            } catch (cause) {
                if (!active) return;
                const missing = isAxiosError(cause) && cause.response?.status === 404;
                setMissing(missing);
                setMessage(missing
                    ? "Chưa có báo cáo đánh giá Git."
                    : "Không tải được báo cáo đánh giá Git."
                );
            }
        }

        loadReport();
        return () => {
            active = false;
        };
    }, [candidateId]);

    const preview = selection === "preview" || (selection === null && missing);
    const score = preview ? profilePreview.matchScore : report?.overallScore;
    const hasScore = typeof score === "number" && Number.isFinite(score);
    const recommendation = preview
        ? "Ứng viên có thế mạnh về thiết kế dịch vụ backend và tối ưu truy vấn. Kinh nghiệm vận hành hệ thống phân tán phù hợp với các vị trí kỹ sư cấp cao."
        : report && getRecommendation(report.summaryJson);
    const scores = preview
        ? previewScores
        : scoreDetails.map(({ field, label, max }) => ({
            label,
            max,
            value: report?.[field],
        }));

    return (
        <section className={styles.report} aria-labelledby="profile-report-heading">
            <header className={styles.heading}>
                <h2 id="profile-report-heading">
                    <Sparkles size={21} aria-hidden="true" />
                    Báo cáo đánh giá năng lực
                </h2>
                <div className={styles.views} role="group" aria-label="Chọn báo cáo">
                    <button
                        type="button"
                        aria-pressed={!preview}
                        onClick={() => setSelection("git")}
                    >
                        Đánh giá Git
                    </button>
                    <button
                        type="button"
                        aria-pressed={preview}
                        onClick={() => setSelection("preview")}
                    >
                        Đánh giá AI
                    </button>
                </div>
            </header>
            {(preview || report) && (
                <div className={styles.reportBody}>
                    <article className={styles.summary}>
                        <h3>Nhận định tổng quan</h3>
                        <p>{recommendation || "Báo cáo chưa có nhận xét."}</p>
                        {preview && (
                            <ul className={styles.strengths}>
                                <li>Kiến trúc microservices</li>
                                <li>Tối ưu hiệu năng</li>
                                <li>Cloud Native</li>
                            </ul>
                        )}
                    </article>
                    <article className={styles.total}>
                        <h3>{preview ? "Mức độ phù hợp" : "Điểm Git tổng hợp"}</h3>
                        <div
                            className={styles.scoreRing}
                            style={{ "--score": (hasScore ? score : 0) + "%" } as CSSProperties}
                        >
                            <strong>{hasScore ? score : "—"}</strong>
                            <small>/ 100 điểm</small>
                        </div>
                    </article>
                    <article className={styles.breakdown}>
                        <h3>Chỉ số năng lực</h3>
                        <dl className={styles.scores}>
                            {scores.map(({ label, value, max }) => (
                                <div key={label}>
                                    <dt>{label}</dt>
                                    <dd>{value ?? "—"} / {max}</dd>
                                    {typeof value === "number" && Number.isFinite(value) && (
                                        <dd className={styles.track}>
                                            <progress aria-label={label} value={value} max={max} />
                                        </dd>
                                    )}
                                </div>
                            ))}
                        </dl>
                    </article>
                </div>
            )}
            <footer className={styles.footer}>
                {!report && <p role="status">{message}</p>}
                <Link to={ROUTES.CANDIDATE.GIT_VERIFICATION}>
                    <ChartNoAxesCombined size={16} />
                    Xem đánh giá Git
                    <ArrowUpRight size={14} />
                </Link>
            </footer>
        </section>
    );
}

export default ProfileStatistics;
