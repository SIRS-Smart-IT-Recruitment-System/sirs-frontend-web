import type { ReactNode } from "react";
import { Check, ShieldCheck, ArrowLeft } from "lucide-react";
import { Avatar, Badge, Button, Tooltip } from "../../../components/common";
import logoSrc from "../../../assets/logo.png";
import capyByteSrc from "../../../assets/capybyte-official.webp";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
    children: ReactNode;
    onBack?: () => void;
}

const AuthLayout = ({ children, onBack }: AuthLayoutProps) => {
    return (
        <div className={styles.authContainer}>

            {/* ===== LEFT HERO PANEL ===== */}
            <section className={styles.leftPanel} aria-label="Hero section">

                {/* Ambient grid overlay */}
                <div className={styles.ambientGrid} aria-hidden="true" />

                {/* Glow orbs */}
                <div className={`${styles.glowOrb} ${styles.glowOrbTop}`} aria-hidden="true" />
                <div className={`${styles.glowOrb} ${styles.glowOrbBottom}`} aria-hidden="true" />

                {/* Top brand + heading */}
                <div className={styles.heroTop}>
                    <div className={styles.heroBadge}>
                        <span className={styles.heroBadgeDot}></span>
                        <span>Nền tảng tuyển dụng IT thông minh</span>
                    </div>

                    <h1 className={styles.heroTitle}>
                        Kết nối nhân tài –<br />
                        <span className={styles.heroTitleGradient}>Kiến tạo tương lai</span>
                    </h1>

                    <p className={styles.heroDesc}>
                        Tối ưu hóa quy trình tuyển dụng với nền tảng quản lý thông minh,
                        hỗ trợ doanh nghiệp tiếp cận nguồn nhân lực chất lượng,
                        theo dõi hồ sơ ứng viên và đưa ra quyết định tuyển dụng hiệu quả.
                    </p>
                </div>

                {/* Floating candidate card composition */}
                <div className={styles.cardsComposition}>
                    {/* Glow rings */}
                    <div className={styles.glowRing} aria-hidden="true" />
                    <div className={styles.glowRingOuter} aria-hidden="true" />

                    {/* Card + AI pill + badge — tất cả grouped lại */}
                    <div className={styles.cardGroup}>
                        {/* Badge: verified network — absolute góc trên-phải của card */}
                        <div className={`${styles.glassCardSubtle} ${styles.floatingBadge} ${styles.floatingBadgeTop}`}>
                            <span className={styles.pingWrapper}>
                                <span className={styles.pingInner} />
                                <span className={styles.pingDot} />
                            </span>
                            <span>50,000+ Lập trình viên Verified</span>
                        </div>

                        {/* Main candidate profile card */}
                        <div className={`${styles.glassCard} ${styles.profileCard}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardLeft}>
                                    <div className={styles.avatarWrapper}>
                                        <Avatar
                                            name="Nguyễn Minh Long"
                                            initials="NL"
                                            size="md"
                                            className={styles.avatarCircle}
                                        />
                                        <Tooltip
                                            content="Đã xác thực danh tính IT"
                                            position="top"
                                            className={styles.verifiedTooltip}
                                        >
                                            <div className={styles.verifiedBadge}>
                                                <Check size={12} strokeWidth={3} aria-hidden="true" />
                                            </div>
                                        </Tooltip>
                                    </div>
                                    <div className={styles.candidateInfo}>
                                        <h3 className={styles.candidateName}>
                                            Đặng Văn Nghĩa
                                            <Badge variant="success" size="sm" className={styles.activeTag}>
                                                Active
                                            </Badge>
                                        </h3>
                                        <p className={styles.candidateRole}>Senior Full-stack Engineer • 6 năm kinh nghiệm</p>
                                    </div>
                                </div>
                                <Badge variant="primary" size="md" className={styles.matchScore}>
                                    98% Match
                                </Badge>
                            </div>

                            <div className={styles.skillTags}>
                                <Badge size="sm" className={styles.skillTag}>React / Next.js</Badge>
                                <Badge size="sm" className={styles.skillTag}>Node.js / Go</Badge>
                                <Badge size="sm" className={styles.skillTag}>System Design</Badge>
                                <div className={styles.breakLine} />
                                <Badge size="sm" className={`${styles.skillTag} ${styles.skillTagAccent}`}>
                                    AWS Cloud
                                </Badge>
                            </div>

                            <div className={styles.cardFooter}>
                                <div className={styles.readyStatus}>
                                    <span className={styles.readyDot} />
                                    Sẵn sàng phỏng vấn ngay
                                </div>
                                <span className={styles.atsVerified}>Hồ sơ ATS Verified ✓</span>
                            </div>
                        </div>

                        {/* AI score pill — absolute bên trong cardGroup */}
                        <div className={`${styles.glassCardSubtle} ${styles.aiScorePill}`}>
                            <div className={styles.aiScoreIcon}>
                                <ShieldCheck size={20} strokeWidth={2} aria-hidden="true" />
                            </div>
                            <div>
                                <div className={styles.aiScoreTitle}>95/100 Điểm hồ sơ AI</div>
                                <div className={styles.aiScoreSub}>Tương thích văn hóa &amp; kỹ năng</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom social proof footer */}
                <footer className={styles.heroFooter}>
                    <div className={styles.heroFooterItem}>
                        <ShieldCheck size={16} className={styles.shieldIcon} aria-hidden="true" />
                        <span>Bảo mật theo tiêu chuẩn ISO/IEC 27001</span>
                    </div>
                    <div className={styles.heroFooterStats}>
                        <span>98.4% Tỉ lệ tuyển đúng ứng viên</span>
                        <span>•</span>
                        <span>Cung ứng trong 72h</span>
                    </div>
                </footer>
            </section>

            {/* ===== RIGHT FORM PANEL ===== */}
            <section className={styles.rightPanel} aria-label="Authentication">

                {onBack && (
                    <div className={styles.panelHeader}>
                        <Button
                            type="button"
                            variant="outline"
                            className={styles.backBtn}
                            onClick={onBack}
                        >
                            <ArrowLeft size={16} aria-hidden="true" />
                            <span>Quay lại</span>
                        </Button>
                    </div>
                )}

                <div className={styles.centerArea}>
                    {/* Brand logo */}
                    <div className={styles.logoWrapper}>
                        <img src={capyByteSrc} alt="CapyByte, linh vật của SIRS" className={styles.mascotPortrait} width={96} height={96} />
                        <img src={logoSrc} alt="SIRS Logo" className={styles.logoImg} />
                    </div>

                    {/* Page content (LoginForm / RegisterForm, etc.) */}
                    <div className={styles.formContainer}>
                        {children}
                    </div>
                </div>

            </section>

        </div>
    );
};

export default AuthLayout;
