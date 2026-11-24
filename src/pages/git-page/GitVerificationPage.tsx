import { useEffect, useState, useRef } from "react";
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
    X,
    Search,
    ChevronRight,
    ArrowLeft,
    TrendingUp,
    ShieldCheck,
    Clock,
    Layers,
    FileText,
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
    GithubAccount,
    GithubRepository,
    GitVerificationReport,
} from "../../services/gitAnalysisService";
import styles from "./GitVerificationPage.module.css";

type StepType = "connect" | "select" | "report";

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
                setSuccessMessage("Kết nối thành công với GitHub! Hãy chọn các repositories tiêu biểu.");
                // Tự động chuyển sang bước 2
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

    // Load Repos và Báo cáo đã có trong DB
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

    // Bước 1: 1-Click Kết nối trực tiếp qua GitHub OAuth
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

    // Bước 2: Đồng bộ lại Repositories từ GitHub
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

    // Lọc repos theo từ khóa tìm kiếm
    const filteredRepos = repos.filter((r) =>
        r.repoName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchKeyword.toLowerCase())) ||
        (r.primaryLanguage && r.primaryLanguage.toLowerCase().includes(searchKeyword.toLowerCase()))
    );

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
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                    <Spinner size="lg" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout role="candidate">
            <div className={styles.page}>
                {/* 1. Header Card */}
                <div className={styles.headerCard}>
                    <div className={styles.headerInfo}>
                        <h1>
                            <Code size={24} color="var(--color-primary)" />
                            Xác thực & Chấm điểm Năng lực Git
                        </h1>
                        <p>
                            Đánh giá quy chuẩn lập trình, tính kỷ luật commit và mức độ đóng góp thực tế trên GitHub của bạn.
                        </p>
                    </div>

                    {isConnected && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Badge variant="success">GitHub đã liên kết</Badge>
                            <Button variant="outline" onClick={handleSyncRepos} disabled={isSyncing}>
                                <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} style={{ marginRight: 6 }} />
                                {isSyncing ? "Đang đồng bộ..." : "Đồng bộ lại"}
                            </Button>
                        </div>
                    )}
                </div>

                {/* 2. Stepper Tabs Bar */}
                <div className={styles.stepperContainer}>
                    <button
                        type="button"
                        className={`${styles.stepTab} ${currentStep === "connect" ? styles.stepTabActive : ""} ${isConnected ? styles.stepTabCompleted : ""}`}
                        onClick={() => setCurrentStep("connect")}
                    >
                        <span className={styles.stepNumber}>
                            {isConnected ? <Check size={14} /> : "1"}
                        </span>
                        1. Liên kết GitHub
                    </button>

                    <button
                        type="button"
                        className={`${styles.stepTab} ${currentStep === "select" ? styles.stepTabActive : ""} ${selectedRepoIds.length > 0 ? styles.stepTabCompleted : ""}`}
                        onClick={() => setCurrentStep("select")}
                        disabled={!isConnected}
                    >
                        <span className={styles.stepNumber}>
                            {selectedRepoIds.length > 0 && report ? <Check size={14} /> : "2"}
                        </span>
                        2. Chọn Repository tiêu biểu ({selectedRepoIds.length}/5)
                    </button>

                    <button
                        type="button"
                        className={`${styles.stepTab} ${currentStep === "report" ? styles.stepTabActive : ""}`}
                        onClick={() => setCurrentStep("report")}
                        disabled={!report}
                    >
                        <span className={styles.stepNumber}>3</span>
                        3. Báo cáo & Điểm số
                    </button>
                </div>

                {/* Alerts */}
                {error && (
                    <div style={{ background: "#FEF2F2", color: "#B91C1C", padding: "12px 18px", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}
                {successMessage && (
                    <div style={{ background: "#ECFDF5", color: "#065F46", padding: "12px 18px", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
                        <CheckCircle2 size={18} />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* =========================================================================
                   BƯỚC 1: LIÊN KẾT GITHUB
                ========================================================================= */}
                {currentStep === "connect" && (
                    <div className={styles.connectCard}>
                        <div className={styles.githubLogoBadge}>
                            <svg height="40" width="40" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                            </svg>
                        </div>

                        {!isConnected ? (
                            <>
                                <h2 className={styles.connectTitle}>Kết nối tài khoản GitHub của bạn</h2>
                                <p className={styles.connectDesc}>
                                    Chỉ với 1 click, hệ thống sẽ tự động đồng bộ danh sách dự án công khai, số commit và lịch sử đóng góp để nhà tuyển dụng có cái nhìn thực tế và khách quan nhất về năng lực của bạn.
                                </p>

                                <button
                                    type="button"
                                    className={styles.githubConnectBtn}
                                    onClick={handleConnectOAuth}
                                    disabled={isSyncing}
                                >
                                    <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                                    </svg>
                                    {isSyncing ? "Đang xử lý kết nối..." : "Ủy quyền trực tiếp qua GitHub"}
                                </button>

                                <button
                                    type="button"
                                    className={styles.toggleManualLink}
                                    onClick={() => setShowManualForm(!showManualForm)}
                                >
                                    {showManualForm ? "Ẩn tùy chọn nhập thủ công" : "Hoặc nhập Personal Access Token thủ công"}
                                </button>

                                {showManualForm && (
                                    <form onSubmit={handleConnectManual} style={{ width: "100%", marginTop: 24, textAlign: "left" }}>
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
                                                    label="Personal Access Token"
                                                    type="password"
                                                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                                    value={accessToken}
                                                    onChange={(e) => setAccessToken(e.target.value)}
                                                    required
                                                />
                                                <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4 }}>
                                                    Quyền yêu cầu: <code>read:user</code> và <code>repo</code>
                                                </p>
                                            </div>
                                            <Button type="submit" variant="primary" disabled={isSyncing}>
                                                {isSyncing ? "Đang kết nối..." : "Xác nhận kết nối token"}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </>
                        ) : (
                            <>
                                <h2 className={styles.connectTitle}>Tài khoản GitHub đã liên kết thành công!</h2>
                                <p className={styles.connectDesc}>
                                    Đã tìm thấy <strong>{repos.length} repositories</strong> trong tài khoản GitHub của bạn. Bạn có thể tiến hành bước tiếp theo để lựa chọn các dự án muốn đưa vào hồ sơ tuyển dụng.
                                </p>

                                <div style={{ display: "flex", gap: 12 }}>
                                    <Button variant="outline" onClick={handleSyncRepos} disabled={isSyncing}>
                                        <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} style={{ marginRight: 6 }} />
                                        Đồng bộ lại
                                    </Button>
                                    <Button variant="primary" onClick={() => setCurrentStep("select")}>
                                        Sang bước chọn Repository
                                        <ChevronRight size={16} style={{ marginLeft: 6 }} />
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* =========================================================================
                   BƯỚC 2: CHỌN REPOSITORIES TIÊU BIỂU
                ========================================================================= */}
                {currentStep === "select" && (
                    <>
                        {/* Account Preview Bar */}
                        <div className={styles.accountBar}>
                            <div className={styles.accountLeft}>
                                {account?.avatarUrl ? (
                                    <img src={account.avatarUrl} alt="Avatar" className={styles.accountAvatar} />
                                ) : (
                                    <div style={{ background: "#1E293B", color: "white", padding: 10, borderRadius: "50%", display: "flex" }}>
                                        <Code size={20} />
                                    </div>
                                )}
                                <div className={styles.accountDetails}>
                                    <h4>
                                        {account?.githubUsername || "GitHub Account"}
                                        {account?.profileUrl && (
                                            <a href={account.profileUrl} target="_blank" rel="noreferrer" style={{ marginLeft: 8, color: "var(--color-primary)", textDecoration: "none", fontSize: 13 }}>
                                                <ExternalLink size={12} style={{ display: "inline" }} />
                                            </a>
                                        )}
                                    </h4>
                                    <p>Tổng cộng: {repos.length} repositories được tìm thấy</p>
                                </div>
                            </div>

                            <span className={styles.counterPill}>
                                Đã chọn: {selectedRepoIds.length} / 5
                            </span>
                        </div>

                        {/* Controls (Search + Counter) */}
                        <div className={styles.repoControls}>
                            <div className={styles.searchBox}>
                                <Search size={18} className={styles.searchIcon} />
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder="Tìm kiếm repository theo tên, mô tả hoặc ngôn ngữ..."
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />
                            </div>

                            <div className={styles.selectionIndicator}>
                                <span>Hãy chọn từ 1 đến 5 dự án nổi bật nhất của bạn</span>
                            </div>
                        </div>

                        {/* Grid Repos */}
                        {filteredRepos.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 12, border: "1px solid var(--color-border-light)" }}>
                                <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>
                                    Không tìm thấy repository nào khớp với từ khóa tìm kiếm.
                                </p>
                            </div>
                        ) : (
                            <div className={styles.repoGrid}>
                                {filteredRepos.map((repo) => {
                                    const isSel = selectedRepoIds.includes(repo.id);
                                    return (
                                        <div
                                            key={repo.id}
                                            className={`${styles.repoCard} ${isSel ? styles.repoCardSelected : ""}`}
                                            onClick={() => toggleSelectRepo(repo.id)}
                                        >
                                            <div>
                                                <div className={styles.repoTop}>
                                                    <span className={styles.repoName}>
                                                        <FileText size={16} color="var(--color-primary)" />
                                                        {repo.repoName}
                                                    </span>
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

                                            <div className={styles.repoMetaRow}>
                                                <div className={styles.repoTags}>
                                                    {repo.primaryLanguage && (
                                                        <Badge variant="info">{repo.primaryLanguage}</Badge>
                                                    )}
                                                    {repo.isFork && <Badge variant="warning">Fork</Badge>}
                                                </div>
                                                <div className={styles.repoStats}>
                                                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                                        <Star size={13} /> {repo.starsCount || 0}
                                                    </span>
                                                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                                        <GitFork size={13} /> {repo.forksCount || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Floating Action Bar */}
                        <div className={styles.bottomActionBar}>
                            <div>
                                <strong>{selectedRepoIds.length}</strong> / 5 repository đã được chọn
                                <span style={{ marginLeft: 10, fontSize: 13, color: "var(--color-text-secondary)" }}>
                                    (Tối đa 5 repositories)
                                </span>
                            </div>

                            <Button
                                variant="primary"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || selectedRepoIds.length === 0}
                            >
                                <Sparkles size={16} style={{ marginRight: 8 }} />
                                {isAnalyzing ? "Đang quét metadata & Tính điểm..." : "Bắt đầu Phân tích & Chấm điểm"}
                            </Button>
                        </div>
                    </>
                )}

                {/* =========================================================================
                   BƯỚC 3: BÁO CÁO & BẢNG ĐIỂM
                ========================================================================= */}
                {currentStep === "report" && report && (
                    <>
                        {/* Top Action Row */}
                        <div className={styles.reportActionRow}>
                            <Button variant="outline" onClick={() => setCurrentStep("select")}>
                                <ArrowLeft size={16} style={{ marginRight: 6 }} />
                                Đổi Repositories & Chấm lại
                            </Button>

                            <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                                Báo cáo cập nhật lúc: {new Date(report.analyzedAt).toLocaleString("vi-VN")}
                            </span>
                        </div>

                        {/* Hero Overall Score Card */}
                        <div className={styles.heroScoreCard}>
                            <div className={styles.heroLeft}>
                                <div className={styles.scoreCircle}>
                                    <span className={styles.scoreNumber}>{report.overallScore}</span>
                                    <span className={styles.scoreOutOf}>TRÊN 100</span>
                                </div>
                                <div className={styles.heroMeta}>
                                    <h3>Điểm Năng lực Lập trình Git</h3>
                                    <p>Đánh giá tổng hợp dựa trên {selectedRepoIds.length} dự án tiêu biểu bạn đã chọn.</p>
                                    <Badge variant={report.overallScore >= 75 ? "success" : report.overallScore >= 50 ? "warning" : "danger"}>
                                        {report.overallScore >= 75 ? "Mã nguồn Xuất sắc (Top 10%)" : report.overallScore >= 50 ? "Đạt chuẩn Nhà tuyển dụng" : "Cần hoàn thiện thêm quy chuẩn"}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* 4 Metrics Grid with Progress Bars */}
                        <div className={styles.metricsGrid}>
                            <div className={styles.metricCard}>
                                <div>
                                    <div className={styles.metricHeader}>
                                        <span className={styles.metricTitle}>Mức độ đóng góp thực tế</span>
                                        <TrendingUp size={16} color="#3B82F6" />
                                    </div>
                                    <div className={styles.metricValue}>
                                        {report.contributionScore} <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>/ 35 đ</span>
                                    </div>
                                </div>
                                <div className={styles.progressBarContainer}>
                                    <div
                                        className={styles.progressBarFill}
                                        style={{ width: `${(report.contributionScore / 35) * 100}%`, backgroundColor: "#3B82F6" }}
                                    />
                                </div>
                            </div>

                            <div className={styles.metricCard}>
                                <div>
                                    <div className={styles.metricHeader}>
                                        <span className={styles.metricTitle}>Quy chuẩn Clean Code & Test</span>
                                        <ShieldCheck size={16} color="#10B981" />
                                    </div>
                                    <div className={styles.metricValue}>
                                        {report.bestPracticeScore} <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>/ 30 đ</span>
                                    </div>
                                </div>
                                <div className={styles.progressBarContainer}>
                                    <div
                                        className={styles.progressBarFill}
                                        style={{ width: `${(report.bestPracticeScore / 30) * 100}%`, backgroundColor: "#10B981" }}
                                    />
                                </div>
                            </div>

                            <div className={styles.metricCard}>
                                <div>
                                    <div className={styles.metricHeader}>
                                        <span className={styles.metricTitle}>Tính kỷ luật & Liên tục</span>
                                        <Clock size={16} color="#F59E0B" />
                                    </div>
                                    <div className={styles.metricValue}>
                                        {report.consistencyScore} <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>/ 20 đ</span>
                                    </div>
                                </div>
                                <div className={styles.progressBarContainer}>
                                    <div
                                        className={styles.progressBarFill}
                                        style={{ width: `${(report.consistencyScore / 20) * 100}%`, backgroundColor: "#F59E0B" }}
                                    />
                                </div>
                            </div>

                            <div className={styles.metricCard}>
                                <div>
                                    <div className={styles.metricHeader}>
                                        <span className={styles.metricTitle}>Quy mô & Đa dạng công nghệ</span>
                                        <Layers size={16} color="#8B5CF6" />
                                    </div>
                                    <div className={styles.metricValue}>
                                        {report.complexityScore} <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>/ 15 đ</span>
                                    </div>
                                </div>
                                <div className={styles.progressBarContainer}>
                                    <div
                                        className={styles.progressBarFill}
                                        style={{ width: `${(report.complexityScore / 15) * 100}%`, backgroundColor: "#8B5CF6" }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Insights & Recommendations */}
                        {summary && (
                            <div className={styles.insightsCard}>
                                <h4 className={styles.insightsSectionTitle}>
                                    <Sparkles size={18} color="#F59E0B" />
                                    Nhận xét & Đánh giá Năng lực từ Hệ thống
                                </h4>

                                {summary.strengths && summary.strengths.length > 0 && (
                                    <div className={styles.tagGroup}>
                                        <span className={styles.tagGroupLabel}>Thế mạnh nổi bật:</span>
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
                                    <div className={styles.tagGroup}>
                                        <span className={styles.tagGroupLabel}>Điểm cần cải thiện để nâng điểm:</span>
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
                                        <strong>Nhận xét tổng quan: </strong>
                                        {summary.recommendation}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Detail Table of Evaluated Repos */}
                        <div className={styles.tableCard}>
                            <h4 className={styles.tableTitle}>Bảng chi tiết các Repositories đã được chấm điểm</h4>
                            <div style={{ overflowX: "auto" }}>
                                <table className={styles.detailTable}>
                                    <thead>
                                        <tr>
                                            <th>Repository</th>
                                            <th>Ngôn ngữ</th>
                                            <th>Tỷ lệ đóng góp</th>
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
                                                            style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}
                                                        >
                                                            {r.repoName}
                                                            <ExternalLink size={12} />
                                                        </a>
                                                    </td>
                                                    <td>{r.primaryLanguage || "N/A"}</td>
                                                    <td>
                                                        <strong>{r.candidateCommitRatio ? `${Math.round(r.candidateCommitRatio * 100)}%` : "100%"}</strong>
                                                        <span style={{ fontSize: 11, color: "var(--color-text-muted)", display: "block" }}>
                                                            ({r.candidateCommitCount || 0}/{r.totalCommitCount || 0} commits)
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {r.hasReadme ? (
                                                            <span className={styles.statusCheck}><Check size={14} /> Có</span>
                                                        ) : (
                                                            <span className={styles.statusNone}>— Chưa</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {r.hasTests ? (
                                                            <span className={styles.statusCheck}><Check size={14} /> Có</span>
                                                        ) : (
                                                            <span className={styles.statusNone}>— Chưa</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {r.hasCiCd ? (
                                                            <span className={styles.statusCheck}><Check size={14} /> Có</span>
                                                        ) : (
                                                            <span className={styles.statusNone}>— Chưa</span>
                                                        )}
                                                    </td>
                                                    <td style={{ fontWeight: 800, fontSize: 15, color: "var(--color-primary)" }}>
                                                        {r.repoScore ? `${r.repoScore} đ` : "—"}
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
