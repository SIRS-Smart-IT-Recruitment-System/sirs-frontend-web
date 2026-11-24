import { useEffect, useState } from "react";
import {
    GitFork,
    Star,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    CheckSquare,
    Square,
    Award,
    Sparkles,
    Code,
    Check,
    X,
} from "lucide-react";
import MainLayout from "../../layouts/templates/main-layout/MainLayout";
import Button from "../../components/common/button/Button";
import Input from "../../components/common/input/Input";
import Spinner from "../../components/common/spinner/Spinner";
import Badge from "../../components/common/badge/Badge";
import { getCandidateProfile } from "../../services/candidateProfileService";
import {
    gitAnalysisService,
} from "../../services/gitAnalysisService";
import type {
    GithubRepository,
    GitVerificationReport,
} from "../../services/gitAnalysisService";
import styles from "./GitVerificationPage.module.css";

export default function GitVerificationPage() {
    const [candidateId, setCandidateId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form kết nối GitHub
    const [githubUsername, setGithubUsername] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    // Danh sách Repos & Report
    const [repos, setRepos] = useState<GithubRepository[]>([]);
    const [selectedRepoIds, setSelectedRepoIds] = useState<string[]>([]);
    const [report, setReport] = useState<GitVerificationReport | null>(null);

    // Load Repos và Báo cáo đã có
    async function loadData(cId: string) {
        try {
            // Lấy danh sách repos
            try {
                const repoRes = await gitAnalysisService.getRepositories(cId);
                if (repoRes.data && repoRes.data.length > 0) {
                    setRepos(repoRes.data);
                    setIsConnected(true);
                    const selected = repoRes.data.filter((r) => r.isSelected).map((r) => r.id);
                    setSelectedRepoIds(selected);
                }
            } catch {
                // Chưa kết nối repo
            }

            // Lấy báo cáo mới nhất nếu có
            try {
                const repRes = await gitAnalysisService.getLatestReport(cId);
                if (repRes.data) {
                    setReport(repRes.data);
                }
            } catch {
                // Chưa có báo cáo
            }
        } catch (e) {
            console.error(e);
        }
    }

    // 1. Lấy thông tin ứng viên hiện tại
    useEffect(() => {
        const init = async () => {
            try {
                setIsLoading(true);
                const profile = await getCandidateProfile();
                if (profile && profile.candidateId) {
                    setCandidateId(profile.candidateId);
                    await loadData(profile.candidateId);
                }
            } catch (err: any) {
                console.error("Lỗi khởi tạo hồ sơ:", err);
                setError("Không thể tải thông tin ứng viên.");
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    // Bước 1: Kết nối tài khoản GitHub
    const handleConnectGithub = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!candidateId || !githubUsername.trim() || !accessToken.trim()) return;

        try {
            setIsSyncing(true);
            setError(null);
            await gitAnalysisService.connectGithub(candidateId, githubUsername.trim(), accessToken.trim());
            setIsConnected(true);
            setSuccessMessage("Kết nối tài khoản GitHub thành công!");

            // Đồng bộ luôn repos sau khi kết nối
            const syncRes = await gitAnalysisService.syncRepositories(candidateId);
            setRepos(syncRes.data || []);
        } catch (err: any) {
            console.error(err);
            setError("Kết nối thất bại. Vui lòng kiểm tra lại Username và Access Token.");
        } finally {
            setIsSyncing(false);
        }
    };

    // Bước 2: Đồng bộ lại Repositories từ GitHub
    const handleSyncRepos = async () => {
        if (!candidateId) return;
        try {
            setIsSyncing(true);
            setError(null);
            const syncRes = await gitAnalysisService.syncRepositories(candidateId);
            setRepos(syncRes.data || []);
            setSuccessMessage("Đã đồng bộ danh sách repository mới nhất từ GitHub!");
        } catch {
            setError("Đồng bộ thất bại. Vui lòng thử lại sau.");
        } finally {
            setIsSyncing(false);
        }
    };

    // Bước 3: Chọn / bỏ chọn repository
    const toggleSelectRepo = (repoId: string) => {
        if (selectedRepoIds.includes(repoId)) {
            setSelectedRepoIds(selectedRepoIds.filter((id) => id !== repoId));
        } else {
            if (selectedRepoIds.length >= 5) {
                alert("Bạn chỉ được chọn tối đa 5 repositories tiêu biểu nhất!");
                return;
            }
            setSelectedRepoIds([...selectedRepoIds, repoId]);
        }
    };

    // Lưu danh sách chọn và kích hoạt phân tích
    const handleAnalyze = async () => {
        if (!candidateId) return;
        if (selectedRepoIds.length === 0) {
            alert("Vui lòng chọn ít nhất 1 repository để phân tích!");
            return;
        }

        try {
            setIsAnalyzing(true);
            setError(null);
            // 1. Cập nhật các repo được chọn
            await gitAnalysisService.selectRepositories(candidateId, selectedRepoIds);

            // 2. Kích hoạt tính điểm
            const analyzeRes = await gitAnalysisService.analyzeGit(candidateId);
            setReport(analyzeRes.data);
            setSuccessMessage("Phân tích và chấm điểm hoàn tất!");

            // Tải lại repo để cập nhật điểm riêng từng repo
            const repoRes = await gitAnalysisService.getRepositories(candidateId);
            setRepos(repoRes.data || []);
        } catch (err: any) {
            console.error(err);
            setError("Có lỗi trong quá trình phân tích. Vui lòng thử lại.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Parse summary JSON
    const parseSummary = (jsonStr: string) => {
        try {
            return JSON.parse(jsonStr);
        } catch {
            return { strengths: [], weaknesses: [], recommendation: "" };
        }
    };

    const summary = report ? parseSummary(report.summaryJson) : null;

    if (isLoading) {
        return (
            <MainLayout role="candidate">
                <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
                    <Spinner size="lg" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout role="candidate">
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.headerSection}>
                    <h1 className={styles.title}>Đánh giá & Chấm điểm Năng lực Git</h1>
                    <p className={styles.subtitle}>
                        Kết nối GitHub để hệ thống phân tích quy chuẩn mã nguồn, thói quen commit và chất lượng dự án của bạn.
                    </p>
                </div>

                {/* Thông báo Alert */}
                {error && (
                    <div style={{ background: "#FEF2F2", color: "#B91C1C", padding: "12px 16px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}
                {successMessage && (
                    <div style={{ background: "#ECFDF5", color: "#065F46", padding: "12px 16px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <CheckCircle2 size={18} />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Bước 1: Kết nối GitHub Account */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>
                            <Code size={20} color="var(--color-primary)" />
                            Bước 1: Tài khoản GitHub
                        </h3>
                        {isConnected && (
                            <Button
                                variant="outline"
                                onClick={handleSyncRepos}
                                disabled={isSyncing}
                            >
                                <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} style={{ marginRight: 6 }} />
                                {isSyncing ? "Đang đồng bộ..." : "Đồng bộ lại Repos"}
                            </Button>
                        )}
                    </div>

                    {!isConnected ? (
                        <form onSubmit={handleConnectGithub} className={styles.connectForm}>
                            <Input
                                label="GitHub Username"
                                placeholder="vd: lehaiau"
                                value={githubUsername}
                                onChange={(e) => setGithubUsername(e.target.value)}
                                required
                            />
                            <div>
                                <Input
                                    label="Personal Access Token (Classic hoặc Fine-grained)"
                                    type="password"
                                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                    value={accessToken}
                                    onChange={(e) => setAccessToken(e.target.value)}
                                    required
                                />
                                <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4, marginBottom: 0 }}>
                                    Token cần quyền <code>read:user</code> và <code>repo</code> để quét metadata
                                </p>
                            </div>
                            <div>
                                <Button type="submit" variant="primary" disabled={isSyncing}>
                                    {isSyncing ? "Đang kết nối..." : "Kết nối & Đồng bộ Repository"}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className={styles.connectedProfile}>
                            <div className={styles.profileInfo}>
                                <div style={{ background: "#1E293B", color: "white", padding: "10px", borderRadius: "50%", display: "flex" }}>
                                    <Code size={24} />
                                </div>
                                <div className={styles.profileMeta}>
                                    <h4>Tài khoản GitHub đã liên kết</h4>
                                    <p>Đã tìm thấy {repos.length} repositories trong tài khoản của bạn.</p>
                                </div>
                            </div>
                            <Badge variant="success">Đã kết nối</Badge>
                        </div>
                    )}
                </div>

                {/* Bước 2 & 3: Chọn Repositories */}
                {isConnected && (
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>
                                <Award size={20} color="var(--color-primary)" />
                                Bước 2: Chọn Repository tiêu biểu để đánh giá
                            </h3>
                            <span className={styles.selectedBadge}>
                                Đã chọn: {selectedRepoIds.length} / 5
                            </span>
                        </div>

                        <div className={styles.selectionNotice}>
                            <span>Hãy chọn 1 đến 5 dự án bạn tự tay phát triển và tâm đắc nhất:</span>
                        </div>

                        {repos.length === 0 ? (
                            <p style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: "24px" }}>
                                Không tìm thấy repository nào. Hãy thử nhấn "Đồng bộ lại Repos".
                            </p>
                        ) : (
                            <div className={styles.repoGrid}>
                                {repos.map((repo) => {
                                    const isSel = selectedRepoIds.includes(repo.id);
                                    return (
                                        <div
                                            key={repo.id}
                                            className={`${styles.repoCard} ${isSel ? styles.repoCardSelected : ""}`}
                                            onClick={() => toggleSelectRepo(repo.id)}
                                        >
                                            <div>
                                                <div className={styles.repoTop}>
                                                    <span className={styles.repoName}>{repo.repoName}</span>
                                                    {isSel ? (
                                                        <CheckSquare size={20} color="var(--color-primary)" />
                                                    ) : (
                                                        <Square size={20} color="var(--color-border)" />
                                                    )}
                                                </div>
                                                <p className={styles.repoDesc}>
                                                    {repo.description || "Không có mô tả dự án."}
                                                </p>
                                            </div>

                                            <div className={styles.repoMeta}>
                                                {repo.primaryLanguage && (
                                                    <Badge variant="info">{repo.primaryLanguage}</Badge>
                                                )}
                                                {repo.isFork && <Badge variant="warning">Fork</Badge>}
                                                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                    <Star size={13} /> {repo.starsCount || 0}
                                                </span>
                                                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                    <GitFork size={13} /> {repo.forksCount || 0}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className={styles.repoActionRow}>
                            <Button
                                variant="primary"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || selectedRepoIds.length === 0}
                            >
                                <Sparkles size={16} style={{ marginRight: 6 }} />
                                {isAnalyzing ? "Đang quét metadata & Tính điểm..." : "Bắt đầu Phân tích & Chấm điểm"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Bước 4 & 5: Báo cáo kết quả Git Verification Report */}
                {report && (
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>
                                <Sparkles size={20} color="#F59E0B" />
                                Kết quả Đánh giá Git (Git Verification Report)
                            </h3>
                            <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                                Chấm điểm lúc: {new Date(report.analyzedAt).toLocaleString("vi-VN")}
                            </span>
                        </div>

                        {/* Điểm tổng quan & 4 chỉ số thành phần */}
                        <div className={styles.reportHeaderGrid}>
                            <div className={styles.overallScoreCard}>
                                <div className={styles.overallNumber}>{report.overallScore}</div>
                                <div className={styles.overallLabel}>Điểm Tổng Quan / 100</div>
                                <div style={{ marginTop: 12 }}>
                                    <Badge variant={report.overallScore >= 75 ? "success" : report.overallScore >= 50 ? "warning" : "danger"}>
                                        {report.overallScore >= 75 ? "Xuất sắc" : report.overallScore >= 50 ? "Khá / Đạt yêu cầu" : "Cần hoàn thiện thêm"}
                                    </Badge>
                                </div>
                            </div>

                            <div className={styles.scoreBreakdownGrid}>
                                <div className={styles.scoreItem}>
                                    <div className={styles.scoreItemTitle}>Mức độ đóng góp thực tế (Max 35)</div>
                                    <div className={styles.scoreItemValue}>{report.contributionScore} đ</div>
                                </div>
                                <div className={styles.scoreItem}>
                                    <div className={styles.scoreItemTitle}>Quy chuẩn kỹ thuật & Clean Code (Max 30)</div>
                                    <div className={styles.scoreItemValue}>{report.bestPracticeScore} đ</div>
                                </div>
                                <div className={styles.scoreItem}>
                                    <div className={styles.scoreItemTitle}>Tính liên tục & Kỷ luật (Max 20)</div>
                                    <div className={styles.scoreItemValue}>{report.consistencyScore} đ</div>
                                </div>
                                <div className={styles.scoreItem}>
                                    <div className={styles.scoreItemTitle}>Quy mô & Đa dạng công nghệ (Max 15)</div>
                                    <div className={styles.scoreItemValue}>{report.complexityScore} đ</div>
                                </div>
                            </div>
                        </div>

                        {/* Nhận xét AI / Insights */}
                        {summary && (
                            <div className={styles.insightsSection}>
                                {summary.strengths && summary.strengths.length > 0 && (
                                    <div className={styles.insightGroup}>
                                        <h5>Điểm mạnh nổi bật:</h5>
                                        <div className={styles.tagList}>
                                            {summary.strengths.map((str: string, idx: number) => (
                                                <div key={idx} className={styles.tagSuccess}>
                                                    <Check size={14} />
                                                    <span>{str}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {summary.weaknesses && summary.weaknesses.length > 0 && (
                                    <div className={styles.insightGroup}>
                                        <h5>Điểm cần cải thiện:</h5>
                                        <div className={styles.tagList}>
                                            {summary.weaknesses.map((w: string, idx: number) => (
                                                <div key={idx} className={styles.tagWarning}>
                                                    <X size={14} />
                                                    <span>{w}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {summary.recommendation && (
                                    <div className={styles.recommendationBox}>
                                        <strong>Đánh giá tổng quan: </strong>
                                        {summary.recommendation}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Bảng chi tiết từng Repository được chọn */}
                        <div style={{ marginTop: 28 }}>
                            <h4 style={{ margin: "0 0 12px 0", fontSize: 16 }}>Chi tiết các Repository đã đánh giá:</h4>
                            <table className={styles.evaluatedTable}>
                                <thead>
                                    <tr>
                                        <th>Tên Repository</th>
                                        <th>Ngôn ngữ</th>
                                        <th>Tỷ lệ Commit</th>
                                        <th>README</th>
                                        <th>Unit Test</th>
                                        <th>CI / CD</th>
                                        <th>Điểm Repo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {repos
                                        .filter((r) => r.isSelected)
                                        .map((r) => (
                                            <tr key={r.id}>
                                                <td>
                                                    <a
                                                        href={r.repoUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}
                                                    >
                                                        {r.repoName}
                                                        <ExternalLink size={12} />
                                                    </a>
                                                </td>
                                                <td>{r.primaryLanguage || "N/A"}</td>
                                                <td>{r.candidateCommitRatio ? `${Math.round(r.candidateCommitRatio * 100)}%` : "100%"}</td>
                                                <td className={r.hasReadme ? styles.checkYes : styles.checkNo}>
                                                    {r.hasReadme ? "✓ Có" : "— Chưa"}
                                                </td>
                                                <td className={r.hasTests ? styles.checkYes : styles.checkNo}>
                                                    {r.hasTests ? "✓ Có" : "— Chưa"}
                                                </td>
                                                <td className={r.hasCiCd ? styles.checkYes : styles.checkNo}>
                                                    {r.hasCiCd ? "✓ Có" : "— Chưa"}
                                                </td>
                                                <td style={{ fontWeight: 700, color: "var(--color-primary)" }}>
                                                    {r.repoScore ? `${r.repoScore} đ` : "—"}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
