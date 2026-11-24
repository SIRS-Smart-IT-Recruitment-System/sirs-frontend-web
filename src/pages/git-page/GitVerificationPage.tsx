import { useEffect, useState, useRef, useMemo } from "react";
import {
    GitFork,
    Star,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    CheckSquare,
    Square,
    Sparkles,
    Code,
    Check,
    Search,
    ArrowLeft,
    TrendingUp,
    Clock,
    Layers,
    FileText,
    ShieldCheck,
    Award,
    Printer,
    Zap,
    BookOpen,
    HelpCircle,
    SlidersHorizontal,
} from "lucide-react";
import MainLayout from "../../layouts/templates/main-layout/MainLayout";
import Button from "../../components/common/button/Button";
import Input from "../../components/common/input/Input";
import Spinner from "../../components/common/spinner/Spinner";
import Badge from "../../components/common/badge/Badge";
import { getCandidateProfile } from "../../services/candidateProfileService";
import { gitAnalysisService } from "../../services/gitAnalysisService";
import type {
    GithubAccount,
    GithubRepository,
    GitVerificationReport,
} from "../../services/gitAnalysisService";
import styles from "./GitVerificationPage.module.css";

type StepType = "connect" | "select" | "report";

// Bảng màu ngôn ngữ lập trình chuẩn GitHub
const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Java: "#b07219",
    Python: "#3572A5",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#178600",
    Go: "#00ADD8",
    Rust: "#dea584",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Kotlin: "#A97BFF",
    Swift: "#F05138",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Vue: "#41b883",
};

export default function GitVerificationPage() {
    const [candidateId, setCandidateId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Quản lý Tab hiện tại
    const [currentStep, setCurrentStep] = useState<StepType>("connect");

    // Trạng thái tài khoản GitHub
    const [account, setAccount] = useState<GithubAccount | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Form kết nối thủ công (dự phòng)
    const [showManualForm, setShowManualForm] = useState(false);
    const [githubUsername, setGithubUsername] = useState("");
    const [accessToken, setAccessToken] = useState("");

    // Danh sách Repos & Report
    const [repos, setRepos] = useState<GithubRepository[]>([]);
    const [selectedRepoIds, setSelectedRepoIds] = useState<string[]>([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>("ALL");
    const [report, setReport] = useState<GitVerificationReport | null>(null);

    const hasProcessedCode = useRef(false);

    // 1. Khởi tạo: Lấy profile ứng viên và kiểm tra OAuth Code trên URL nếu có
    useEffect(() => {
        const init = async () => {
            try {
                setIsLoading(true);
                const profile = await getCandidateProfile();
                if (profile && profile.candidateId) {
                    setCandidateId(profile.candidateId);

                    // Kiểm tra xem có `?code=` từ GitHub OAuth redirect về không
                    const searchParams = new URLSearchParams(window.location.search);
                    const code = searchParams.get("code");

                    if (code && !hasProcessedCode.current) {
                        hasProcessedCode.current = true;
                        window.history.replaceState({}, document.title, window.location.pathname);
                        await handleOAuthCallback(profile.candidateId, code);
                    } else {
                        await loadData(profile.candidateId);
                    }
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

    // Xử lý khi có OAuth callback code từ GitHub
    const handleOAuthCallback = async (cId: string, code: string) => {
        try {
            setIsSyncing(true);
            setError(null);
            const res = await gitAnalysisService.handleOAuthCallback(cId, code);
            if (res) {
                setAccount(res.account);
                setIsConnected(true);
                setRepos(res.repositories || []);
                const selected = (res.repositories || []).filter((r) => r.isSelected).map((r) => r.id);
                setSelectedRepoIds(selected);
                setSuccessMessage("Kết nối thành công với GitHub! Hãy chọn tối đa 5 repositories tiêu biểu.");
                setCurrentStep("select");
            }
        } catch (err: any) {
            console.error(err);
            setError("Ủy quyền GitHub thất bại hoặc mã xác thực đã hết hạn. Vui lòng thử lại.");
            await loadData(cId);
        } finally {
            setIsSyncing(false);
        }
    };

    // Tải dữ liệu ban đầu
    const loadData = async (cId: string) => {
        try {
            let hasRepos = false;
            let hasReport = false;

            // Lấy danh sách repos
            try {
                const repoData = await gitAnalysisService.getRepositories(cId);
                if (repoData && repoData.length > 0) {
                    setRepos(repoData);
                    setIsConnected(true);
                    hasRepos = true;
                    const selected = repoData.filter((r) => r.isSelected).map((r) => r.id);
                    setSelectedRepoIds(selected);
                }
            } catch {
                // Chưa có repos
            }

            // Lấy báo cáo mới nhất nếu có
            try {
                const repData = await gitAnalysisService.getLatestReport(cId);
                if (repData && repData.overallScore !== undefined) {
                    setReport(repData);
                    hasReport = true;
                }
            } catch {
                // Chưa có báo cáo
            }

            // Tự động chuyển Tab phù hợp theo trạng thái
            if (hasReport) {
                setCurrentStep("report");
            } else if (hasRepos) {
                setCurrentStep("select");
            } else {
                setCurrentStep("connect");
            }
        } catch (e) {
            console.error(e);
        }
    };

    // 1-Click Kết nối trực tiếp qua GitHub OAuth
    const handleConnectOAuth = async () => {
        try {
            setError(null);
            setIsSyncing(true);
            const res = await gitAnalysisService.getOAuthAuthorizeUrl();
            if (res?.authorizeUrl) {
                window.location.href = res.authorizeUrl;
            } else {
                throw new Error("Không nhận được URL ủy quyền từ hệ thống.");
            }
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || err.message || "Chưa cấu hình GitHub OAuth trên server.";
            setError(`${msg} Bạn có thể kết nối tạm bằng Personal Access Token bên dưới.`);
            setShowManualForm(true);
            setIsSyncing(false);
        }
    };

    // Kết nối bằng Personal Access Token (dự phòng)
    const handleConnectManual = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!candidateId || !githubUsername.trim() || !accessToken.trim()) return;

        try {
            setIsSyncing(true);
            setError(null);
            const accData = await gitAnalysisService.connectGithub(candidateId, githubUsername.trim(), accessToken.trim());
            setAccount(accData);
            setIsConnected(true);
            setSuccessMessage("Kết nối tài khoản GitHub thành công!");

            // Tự động đồng bộ repos
            const syncRepos = await gitAnalysisService.syncRepositories(candidateId);
            setRepos(syncRepos || []);
            setCurrentStep("select");
        } catch (err: any) {
            console.error(err);
            setError("Kết nối thất bại. Vui lòng kiểm tra lại Username và Access Token.");
        } finally {
            setIsSyncing(false);
        }
    };

    // Đồng bộ lại Repositories từ GitHub
    const handleSyncRepos = async () => {
        if (!candidateId) return;
        try {
            setIsSyncing(true);
            setError(null);
            const syncRepos = await gitAnalysisService.syncRepositories(candidateId);
            setRepos(syncRepos || []);
            setSuccessMessage("Đã đồng bộ danh sách repository mới nhất từ GitHub!");
        } catch (err: any) {
            setError("Đồng bộ thất bại. Vui lòng thử lại sau.");
        } finally {
            setIsSyncing(false);
        }
    };

    // Chọn / bỏ chọn repository (tối đa 5)
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

    // Kích hoạt phân tích & chấm điểm
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
            const reportData = await gitAnalysisService.analyzeGit(candidateId);
            setReport(reportData);
            setSuccessMessage("Phân tích và chấm điểm hoàn tất!");

            // Tải lại repo để cập nhật điểm riêng từng repo
            const repoData = await gitAnalysisService.getRepositories(candidateId);
            setRepos(repoData || []);

            // Tự động chuyển sang xem báo cáo
            setCurrentStep("report");
        } catch (err: any) {
            console.error(err);
            setError("Có lỗi trong quá trình phân tích. Vui lòng thử lại.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Trích xuất danh sách các ngôn ngữ có trong repos để làm bộ lọc
    const availableLanguages = useMemo(() => {
        const langs = new Set<string>();
        repos.forEach((r) => {
            if (r.primaryLanguage) langs.add(r.primaryLanguage);
        });
        return Array.from(langs);
    }, [repos]);

    // Lọc repos theo từ khóa và ngôn ngữ
    const filteredRepos = useMemo(() => {
        return repos.filter((r) => {
            const matchesKeyword =
                r.repoName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                (r.description && r.description.toLowerCase().includes(searchKeyword.toLowerCase()));
            const matchesLang =
                selectedLanguageFilter === "ALL" || r.primaryLanguage === selectedLanguageFilter;
            return matchesKeyword && matchesLang;
        });
    }, [repos, searchKeyword, selectedLanguageFilter]);

    // Parse summary JSON
    const parseSummary = (jsonStr?: string) => {
        if (!jsonStr) return { strengths: [], weaknesses: [], recommendation: "" };
        try {
            return JSON.parse(jsonStr);
        } catch {
            return { strengths: [], weaknesses: [], recommendation: "" };
        }
    };

    const summary = report ? parseSummary(report.summaryJson) : null;

    // Helper xác định xếp hạng năng lực
    const getPerformanceTier = (score: number) => {
        if (score >= 85) {
            return { label: "🏆 Xuất sắc (Top Tier Contributor)", className: styles.tierExpert, color: "#10B981" };
        }
        if (score >= 70) {
            return { label: "⭐ Năng lực Tốt (Advanced Standard)", className: styles.tierAdvanced, color: "#3B82F6" };
        }
        if (score >= 50) {
            return { label: "⚡ Tiềm năng (Proficient Standard)", className: styles.tierProficient, color: "#F59E0B" };
        }
        return { label: "🌱 Cần rèn luyện thêm (Developing)", className: styles.tierDeveloping, color: "#94A3B8" };
    };

    if (isLoading) {
        return (
            <MainLayout role="candidate">
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "65vh" }}>
                    <Spinner size="lg" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout role="candidate">
            <div className={styles.page}>
                {/* 1. HERO BANNER */}
                <div className={styles.heroBanner}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroBadge}>
                            <Sparkles size={13} />
                            SIRS Git Scoring Engine v2.0
                        </div>
                        <h1 className={styles.heroTitle}>
                            <Code size={28} color="#60A5FA" />
                            Xác thực & Chấm điểm Năng lực Kỹ thuật Git
                        </h1>
                        <p className={styles.heroDesc}>
                            Hệ thống đo lường khách quan quy chuẩn mã nguồn, tỷ lệ commit thực tế, tính kỷ luật dự án và độ đa dạng công nghệ để tạo báo cáo năng lực cho Nhà tuyển dụng.
                        </p>
                    </div>

                    <div className={styles.heroActions}>
                        {isConnected ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div className={styles.connectedStatusPill}>
                                    {account?.avatarUrl && (
                                        <img src={account.avatarUrl} alt="Avatar" className={styles.connectedAvatar} />
                                    )}
                                    <div className={styles.connectedText}>
                                        <span className={styles.connectedLabel}>Đã liên kết</span>
                                        <span className={styles.connectedUser}>@{account?.githubUsername || "GitHub User"}</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className={styles.resyncBtn}
                                    onClick={handleSyncRepos}
                                    disabled={isSyncing}
                                >
                                    <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
                                    {isSyncing ? "Đang đồng bộ..." : "Đồng bộ lại"}
                                </button>
                            </div>
                        ) : (
                            <div className={styles.connectedStatusPill} style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)" }}>
                                <ShieldCheck size={18} color="#93C5FD" />
                                <span style={{ fontSize: 13, color: "#E2E8F0" }}>Chưa liên kết tài khoản GitHub</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. STEPPER NAVIGATION TABS */}
                <div className={styles.stepperContainer}>
                    <button
                        type="button"
                        className={`${styles.stepTab} ${currentStep === "connect" ? styles.stepTabActive : ""} ${isConnected ? styles.stepTabCompleted : ""}`}
                        onClick={() => setCurrentStep("connect")}
                    >
                        <span className={styles.stepNumber}>
                            {isConnected ? <Check size={14} /> : "1"}
                        </span>
                        <span>1. Liên kết GitHub</span>
                    </button>

                    <button
                        type="button"
                        className={`${styles.stepTab} ${currentStep === "select" ? styles.stepTabActive : ""} ${selectedRepoIds.length > 0 && report ? styles.stepTabCompleted : ""}`}
                        onClick={() => setCurrentStep("select")}
                        disabled={!isConnected}
                    >
                        <span className={styles.stepNumber}>
                            {selectedRepoIds.length > 0 && report ? <Check size={14} /> : "2"}
                        </span>
                        <span>2. Chọn Repository tiêu biểu ({selectedRepoIds.length}/5)</span>
                    </button>

                    <button
                        type="button"
                        className={`${styles.stepTab} ${currentStep === "report" ? styles.stepTabActive : ""}`}
                        onClick={() => setCurrentStep("report")}
                        disabled={!report}
                    >
                        <span className={styles.stepNumber}>
                            {report ? <Award size={14} /> : "3"}
                        </span>
                        <span>3. Báo cáo & Điểm số</span>
                    </button>
                </div>

                {/* Alerts */}
                {error && (
                    <div className={styles.alertError}>
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}
                {successMessage && (
                    <div className={styles.alertSuccess}>
                        <CheckCircle2 size={20} />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* =========================================================================
                   BƯỚC 1: LIÊN KẾT GITHUB (SPLIT MODERN LAYOUT)
                ========================================================================= */}
                {currentStep === "connect" && (
                    <div className={styles.connectSplitLayout}>
                        {/* Cột trái: Giá trị & Lợi ích */}
                        <div className={styles.connectFeaturePanel}>
                            <div className={styles.featurePanelHeader}>
                                <h3>Tại sao cần Xác thực & Chấm điểm Git?</h3>
                                <p>
                                    Thay vì chỉ đánh giá ứng viên qua CV chữ tĩnh, SIRS kết nối trực tiếp với hoạt động mã nguồn thực tế để nhà tuyển dụng xác minh năng lực cốt lõi.
                                </p>
                            </div>

                            <div className={styles.featureList}>
                                <div className={styles.featureItem}>
                                    <div className={`${styles.featureIconWrap} ${styles.featureIconBlue}`}>
                                        <TrendingUp size={20} />
                                    </div>
                                    <div className={styles.featureItemText}>
                                        <h5>Xác thực Tác giả & Tỷ lệ Commit Thật</h5>
                                        <p>Loại bỏ các repository clone hoặc fork mà không có đóng góp thực sự, chỉ tính điểm cho commit cá nhân bạn tạo ra.</p>
                                    </div>
                                </div>

                                <div className={styles.featureItem}>
                                    <div className={`${styles.featureIconWrap} ${styles.featureIconGreen}`}>
                                        <Zap size={20} />
                                    </div>
                                    <div className={styles.featureItemText}>
                                        <h5>Quy chuẩn Lập trình Chuyên nghiệp</h5>
                                        <p>Kiểm tra tự động cấu trúc tài liệu README, bộ Unit Test, hệ thống CI/CD Automation và format Conventional Commits.</p>
                                    </div>
                                </div>

                                <div className={styles.featureItem}>
                                    <div className={`${styles.featureIconWrap} ${styles.featureIconPurple}`}>
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div className={styles.featureItemText}>
                                        <h5>Bảo mật Tuyệt đối qua OAuth 2.0</h5>
                                        <p>SIRS chỉ quét metadata công khai từ GitHub API v2022-11-28, không lưu trữ mã nguồn và không can thiệp vào kho riêng tư của bạn.</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748B" }}>
                                <HelpCircle size={16} />
                                <span>Thời gian quét và phân tích metadata chỉ mất từ 3 đến 5 giây.</span>
                            </div>
                        </div>

                        {/* Cột phải: Form kích hoạt OAuth & PAT */}
                        <div className={styles.connectActionCard}>
                            <div className={styles.githubLogoGlow}>
                                <svg height="38" width="38" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                                </svg>
                            </div>

                            <h4 className={styles.actionCardTitle}>Ủy quyền Tài khoản GitHub</h4>
                            <p className={styles.actionCardDesc}>
                                Nhấn nút bên dưới để ủy quyền bảo mật thông qua GitHub. Hệ thống sẽ tự động đồng bộ danh sách dự án của bạn.
                            </p>

                            <button
                                type="button"
                                className={styles.oauthPrimaryBtn}
                                onClick={handleConnectOAuth}
                                disabled={isSyncing}
                            >
                                <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                                </svg>
                                {isSyncing ? "Đang xử lý kết nối..." : "Ủy quyền trực tiếp qua GitHub"}
                            </button>

                            <div className={styles.securityNote}>
                                <ShieldCheck size={16} />
                                <span>OAuth 2.0 Encrypted Handshake • Read-only Metadata</span>
                            </div>

                            {/* Tùy chọn nhập PAT dự phòng */}
                            <button
                                type="button"
                                className={styles.manualToggleBtn}
                                onClick={() => setShowManualForm(!showManualForm)}
                            >
                                {showManualForm ? "Ẩn tùy chọn Personal Access Token" : "Hoặc kết nối bằng Personal Access Token thủ công"}
                            </button>

                            {showManualForm && (
                                <form onSubmit={handleConnectManual} style={{ width: "100%", maxWidth: 360, marginTop: 20, textAlign: "left" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                        <Input
                                            label="GitHub Username"
                                            placeholder="vd: torvalds"
                                            value={githubUsername}
                                            onChange={(e) => setGithubUsername(e.target.value)}
                                            required
                                        />
                                        <div>
                                            <Input
                                                label="Personal Access Token (classic)"
                                                type="password"
                                                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                                value={accessToken}
                                                onChange={(e) => setAccessToken(e.target.value)}
                                                required
                                            />
                                            <span style={{ fontSize: 11, color: "#64748B", display: "block", marginTop: 4 }}>
                                                Yêu cầu scopes tối thiểu: <code>read:user, repo</code>
                                            </span>
                                        </div>
                                        <Button variant="primary" type="submit" disabled={isSyncing}>
                                            {isSyncing ? "Đang kết nối..." : "Xác nhận kết nối PAT"}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                {/* =========================================================================
                   BƯỚC 2: CHỌN REPOSITORIES TIÊU BIỂU
                ========================================================================= */}
                {currentStep === "select" && (
                    <>
                        {/* Account Bar with Avatar & Segmented Capacity Widget */}
                        <div className={styles.accountBar}>
                            <div className={styles.accountLeft}>
                                {account?.avatarUrl ? (
                                    <img src={account.avatarUrl} alt="Avatar" className={styles.accountAvatar} />
                                ) : (
                                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#0F172A", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Code size={24} />
                                    </div>
                                )}
                                <div className={styles.accountDetails}>
                                    <h4>
                                        @{account?.githubUsername || "GitHub User"}
                                        {account?.profileUrl && (
                                            <a href={account.profileUrl} target="_blank" rel="noreferrer" style={{ color: "#2563EB" }}>
                                                <ExternalLink size={13} />
                                            </a>
                                        )}
                                    </h4>
                                    <p>Tổng cộng: <strong>{repos.length}</strong> repositories công khai được đồng bộ</p>
                                </div>
                            </div>

                            {/* Capacity segmented progress bar (1..5 repos) */}
                            <div className={styles.capacityWidget}>
                                <span className={styles.capacityText}>
                                    Đã chọn: <strong>{selectedRepoIds.length}</strong> / 5 dự án
                                </span>
                                <div className={styles.capacitySegments}>
                                    {[0, 1, 2, 3, 4].map((idx) => {
                                        const isFilled = idx < selectedRepoIds.length;
                                        const isMax = selectedRepoIds.length === 5;
                                        return (
                                            <div
                                                key={idx}
                                                className={`${styles.capacitySegment} ${isFilled ? (isMax ? styles.capacitySegmentMax : styles.capacitySegmentFilled) : ""}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Search Toolbar & Language Filter Chips */}
                        <div className={styles.repoToolbar}>
                            <div className={styles.searchBox}>
                                <Search size={18} className={styles.searchIcon} />
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder="Tìm repository theo tên hoặc từ khóa..."
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />
                            </div>

                            {/* Language Pills */}
                            <div className={styles.languageFilterRow}>
                                <SlidersHorizontal size={16} color="#64748B" style={{ marginRight: 4 }} />
                                <button
                                    type="button"
                                    className={`${styles.filterPill} ${selectedLanguageFilter === "ALL" ? styles.filterPillActive : ""}`}
                                    onClick={() => setSelectedLanguageFilter("ALL")}
                                >
                                    Tất cả ({repos.length})
                                </button>
                                {availableLanguages.map((lang) => (
                                    <button
                                        key={lang}
                                        type="button"
                                        className={`${styles.filterPill} ${selectedLanguageFilter === lang ? styles.filterPillActive : ""}`}
                                        onClick={() => setSelectedLanguageFilter(lang)}
                                    >
                                        <span
                                            className={styles.langDot}
                                            style={{ backgroundColor: LANGUAGE_COLORS[lang] || "#64748B", display: "inline-block", marginRight: 6 }}
                                        />
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Repositories Grid */}
                        {filteredRepos.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "64px 24px", background: "#FFFFFF", borderRadius: 16, border: "1px solid var(--color-border-light, #E2E8F0)" }}>
                                <p style={{ color: "#64748B", fontSize: 15, margin: 0 }}>
                                    Không tìm thấy repository nào khớp với bộ lọc hoặc từ khóa tìm kiếm.
                                </p>
                            </div>
                        ) : (
                            <div className={styles.repoGrid}>
                                {filteredRepos.map((repo) => {
                                    const isSel = selectedRepoIds.includes(repo.id);
                                    const dotColor = LANGUAGE_COLORS[repo.primaryLanguage || ""] || "#94A3B8";
                                    return (
                                        <div
                                            key={repo.id}
                                            className={`${styles.repoCard} ${isSel ? styles.repoCardSelected : ""}`}
                                            onClick={() => toggleSelectRepo(repo.id)}
                                        >
                                            <div>
                                                <div className={styles.repoTop}>
                                                    <span className={styles.repoName}>
                                                        <FileText size={17} color={isSel ? "#2563EB" : "#64748B"} />
                                                        {repo.repoName}
                                                    </span>
                                                    {isSel ? (
                                                        <CheckSquare size={22} color="#2563EB" />
                                                    ) : (
                                                        <Square size={22} color="#CBD5E1" />
                                                    )}
                                                </div>
                                                <p className={styles.repoDesc}>
                                                    {repo.description || "Không có mô tả cho repository này."}
                                                </p>
                                            </div>

                                            <div className={styles.repoMetaRow}>
                                                <div className={styles.langDotPill}>
                                                    {repo.primaryLanguage ? (
                                                        <>
                                                            <span className={styles.langDot} style={{ backgroundColor: dotColor }} />
                                                            <span>{repo.primaryLanguage}</span>
                                                        </>
                                                    ) : (
                                                        <span>Khác</span>
                                                    )}
                                                    {repo.isFork && (
                                                        <Badge variant="warning" size="sm">Fork</Badge>
                                                    )}
                                                </div>

                                                <div className={styles.repoStats}>
                                                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                        <Star size={13} /> {repo.starsCount || 0}
                                                    </span>
                                                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                        <GitFork size={13} /> {repo.forksCount || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Floating Action Dock at the bottom */}
                        <div className={styles.bottomDock}>
                            <div className={styles.dockInfo}>
                                <span className={styles.dockBadge}>
                                    {selectedRepoIds.length} / 5
                                </span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                                        {selectedRepoIds.length === 0
                                            ? "Chưa chọn repository nào"
                                            : `Đã chọn ${selectedRepoIds.length} repository tiêu biểu`}
                                    </div>
                                    <div style={{ fontSize: 12, color: "#94A3B8" }}>
                                        Hãy chọn các dự án có nhiều commit cá nhân và test để đạt điểm cao nhất
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className={styles.analyzeActionBtn}
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || selectedRepoIds.length === 0}
                            >
                                <Sparkles size={18} />
                                {isAnalyzing ? "Đang quét metadata & Tính điểm..." : "Bắt đầu Phân tích & Chấm điểm"}
                            </button>
                        </div>
                    </>
                )}

                {/* =========================================================================
                   BƯỚC 3: EXECUTIVE SCORECARD DASHBOARD
                ========================================================================= */}
                {currentStep === "report" && report && (
                    <>
                        {/* Top Action Row */}
                        <div className={styles.reportHeaderRow}>
                            <Button variant="outline" onClick={() => setCurrentStep("select")}>
                                <ArrowLeft size={16} style={{ marginRight: 6 }} />
                                Đổi Repositories & Chấm lại
                            </Button>

                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ fontSize: 13, color: "#64748B" }}>
                                    Cập nhật lúc: {new Date(report.analyzedAt).toLocaleString("vi-VN")}
                                </span>
                                <Button variant="outline" onClick={() => window.print()}>
                                    <Printer size={15} style={{ marginRight: 6 }} />
                                    In Báo cáo
                                </Button>
                            </div>
                        </div>

                        {/* Executive Scorecard Hero Banner */}
                        {(() => {
                            const tier = getPerformanceTier(report.overallScore);
                            const radius = 64;
                            const circumference = 2 * Math.PI * radius;
                            const strokeDashoffset = circumference - (report.overallScore / 100) * circumference;

                            return (
                                <div className={styles.scorecardHero}>
                                    {/* Radial SVG Gauge */}
                                    <div className={styles.gaugeContainer}>
                                        <svg className={styles.gaugeSvg} width="160" height="160" viewBox="0 0 160 160">
                                            <defs>
                                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#3B82F6" />
                                                    <stop offset="100%" stopColor="#10B981" />
                                                </linearGradient>
                                            </defs>
                                            <circle
                                                className={styles.gaugeBg}
                                                cx="80"
                                                cy="80"
                                                r={radius}
                                            />
                                            <circle
                                                className={styles.gaugeFill}
                                                cx="80"
                                                cy="80"
                                                r={radius}
                                                strokeDasharray={circumference}
                                                strokeDashoffset={strokeDashoffset}
                                            />
                                        </svg>
                                        <div className={styles.gaugeTextWrap}>
                                            <span className={styles.gaugeNumber}>{report.overallScore}</span>
                                            <span className={styles.gaugeOutOf}>THANG ĐIỂM 100</span>
                                        </div>
                                    </div>

                                    {/* Center Meta Info */}
                                    <div className={styles.heroMetaColumn}>
                                        <div className={`${styles.rankBadgeTier} ${tier.className}`}>
                                            {tier.label}
                                        </div>
                                        <h2 className={styles.heroMetaTitle}>Chỉ số Năng lực Kỹ thuật Git</h2>
                                        <p className={styles.heroMetaDesc}>
                                            Điểm số tổng hợp được phân tích tự động từ metadata của <strong>{report.evaluatedRepositories?.length || selectedRepoIds.length}</strong> repository tiêu biểu trên GitHub của bạn.
                                        </p>
                                    </div>

                                    {/* Quick Stats Box */}
                                    <div className={styles.quickStatsBox}>
                                        <div className={styles.quickStatItem}>
                                            <span className={styles.quickStatLabel}>Dự án đánh giá:</span>
                                            <span className={styles.quickStatVal}>{report.evaluatedRepositories?.length || selectedRepoIds.length} Repos</span>
                                        </div>
                                        <div className={styles.quickStatItem}>
                                            <span className={styles.quickStatLabel}>Trạng thái:</span>
                                            <span className={styles.quickStatVal} style={{ color: "#10B981" }}>ĐÃ XÁC THỰC</span>
                                        </div>
                                        <div className={styles.quickStatItem}>
                                            <span className={styles.quickStatLabel}>Cấp độ kỹ thuật:</span>
                                            <span className={styles.quickStatVal} style={{ color: tier.color }}>
                                                {report.overallScore >= 80 ? "Senior Level" : report.overallScore >= 60 ? "Middle Level" : "Junior Level"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* 4 Deep-Dive Metric Cards */}
                        <div className={styles.metricsGrid}>
                            {/* Tiêu chí 1: Đóng góp thực tế */}
                            <div className={styles.metricCard}>
                                <div className={styles.metricTopBorder} style={{ background: "#2563EB" }} />
                                <div>
                                    <div className={styles.metricHeader}>
                                        <span className={styles.metricTitle}>1. Đóng góp thực tế</span>
                                        <div className={styles.metricIconWrap} style={{ background: "#EFF6FF", color: "#2563EB" }}>
                                            <TrendingUp size={20} />
                                        </div>
                                    </div>
                                    <div className={styles.metricValueWrap}>
                                        <span className={styles.metricBigScore}>{report.contributionScore}</span>
                                        <span className={styles.metricMaxScore}>/ 35 đ</span>
                                    </div>
                                </div>
                                <div>
                                    <div className={styles.metricBarTrack}>
                                        <div
                                            className={styles.metricBarFill}
                                            style={{ width: `${(report.contributionScore / 35) * 100}%`, backgroundColor: "#2563EB" }}
                                        />
                                    </div>
                                    <p className={styles.metricDescNote} style={{ marginTop: 8 }}>
                                        Tỷ lệ commits cá nhân thực tế do chính bạn đóng góp vào các repositories.
                                    </p>
                                </div>
                            </div>

                            {/* Tiêu chí 2: Quy chuẩn kỹ thuật */}
                            <div className={styles.metricCard}>
                                <div className={styles.metricTopBorder} style={{ background: "#10B981" }} />
                                <div>
                                    <div className={styles.metricHeader}>
                                        <span className={styles.metricTitle}>2. Chuẩn Best Practices</span>
                                        <div className={styles.metricIconWrap} style={{ background: "#ECFDF5", color: "#10B981" }}>
                                            <ShieldCheck size={20} />
                                        </div>
                                    </div>
                                    <div className={styles.metricValueWrap}>
                                        <span className={styles.metricBigScore}>{report.bestPracticeScore}</span>
                                        <span className={styles.metricMaxScore}>/ 30 đ</span>
                                    </div>
                                </div>
                                <div>
                                    <div className={styles.metricBarTrack}>
                                        <div
                                            className={styles.metricBarFill}
                                            style={{ width: `${(report.bestPracticeScore / 30) * 100}%`, backgroundColor: "#10B981" }}
                                        />
                                    </div>
                                    <p className={styles.metricDescNote} style={{ marginTop: 8 }}>
                                        README tài liệu, cấu trúc Unit Test, CI/CD Actions và quy chuẩn Conventional Commits.
                                    </p>
                                </div>
                            </div>

                            {/* Tiêu chí 3: Tính kỷ luật & Đều đặn */}
                            <div className={styles.metricCard}>
                                <div className={styles.metricTopBorder} style={{ background: "#F59E0B" }} />
                                <div>
                                    <div className={styles.metricHeader}>
                                        <span className={styles.metricTitle}>3. Kỷ luật & Đều đặn</span>
                                        <div className={styles.metricIconWrap} style={{ background: "#FFFBEB", color: "#F59E0B" }}>
                                            <Clock size={20} />
                                        </div>
                                    </div>
                                    <div className={styles.metricValueWrap}>
                                        <span className={styles.metricBigScore}>{report.consistencyScore}</span>
                                        <span className={styles.metricMaxScore}>/ 20 đ</span>
                                    </div>
                                </div>
                                <div>
                                    <div className={styles.metricBarTrack}>
                                        <div
                                            className={styles.metricBarFill}
                                            style={{ width: `${(report.consistencyScore / 20) * 100}%`, backgroundColor: "#F59E0B" }}
                                        />
                                    </div>
                                    <p className={styles.metricDescNote} style={{ marginTop: 8 }}>
                                        Mức độ thường xuyên cập nhật và duy trì code trong 3 - 12 tháng gần nhất.
                                    </p>
                                </div>
                            </div>

                            {/* Tiêu chí 4: Quy mô & Đa dạng */}
                            <div className={styles.metricCard}>
                                <div className={styles.metricTopBorder} style={{ background: "#8B5CF6" }} />
                                <div>
                                    <div className={styles.metricHeader}>
                                        <span className={styles.metricTitle}>4. Quy mô & Đa dạng</span>
                                        <div className={styles.metricIconWrap} style={{ background: "#F5F3FF", color: "#8B5CF6" }}>
                                            <Layers size={20} />
                                        </div>
                                    </div>
                                    <div className={styles.metricValueWrap}>
                                        <span className={styles.metricBigScore}>{report.complexityScore}</span>
                                        <span className={styles.metricMaxScore}>/ 15 đ</span>
                                    </div>
                                </div>
                                <div>
                                    <div className={styles.metricBarTrack}>
                                        <div
                                            className={styles.metricBarFill}
                                            style={{ width: `${(report.complexityScore / 15) * 100}%`, backgroundColor: "#8B5CF6" }}
                                        />
                                    </div>
                                    <p className={styles.metricDescNote} style={{ marginTop: 8 }}>
                                        Độ đa dạng ngôn ngữ lập trình cùng sức hút cộng đồng qua Stars và Forks.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* AI Recruiter Insights Panel */}
                        {summary && (
                            <div className={styles.insightsCard}>
                                <h3 className={styles.insightsHeader}>
                                    <Sparkles size={20} color="#2563EB" />
                                    Phân tích Năng lực & Đánh giá từ Hệ thống
                                </h3>

                                <div className={styles.insightsTwoCol}>
                                    {/* Thế mạnh */}
                                    <div className={styles.insightBox}>
                                        <span className={styles.insightBoxTitle} style={{ color: "#10B981" }}>
                                            <CheckCircle2 size={16} />
                                            Thế mạnh nổi bật
                                        </span>
                                        {summary.strengths && summary.strengths.length > 0 ? (
                                            summary.strengths.map((str: string, idx: number) => (
                                                <div key={idx} className={styles.insightPillSuccess}>
                                                    <Check size={14} />
                                                    <span>{str}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span style={{ fontSize: 13, color: "#94A3B8" }}>Chưa ghi nhận điểm cộng đặc biệt.</span>
                                        )}
                                    </div>

                                    {/* Điểm cần cải thiện */}
                                    <div className={styles.insightBox}>
                                        <span className={styles.insightBoxTitle} style={{ color: "#F59E0B" }}>
                                            <TrendingUp size={16} />
                                            Khuyến nghị để nâng cao điểm số
                                        </span>
                                        {summary.weaknesses && summary.weaknesses.length > 0 ? (
                                            summary.weaknesses.map((w: string, idx: number) => (
                                                <div key={idx} className={styles.insightPillWarning}>
                                                    <BookOpen size={14} />
                                                    <span>{w}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span style={{ fontSize: 13, color: "#10B981" }}>Các dự án đều đáp ứng chuẩn mực rất tốt!</span>
                                        )}
                                    </div>
                                </div>

                                {/* Nhận xét tổng quan */}
                                {summary.recommendation && (
                                    <div className={styles.recommendationCard}>
                                        <strong>Nhận xét cho Nhà tuyển dụng / HR: </strong>
                                        {summary.recommendation}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Evaluated Repositories Table */}
                        <div className={styles.tableContainerCard}>
                            <h3 className={styles.tableTitle}>
                                Chi tiết {report.evaluatedRepositories?.length || selectedRepoIds.length} Repository được Chấm điểm
                            </h3>
                            <div style={{ overflowX: "auto" }}>
                                <table className={styles.detailTable}>
                                    <thead>
                                        <tr>
                                            <th>Repository</th>
                                            <th>Ngôn ngữ</th>
                                            <th>Tỷ lệ đóng góp cá nhân</th>
                                            <th>README</th>
                                            <th>Unit Test</th>
                                            <th>CI / CD</th>
                                            <th>Điểm Repo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(report.evaluatedRepositories || repos.filter((r) => r.isSelected)).map((r) => (
                                            <tr key={r.id}>
                                                <td>
                                                    <a
                                                        href={r.repoUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ color: "#2563EB", textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}
                                                    >
                                                        {r.repoName}
                                                        <ExternalLink size={12} />
                                                    </a>
                                                    {r.description && (
                                                        <span style={{ display: "block", fontSize: 12, color: "#64748B", marginTop: 2, maxWidth: 280, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            {r.description}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                                                        <span
                                                            className={styles.langDot}
                                                            style={{ backgroundColor: LANGUAGE_COLORS[r.primaryLanguage || ""] || "#94A3B8" }}
                                                        />
                                                        {r.primaryLanguage || "N/A"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong style={{ color: "#0F172A" }}>
                                                        {r.candidateCommitRatio ? `${Math.round(r.candidateCommitRatio * 100)}%` : "100%"}
                                                    </strong>
                                                    <span style={{ fontSize: 11, color: "#94A3B8", display: "block" }}>
                                                        ({r.candidateCommitCount || 0}/{r.totalCommitCount || 0} commits)
                                                    </span>
                                                </td>
                                                <td>
                                                    {r.hasReadme ? (
                                                        <span className={styles.statusCheck}><Check size={13} /> Có</span>
                                                    ) : (
                                                        <span className={styles.statusNone}>— Chưa</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {r.hasTests ? (
                                                        <span className={styles.statusCheck}><Check size={13} /> Có</span>
                                                    ) : (
                                                        <span className={styles.statusNone}>— Chưa</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {r.hasCiCd ? (
                                                        <span className={styles.statusCheck}><Check size={13} /> Có</span>
                                                    ) : (
                                                        <span className={styles.statusNone}>— Chưa</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span style={{ fontWeight: 800, fontSize: 16, color: "#2563EB" }}>
                                                        {r.repoScore ? `${r.repoScore} đ` : "—"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
}
