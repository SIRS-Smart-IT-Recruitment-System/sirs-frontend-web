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
    ChevronRight,
    SlidersHorizontal,
    BookOpen,
} from "lucide-react";
import MainLayout from "../../layouts/templates/main-layout/MainLayout";
import Spinner from "../../components/common/spinner/Spinner";
import Badge from "../../components/common/badge/Badge";
import Input from "../../components/common/input/Input";
import Button from "../../components/common/button/Button";
import { getCandidateProfile } from "../../services/candidateProfileService";
import { gitAnalysisService } from "../../services/gitAnalysisService";
import type {
    GithubAccount,
    GithubRepository,
    GitVerificationReport,
} from "../../services/gitAnalysisService";
import styles from "./GitVerificationPage.module.css";

type StepType = "connect" | "select" | "report";

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

    // Current Stepper Step
    const [currentStep, setCurrentStep] = useState<StepType>("connect");

    // GitHub account state
    const [account, setAccount] = useState<GithubAccount | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Manual PAT form fallback
    const [showManualForm, setShowManualForm] = useState(false);
    const [githubUsername, setGithubUsername] = useState("");
    const [accessToken, setAccessToken] = useState("");

    // Repositories & Report state
    const [repos, setRepos] = useState<GithubRepository[]>([]);
    const [selectedRepoIds, setSelectedRepoIds] = useState<string[]>([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>("ALL");
    const [report, setReport] = useState<GitVerificationReport | null>(null);

    const hasProcessedCode = useRef(false);

    // Initialize: load candidate profile & handle OAuth code from URL if present
    useEffect(() => {
        const init = async () => {
            try {
                setIsLoading(true);
                const profile = await getCandidateProfile();
                if (profile && profile.candidateId) {
                    setCandidateId(profile.candidateId);

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

    // Handle OAuth Callback from GitHub
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
                setCurrentStep("connect");
            }
        } catch (err: any) {
            console.error(err);
            setError("Ủy quyền GitHub thất bại hoặc mã xác thực đã hết hạn. Vui lòng thử lại.");
            await loadData(cId);
        } finally {
            setIsSyncing(false);
        }
    };

    // Load initial data
    const loadData = async (cId: string) => {
        try {
            let hasRepos = false;
            let hasReport = false;

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
                // Not connected yet
            }

            try {
                const repData = await gitAnalysisService.getLatestReport(cId);
                if (repData && repData.overallScore !== undefined) {
                    setReport(repData);
                    hasReport = true;
                }
            } catch {
                // No report yet
            }

            if (hasReport) {
                setCurrentStep("report");
            } else if (hasRepos) {
                // Stay on connect view to show the success card or select
                setCurrentStep("connect");
            } else {
                setCurrentStep("connect");
            }
        } catch (e) {
            console.error(e);
        }
    };

    // 1-Click OAuth Connect
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

    // Manual PAT connection
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

            const syncRepos = await gitAnalysisService.syncRepositories(candidateId);
            setRepos(syncRepos || []);
            setCurrentStep("connect");
        } catch (err: any) {
            console.error(err);
            setError("Kết nối thất bại. Vui lòng kiểm tra lại Username và Access Token.");
        } finally {
            setIsSyncing(false);
        }
    };

    // Re-sync repositories from GitHub
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

    // Toggle repository selection (max 5)
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

    // Analyze selected repositories
    const handleAnalyze = async () => {
        if (!candidateId) return;
        if (selectedRepoIds.length === 0) {
            alert("Vui lòng chọn ít nhất 1 repository để phân tích!");
            return;
        }

        try {
            setIsAnalyzing(true);
            setError(null);
            await gitAnalysisService.selectRepositories(candidateId, selectedRepoIds);
            const reportData = await gitAnalysisService.analyzeGit(candidateId);
            setReport(reportData);
            setSuccessMessage("Phân tích và chấm điểm hoàn tất!");

            const repoData = await gitAnalysisService.getRepositories(candidateId);
            setRepos(repoData || []);
            setCurrentStep("report");
        } catch (err: any) {
            console.error(err);
            setError("Có lỗi trong quá trình phân tích. Vui lòng thử lại.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Compute stats from candidate repos
    const totalStars = useMemo(() => {
        return repos.reduce((acc, r) => acc + (r.starsCount || 0), 0);
    }, [repos]);

    const totalForks = useMemo(() => {
        return repos.reduce((acc, r) => acc + (r.forksCount || 0), 0);
    }, [repos]);

    // Available languages for filter
    const availableLanguages = useMemo(() => {
        const langs = new Set<string>();
        repos.forEach((r) => {
            if (r.primaryLanguage) langs.add(r.primaryLanguage);
        });
        return Array.from(langs);
    }, [repos]);

    // Filtered repositories
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
                {/* 1. TOP VIBRANT HERO BANNER */}
                <div className={styles.heroBanner}>
                    <div className={styles.heroLeft}>
                        <div className={styles.heroGithubCircle}>
                            <svg height="40" width="40" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                            </svg>
                        </div>
                        <div className={styles.heroText}>
                            <h2>Xác thực & Chấm điểm Năng lực Git</h2>
                            <p>
                                Đánh giá quy chuẩn lập trình, tính kỷ luật commit và mức độ đóng góp thực tế trên GitHub của bạn.
                            </p>
                        </div>
                    </div>

                    {/* Right decorative isometric laptop & floating code badges */}
                    <div className={styles.heroIllustration}>
                        <div className={styles.laptopContainer}>
                            {/* Floating code chips */}
                            <div className={styles.floatingCodeBadge}>&lt;/&gt;</div>
                            <div className={styles.floatingHexBadge}>&lt;/&gt;</div>
                            <div className={styles.floatingDocCard}>
                                <div className={styles.docLine} style={{ width: 36 }} />
                                <div className={styles.docLine} style={{ width: 24 }} />
                                <div className={styles.docLine} style={{ width: 30 }} />
                            </div>

                            {/* Isometric Laptop Vector */}
                            <svg width="180" height="110" viewBox="0 0 180 110" fill="none">
                                {/* Base / Keyboard */}
                                <path d="M20 75L120 88L165 72L65 60L20 75Z" fill="#CBD5E1" />
                                <path d="M20 75L120 88L120 93L20 80L20 75Z" fill="#94A3B8" />
                                <path d="M120 88L165 72L165 77L120 93L120 88Z" fill="#64748B" />
                                {/* Screen Lid */}
                                <path d="M65 60L65 15L145 10L145 55L65 60Z" fill="#F8FAFC" />
                                <path d="M68 57L68 18L142 13L142 53L68 57Z" fill="#0F172A" />
                                {/* GitHub Logo on Laptop Screen */}
                                <circle cx="105" cy="35" r="14" fill="#1E293B" />
                                <path d="M105 25C99.48 25 95 29.48 95 35C95 39.42 97.87 43.17 101.84 44.49C102.34 44.58 102.52 44.27 102.52 44.01C102.52 43.77 102.51 42.98 102.51 42.15C99.73 42.75 99.14 40.94 99.14 40.94C98.69 39.79 98.03 39.48 98.03 39.48C97.12 38.86 98.1 38.87 98.1 38.87C99.1 38.94 99.63 39.9 99.63 39.9C100.52 41.43 101.96 40.99 102.53 40.73C102.62 40.08 102.88 39.64 103.17 39.39C100.95 39.14 98.62 38.28 98.62 34.45C98.62 33.36 99.01 32.47 99.65 31.77C99.55 31.52 99.2 30.5 99.75 29.13C99.75 29.13 100.59 28.87 102.5 30.16C103.3 29.94 104.15 29.83 105 29.83C105.85 29.83 106.7 29.94 107.5 30.16C109.41 28.87 110.25 29.13 110.25 29.13C110.8 30.5 110.45 31.52 110.35 31.77C110.99 32.47 111.38 33.36 111.38 34.45C111.38 38.29 109.04 39.14 106.82 39.39C107.18 39.7 107.49 40.3 107.49 41.24C107.49 42.58 107.48 43.66 107.48 44C107.48 44.26 107.66 44.58 108.16 44.48C112.13 43.16 115 39.42 115 35C115 29.48 110.52 25 105 25Z" fill="#FFFFFF" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 2. PROGRESS STEPPER BAR */}
                <div className={styles.stepperCard}>
                    {/* Step 1 */}
                    <button
                        type="button"
                        className={styles.stepItem}
                        onClick={() => setCurrentStep("connect")}
                    >
                        <div className={`${styles.stepCircle} ${isConnected ? styles.stepCircleDone : styles.stepCircleActive}`}>
                            {isConnected ? <Check size={16} /> : "1"}
                        </div>
                        <div className={styles.stepLabels}>
                            <span className={styles.stepTitle}>1. Liên kết GitHub</span>
                            <span className={isConnected ? styles.stepSubtextDone : styles.stepSubtextActive}>
                                {isConnected ? "Đã hoàn thành" : "Chưa hoàn thành"}
                            </span>
                        </div>
                    </button>

                    {/* Connector 1 */}
                    <div className={`${styles.stepperConnector} ${isConnected ? styles.connectorFilled : ""}`} />

                    {/* Step 2 */}
                    <button
                        type="button"
                        className={styles.stepItem}
                        onClick={() => setCurrentStep("select")}
                        disabled={!isConnected}
                    >
                        <div className={`${styles.stepCircle} ${currentStep === "select" ? styles.stepCircleActive : (selectedRepoIds.length > 0 && report ? styles.stepCircleDone : styles.stepCirclePending)}`}>
                            {selectedRepoIds.length > 0 && report ? <Check size={16} /> : "2"}
                        </div>
                        <div className={styles.stepLabels}>
                            <span className={styles.stepTitle}>
                                Chọn Repository tiêu biểu ({selectedRepoIds.length}/5)
                            </span>
                            <span className={currentStep === "select" ? styles.stepSubtextActive : (selectedRepoIds.length > 0 ? styles.stepSubtextDone : styles.stepSubtextPending)}>
                                {selectedRepoIds.length > 0 ? `Đã chọn ${selectedRepoIds.length} repo` : "Chưa chọn"}
                            </span>
                        </div>
                    </button>

                    {/* Connector 2 */}
                    <div className={`${styles.stepperConnector} ${report ? styles.connectorFilled : ""}`} />

                    {/* Step 3 */}
                    <button
                        type="button"
                        className={styles.stepItem}
                        onClick={() => setCurrentStep("report")}
                        disabled={!report}
                    >
                        <div className={`${styles.stepCircle} ${currentStep === "report" ? styles.stepCircleActive : (report ? styles.stepCircleDone : styles.stepCirclePending)}`}>
                            {report ? <Award size={16} /> : "3"}
                        </div>
                        <div className={styles.stepLabels}>
                            <span className={styles.stepTitle}>Báo cáo & Điểm số</span>
                            <span className={report ? styles.stepSubtextDone : styles.stepSubtextPending}>
                                {report ? "Đã có báo cáo" : "Chưa thực hiện"}
                            </span>
                        </div>
                    </button>
                </div>

                {/* Alerts */}
                {error && (
                    <div className={styles.alertError}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}
                {successMessage && (
                    <div className={styles.alertSuccess}>
                        <CheckCircle2 size={18} />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* =========================================================================
                   3. MAIN CONTENT: STEP 1 (CONNECT GITHUB) - 2 COLUMNS LAYOUT
                ========================================================================= */}
                {currentStep === "connect" && (
                    <div className={styles.mainGrid}>
                        {/* Left Main Card */}
                        {isConnected ? (
                            <div className={styles.mainConnectedCard}>
                                {/* Decorative Confetti Dots */}
                                <div className={`${styles.confettiDot} ${styles.confetti1}`} />
                                <div className={`${styles.confettiDot} ${styles.confetti2}`} />
                                <div className={`${styles.confettiDot} ${styles.confetti3}`} />
                                <div className={`${styles.confettiDot} ${styles.confetti4}`} />
                                <div className={`${styles.confettiDot} ${styles.confetti5}`} />

                                {/* Central Avatar with Mint Ring & Verified Badge */}
                                <div className={styles.avatarHaloWrap}>
                                    <div className={styles.avatarInnerCircle}>
                                        <svg height="46" width="46" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                                        </svg>
                                    </div>
                                    <div className={styles.avatarCheckBadge}>
                                        <Check size={16} />
                                    </div>
                                </div>

                                <h3 className={styles.connectedHeading}>Tài khoản GitHub đã liên kết thành công!</h3>
                                <p className={styles.connectedSubtext}>
                                    Đã tìm thấy <strong>{repos.length} repositories</strong> trong tài khoản GitHub của bạn. Bạn có thể tiếp hành bước tiếp theo để lựa chọn các dự án muốn đưa vào hồ sơ tuyển dụng.
                                </p>

                                <div className={styles.actionButtonRow}>
                                    <button
                                        type="button"
                                        className={styles.resyncPillBtn}
                                        onClick={handleSyncRepos}
                                        disabled={isSyncing}
                                    >
                                        <RefreshCw size={15} className={isSyncing ? "animate-spin" : ""} />
                                        <span>Đồng bộ lại</span>
                                    </button>

                                    <button
                                        type="button"
                                        className={styles.nextPillBtn}
                                        onClick={() => setCurrentStep("select")}
                                    >
                                        <span>Sang bước chọn Repository</span>
                                        <ChevronRight size={16} />
                                    </button>
                                </div>

                                <div className={styles.securityNoteFooter}>
                                    <ShieldCheck size={16} color="#2563EB" />
                                    <span>Thông tin của bạn được bảo mật và chỉ sử dụng cho mục đích tuyển dụng.</span>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.unconnectedCard}>
                                <div className={styles.unconnectedLogo}>
                                    <svg height="44" width="44" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                                    </svg>
                                </div>

                                <h3 className={styles.connectedHeading}>Kết nối tài khoản GitHub của bạn</h3>
                                <p className={styles.connectedSubtext}>
                                    Chỉ với 1 click, hệ thống sẽ tự động đồng bộ danh sách dự án công khai, số commit và lịch sử đóng góp để nhà tuyển dụng có cái nhìn thực tế và khách quan nhất về năng lực của bạn.
                                </p>

                                <button
                                    type="button"
                                    className={styles.oauthDirectBtn}
                                    onClick={handleConnectOAuth}
                                    disabled={isSyncing}
                                >
                                    <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                                    </svg>
                                    <span>{isSyncing ? "Đang xử lý kết nối..." : "Ủy quyền trực tiếp qua GitHub"}</span>
                                </button>

                                <button
                                    type="button"
                                    className={styles.manualLink}
                                    onClick={() => setShowManualForm(!showManualForm)}
                                >
                                    {showManualForm ? "Ẩn tùy chọn Personal Access Token" : "Hoặc kết nối bằng Personal Access Token thủ công"}
                                </button>

                                {showManualForm && (
                                    <form onSubmit={handleConnectManual} style={{ width: "100%", maxWidth: 360, marginTop: 20, textAlign: "left" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                            <Input
                                                label="GitHub Username"
                                                placeholder="vd: octocat"
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

                                <div className={styles.securityNoteFooter}>
                                    <ShieldCheck size={16} color="#2563EB" />
                                    <span>Thông tin của bạn được bảo mật và chỉ sử dụng cho mục đích tuyển dụng.</span>
                                </div>
                            </div>
                        )}

                        {/* Right Sidebar Widgets */}
                        <div className={styles.sideWidgetsCol}>
                            {/* Widget 1: Thông tin tài khoản */}
                            <div className={styles.accountWidgetCard}>
                                <div className={styles.accountWidgetHeader}>
                                    <span className={styles.accountWidgetTitle}>
                                        <TrendingUp size={18} color="#2563EB" />
                                        Thông tin tài khoản
                                    </span>
                                    {account?.profileUrl && (
                                        <a href={account.profileUrl} target="_blank" rel="noreferrer" className={styles.detailLink}>
                                            Chi tiết
                                            <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>

                                <div className={styles.userProfileRow}>
                                    {account?.avatarUrl ? (
                                        <img src={account.avatarUrl} alt="Avatar" className={styles.profileAvatar} />
                                    ) : (
                                        <div className={styles.profileAvatarPlaceholder}>
                                            <svg height="22" width="22" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                                            </svg>
                                        </div>
                                    )}

                                    <div className={styles.profileInfoText}>
                                        <div className={styles.usernameVerified}>
                                            <span>{account?.githubUsername || (isConnected ? "GitHub Candidate" : "Chưa liên kết")}</span>
                                            {isConnected && (
                                                <div className={styles.verifiedCheckIcon}>
                                                    <Check size={10} />
                                                </div>
                                            )}
                                        </div>
                                        <span className={styles.userStatusText}>
                                            {isConnected ? (
                                                <span className={styles.userStatusConnected}>Đã liên kết • Vừa xong</span>
                                            ) : (
                                                "Sẵn sàng liên kết"
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.statsBoxContainer}>
                                    <div className={styles.statColItem}>
                                        <FileText size={16} className={styles.statColIcon} />
                                        <span className={styles.statColNumber}>{repos.length}</span>
                                        <span className={styles.statColLabel}>Repositories</span>
                                    </div>

                                    <div className={styles.statColItem}>
                                        <Star size={16} className={styles.statColIcon} />
                                        <span className={styles.statColNumber}>{totalStars}</span>
                                        <span className={styles.statColLabel}>Stars</span>
                                    </div>

                                    <div className={styles.statColItem}>
                                        <GitFork size={16} className={styles.statColIcon} />
                                        <span className={styles.statColNumber}>{totalForks}</span>
                                        <span className={styles.statColLabel}>Forks</span>
                                    </div>
                                </div>
                            </div>

                            {/* Widget 2: Mẹo nhỏ */}
                            <div className={styles.proTipCard}>
                                <div className={styles.proTipHeader}>
                                    <span style={{ fontSize: 16 }}>💡</span>
                                    <span>Mẹo nhỏ</span>
                                </div>

                                <div className={styles.proTipBody}>
                                    <p className={styles.proTipText}>
                                        Hãy chọn những repository chứa công việc lập trình thực tế và thể hiện rõ năng lực của bạn nhé!
                                    </p>

                                    {/* Cute Developer Octocat Illustration */}
                                    <div className={styles.proTipIllustration}>
                                        <svg viewBox="0 0 100 100" width="68" height="68">
                                            {/* Desk / Laptop */}
                                            <rect x="15" y="75" width="70" height="6" rx="3" fill="#94A3B8" />
                                            <path d="M28 75L35 55H65L72 75H28Z" fill="#CBD5E1" />
                                            <rect x="36" y="56" width="28" height="17" rx="2" fill="#2563EB" />
                                            <circle cx="50" cy="64" r="3" fill="#FFFFFF" />
                                            {/* Cat face */}
                                            <circle cx="50" cy="36" r="22" fill="#0F172A" />
                                            {/* Ears */}
                                            <path d="M32 25L38 12L46 20Z" fill="#0F172A" />
                                            <path d="M68 25L62 12L54 20Z" fill="#0F172A" />
                                            {/* Eyes */}
                                            <ellipse cx="43" cy="35" rx="3" ry="5" fill="#67E8F9" />
                                            <ellipse cx="57" cy="35" rx="3" ry="5" fill="#67E8F9" />
                                            <circle cx="44" cy="33" r="1.5" fill="#FFFFFF" />
                                            <circle cx="58" cy="33" r="1.5" fill="#FFFFFF" />
                                            {/* Paws on keyboard */}
                                            <ellipse cx="38" cy="74" rx="4" ry="3" fill="#0F172A" />
                                            <ellipse cx="62" cy="74" rx="4" ry="3" fill="#0F172A" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* =========================================================================
                   BƯỚC 2: CHỌN REPOSITORIES TIÊU BIỂU
                ========================================================================= */}
                {currentStep === "select" && (
                    <div className={styles.repoSelectSection}>
                        {/* Toolbar: Search + Language Filter Chips */}
                        <div className={styles.toolbarCard}>
                            <div className={styles.searchFieldWrap}>
                                <Search size={16} className={styles.searchFieldIcon} />
                                <input
                                    type="text"
                                    className={styles.searchFieldInput}
                                    placeholder="Tìm repository theo tên hoặc từ khóa..."
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <SlidersHorizontal size={15} color="#64748B" />
                                <button
                                    type="button"
                                    style={{
                                        background: selectedLanguageFilter === "ALL" ? "#0F172A" : "#FFFFFF",
                                        color: selectedLanguageFilter === "ALL" ? "#FFFFFF" : "#64748B",
                                        border: "1px solid #E2E8F0",
                                        borderRadius: 20,
                                        padding: "5px 12px",
                                        fontSize: 12.5,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setSelectedLanguageFilter("ALL")}
                                >
                                    Tất cả ({repos.length})
                                </button>
                                {availableLanguages.map((lang) => (
                                    <button
                                        key={lang}
                                        type="button"
                                        style={{
                                            background: selectedLanguageFilter === lang ? "#0F172A" : "#FFFFFF",
                                            color: selectedLanguageFilter === lang ? "#FFFFFF" : "#64748B",
                                            border: "1px solid #E2E8F0",
                                            borderRadius: 20,
                                            padding: "5px 12px",
                                            fontSize: 12.5,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 5,
                                        }}
                                        onClick={() => setSelectedLanguageFilter(lang)}
                                    >
                                        <span
                                            style={{
                                                width: 7,
                                                height: 7,
                                                borderRadius: "50%",
                                                backgroundColor: LANGUAGE_COLORS[lang] || "#94A3B8",
                                            }}
                                        />
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Grid Repos */}
                        {filteredRepos.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "60px 20px", background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0" }}>
                                <p style={{ color: "#64748B", margin: 0, fontSize: 14 }}>
                                    Không tìm thấy repository nào khớp với bộ lọc.
                                </p>
                            </div>
                        ) : (
                            <div className={styles.repoGridClean}>
                                {filteredRepos.map((repo) => {
                                    const isSel = selectedRepoIds.includes(repo.id);
                                    const dotColor = LANGUAGE_COLORS[repo.primaryLanguage || ""] || "#94A3B8";

                                    return (
                                        <div
                                            key={repo.id}
                                            className={`${styles.repoCardItem} ${isSel ? styles.repoCardItemSelected : ""}`}
                                            onClick={() => toggleSelectRepo(repo.id)}
                                        >
                                            <div>
                                                <div className={styles.repoTopRow}>
                                                    <span className={styles.repoNameText}>
                                                        <FileText size={16} color={isSel ? "#2563EB" : "#64748B"} />
                                                        {repo.repoName}
                                                    </span>
                                                    {isSel ? (
                                                        <CheckSquare size={20} color="#2563EB" />
                                                    ) : (
                                                        <Square size={20} color="#CBD5E1" />
                                                    )}
                                                </div>
                                                <p className={styles.repoDescText}>
                                                    {repo.description || "Không có mô tả dự án."}
                                                </p>
                                            </div>

                                            <div className={styles.repoMetaFooter}>
                                                <div className={styles.repoLangDotWrap}>
                                                    <span className={styles.repoColorDot} style={{ backgroundColor: dotColor }} />
                                                    <span>{repo.primaryLanguage || "Khác"}</span>
                                                    {repo.isFork && <Badge variant="warning" size="sm">Fork</Badge>}
                                                </div>

                                                <div className={styles.repoCounters}>
                                                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                                        <Star size={12} /> {repo.starsCount || 0}
                                                    </span>
                                                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                                        <GitFork size={12} /> {repo.forksCount || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Floating Bottom Dock */}
                        <div className={styles.bottomDockBar}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ background: "#2563EB", color: "white", padding: "4px 10px", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
                                    {selectedRepoIds.length} / 5
                                </span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                                        {selectedRepoIds.length === 0
                                            ? "Hãy chọn từ 1 đến 5 repository tiêu biểu"
                                            : `Đã chọn ${selectedRepoIds.length} repository tiêu biểu`}
                                    </div>
                                    <div style={{ fontSize: 12, color: "#94A3B8" }}>
                                        Nên chọn dự án có commit cá nhân thực tế và cấu trúc kiểm thử
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                style={{
                                    background: "linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%)",
                                    color: "#FFFFFF",
                                    border: "none",
                                    borderRadius: "999px",
                                    padding: "10px 24px",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
                                }}
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || selectedRepoIds.length === 0}
                            >
                                <Sparkles size={16} />
                                {isAnalyzing ? "Đang phân tích & Chấm điểm..." : "Bắt đầu Phân tích & Chấm điểm"}
                            </button>
                        </div>
                    </div>
                )}

                {/* =========================================================================
                   BƯỚC 3: BÁO CÁO & BẢNG ĐIỂM (EXECUTIVE SCORECARD)
                ========================================================================= */}
                {currentStep === "report" && report && (
                    <div className={styles.reportDashboard}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
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

                        {/* Hero Scorecard */}
                        {(() => {
                            const radius = 54;
                            const circumference = 2 * Math.PI * radius;
                            const strokeDashoffset = circumference - (report.overallScore / 100) * circumference;

                            return (
                                <div className={styles.scorecardHeroCard}>
                                    <div className={styles.gaugeCircleWrap}>
                                        <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
                                            <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
                                            <circle
                                                cx="70"
                                                cy="70"
                                                r={radius}
                                                fill="none"
                                                stroke="#3B82F6"
                                                strokeWidth="10"
                                                strokeLinecap="round"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={strokeDashoffset}
                                                style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                                            />
                                        </svg>
                                        <div className={styles.gaugeCenterText}>
                                            <span className={styles.gaugeScoreVal}>{report.overallScore}</span>
                                            <span className={styles.gaugeScoreMax}>THANG ĐIỂM 100</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ display: "inline-block", background: "rgba(16, 185, 129, 0.2)", color: "#6EE7B7", border: "1px solid #10B981", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                                            {report.overallScore >= 80 ? "🏆 Xuất sắc (Top Tier Contributor)" : report.overallScore >= 60 ? "⭐ Năng lực Tốt (Strong Standard)" : "⚡ Tiềm năng (Developing Standard)"}
                                        </div>
                                        <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px 0", color: "#FFFFFF" }}>
                                            Chỉ số Năng lực Kỹ thuật Git
                                        </h2>
                                        <p style={{ fontSize: 13.5, color: "#94A3B8", margin: 0, lineHeight: 1.5 }}>
                                            Điểm số tổng hợp được phân tích tự động từ metadata của <strong>{report.evaluatedRepositories?.length || selectedRepoIds.length}</strong> repository tiêu biểu trên GitHub của bạn.
                                        </p>
                                    </div>

                                    <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                                            <span style={{ color: "#94A3B8" }}>Dự án chấm:</span>
                                            <strong style={{ color: "white" }}>{report.evaluatedRepositories?.length || selectedRepoIds.length} Repos</strong>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                                            <span style={{ color: "#94A3B8" }}>Trạng thái:</span>
                                            <strong style={{ color: "#10B981" }}>ĐÃ XÁC THỰC</strong>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                                            <span style={{ color: "#94A3B8" }}>Cấp độ:</span>
                                            <strong style={{ color: "#60A5FA" }}>
                                                {report.overallScore >= 80 ? "Senior Level" : report.overallScore >= 60 ? "Middle Level" : "Junior Level"}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* 4 Metric Cards */}
                        <div className={styles.metrics4Grid}>
                            <div className={styles.metricCardItem}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>1. Đóng góp thực tế</span>
                                    <TrendingUp size={18} color="#2563EB" />
                                </div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "6px 0" }}>
                                    <span style={{ fontSize: 26, fontWeight: 800, color: "#0F172A" }}>{report.contributionScore}</span>
                                    <span style={{ fontSize: 13, color: "#94A3B8" }}>/ 35 đ</span>
                                </div>
                                <div style={{ height: 6, background: "#F1F5F9", borderRadius: 999, overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${(report.contributionScore / 35) * 100}%`, background: "#2563EB", borderRadius: 999 }} />
                                </div>
                                <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>
                                    Tỷ lệ commits cá nhân thực tế bạn trực tiếp tạo ra trong repository.
                                </p>
                            </div>

                            <div className={styles.metricCardItem}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>2. Chuẩn Best Practices</span>
                                    <ShieldCheck size={18} color="#10B981" />
                                </div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "6px 0" }}>
                                    <span style={{ fontSize: 26, fontWeight: 800, color: "#0F172A" }}>{report.bestPracticeScore}</span>
                                    <span style={{ fontSize: 13, color: "#94A3B8" }}>/ 30 đ</span>
                                </div>
                                <div style={{ height: 6, background: "#F1F5F9", borderRadius: 999, overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${(report.bestPracticeScore / 30) * 100}%`, background: "#10B981", borderRadius: 999 }} />
                                </div>
                                <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>
                                    README hướng dẫn, bộ Unit Test, CI/CD pipeline và Conventional Commits.
                                </p>
                            </div>

                            <div className={styles.metricCardItem}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>3. Kỷ luật & Đều đặn</span>
                                    <Clock size={18} color="#F59E0B" />
                                </div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "6px 0" }}>
                                    <span style={{ fontSize: 26, fontWeight: 800, color: "#0F172A" }}>{report.consistencyScore}</span>
                                    <span style={{ fontSize: 13, color: "#94A3B8" }}>/ 20 đ</span>
                                </div>
                                <div style={{ height: 6, background: "#F1F5F9", borderRadius: 999, overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${(report.consistencyScore / 20) * 100}%`, background: "#F59E0B", borderRadius: 999 }} />
                                </div>
                                <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>
                                    Mức độ thường xuyên cập nhật và duy trì code trong 3 - 12 tháng gần nhất.
                                </p>
                            </div>

                            <div className={styles.metricCardItem}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>4. Quy mô & Đa dạng</span>
                                    <Layers size={18} color="#8B5CF6" />
                                </div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "6px 0" }}>
                                    <span style={{ fontSize: 26, fontWeight: 800, color: "#0F172A" }}>{report.complexityScore}</span>
                                    <span style={{ fontSize: 13, color: "#94A3B8" }}>/ 15 đ</span>
                                </div>
                                <div style={{ height: 6, background: "#F1F5F9", borderRadius: 999, overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${(report.complexityScore / 15) * 100}%`, background: "#8B5CF6", borderRadius: 999 }} />
                                </div>
                                <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>
                                    Độ đa dạng ngôn ngữ và mức độ quan tâm từ cộng đồng (Stars / Forks).
                                </p>
                            </div>
                        </div>

                        {/* AI Insights */}
                        {summary && (
                            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: 24 }}>
                                <h4 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 700, margin: "0 0 16px 0", color: "#0F172A" }}>
                                    <Sparkles size={18} color="#2563EB" />
                                    Đánh giá & Gợi ý từ Hệ thống
                                </h4>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
                                        <strong style={{ fontSize: 13, color: "#10B981", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                                            <Check size={15} /> Thế mạnh nổi bật:
                                        </strong>
                                        {summary.strengths?.length > 0 ? (
                                            summary.strengths.map((s: string, idx: number) => (
                                                <div key={idx} style={{ fontSize: 13, color: "#065F46", background: "#ECFDF5", padding: "6px 10px", borderRadius: 6, marginBottom: 6 }}>
                                                    • {s}
                                                </div>
                                            ))
                                        ) : (
                                            <span style={{ fontSize: 12, color: "#94A3B8" }}>Chưa có ghi nhận đặc biệt.</span>
                                        )}
                                    </div>

                                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
                                        <strong style={{ fontSize: 13, color: "#F59E0B", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                                            <BookOpen size={15} /> Khuyến nghị cải thiện:
                                        </strong>
                                        {summary.weaknesses?.length > 0 ? (
                                            summary.weaknesses.map((w: string, idx: number) => (
                                                <div key={idx} style={{ fontSize: 13, color: "#92400E", background: "#FFFBEB", padding: "6px 10px", borderRadius: 6, marginBottom: 6 }}>
                                                    • {w}
                                                </div>
                                            ))
                                        ) : (
                                            <span style={{ fontSize: 12, color: "#10B981" }}>Các dự án đều đáp ứng chuẩn rất tốt!</span>
                                        )}
                                    </div>
                                </div>

                                {summary.recommendation && (
                                    <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "14px 18px", fontSize: 13.5, color: "#1E40AF", lineHeight: 1.6 }}>
                                        <strong>Nhận xét cho Nhà tuyển dụng / HR: </strong>
                                        {summary.recommendation}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Detailed Table */}
                        <div className={styles.tableCleanCard}>
                            <h4 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 14px 0", color: "#0F172A" }}>
                                Chi tiết {report.evaluatedRepositories?.length || selectedRepoIds.length} Repository được Chấm điểm
                            </h4>
                            <div style={{ overflowX: "auto" }}>
                                <table className={styles.cleanTable}>
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
                                                        style={{ color: "#2563EB", textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}
                                                    >
                                                        {r.repoName}
                                                        <ExternalLink size={12} />
                                                    </a>
                                                    {r.description && (
                                                        <span style={{ display: "block", fontSize: 12, color: "#64748B", marginTop: 2, maxWidth: 260, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            {r.description}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 600 }}>
                                                        <span
                                                            style={{
                                                                width: 7,
                                                                height: 7,
                                                                borderRadius: "50%",
                                                                backgroundColor: LANGUAGE_COLORS[r.primaryLanguage || ""] || "#94A3B8",
                                                            }}
                                                        />
                                                        {r.primaryLanguage || "Khác"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong>{r.candidateCommitRatio ? `${Math.round(r.candidateCommitRatio * 100)}%` : "100%"}</strong>
                                                    <span style={{ fontSize: 11, color: "#94A3B8", display: "block" }}>
                                                        ({r.candidateCommitCount || 0}/{r.totalCommitCount || 0} commits)
                                                    </span>
                                                </td>
                                                <td>
                                                    {r.hasReadme ? (
                                                        <span style={{ color: "#10B981", fontWeight: 600, fontSize: 12, background: "#ECFDF5", padding: "3px 8px", borderRadius: 6 }}>
                                                            Có
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: "#94A3B8", fontSize: 12 }}>— Chưa</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {r.hasTests ? (
                                                        <span style={{ color: "#10B981", fontWeight: 600, fontSize: 12, background: "#ECFDF5", padding: "3px 8px", borderRadius: 6 }}>
                                                            Có
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: "#94A3B8", fontSize: 12 }}>— Chưa</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {r.hasCiCd ? (
                                                        <span style={{ color: "#10B981", fontWeight: 600, fontSize: 12, background: "#ECFDF5", padding: "3px 8px", borderRadius: 6 }}>
                                                            Có
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: "#94A3B8", fontSize: 12 }}>— Chưa</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <strong style={{ fontSize: 15, color: "#2563EB" }}>
                                                        {r.repoScore ? `${r.repoScore} đ` : "—"}
                                                    </strong>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
