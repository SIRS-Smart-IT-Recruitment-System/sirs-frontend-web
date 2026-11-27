import { useEffect, useRef, useState } from "react";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";

import {
    Bell,
    UserRound,
    LogOut,
} from "lucide-react";

import { ROUTES } from "../../../routers/routePaths.ts";
import { navigation } from "../../../constants/navigation";
import type { SidebarRole } from "../../../constants/navigation.ts";
import { HEADER_CONFIG } from "../../../constants/headerConfig.ts";
import Avatar from "../../../components/common/avatar/Avatar";
import Modal from "../../../components/common/modal/Modal";
import Button from "../../../components/common/button/Button";
import Spinner from "../../../components/common/spinner/Spinner";
import { logout } from "../../../services/authService";

import type { CandidateProfileResponse } from "../../../types/authTypes";
import styles from "./Header.module.css";

interface HeaderProps {
    role: SidebarRole;
    profile: CandidateProfileResponse | null;
    loadingName: boolean;
}

const detailPages = [
    { path: ROUTES.CANDIDATE.JOB_DETAIL, label: "Chi tiết tuyển dụng" },
    { path: ROUTES.RECRUITER.JOB_CREATE, label: "Tạo tin tuyển dụng" },
];

function Header({
    role,
    profile,
    loadingName,
}: HeaderProps) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
    const accountArea = useRef<HTMLDivElement>(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    useEffect(() => {
        if (!showAccount) return;
        function closeOutside(event: PointerEvent) {
            if (event.target instanceof Node && !accountArea.current?.contains(event.target)) {
                setShowAccount(false);
            }
        }
        document.addEventListener("pointerdown", closeOutside);
        return () => document.removeEventListener("pointerdown", closeOutside);
    }, [showAccount]);

    const config = HEADER_CONFIG[role];

    const accountEmail = localStorage.getItem("accountEmail");
    const displayName =
        profile?.name?.trim() ||
        accountEmail ||
        config.defaultUserName;
    const profilePath = role === "candidate"
        ? ROUTES.CANDIDATE.PROFILE
        : ROUTES.RECRUITER.PROFILE;

    const currentPage = [...navigation[role], ...detailPages].find(
        (item) => item.path && matchPath(item.path, pathname)
    );
    const pageTitle = matchPath(profilePath, pathname)
        ? "Hồ sơ cá nhân"
        : currentPage?.label;

    // Xử lý mở Modal đăng xuất
    const handleOpenLogoutModal = () => {
        setShowAccount(false);
        setShowLogoutModal(true);
    };

    // Xác nhận đăng xuất
    const handleConfirmLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        } finally {
            setIsLoggingOut(false);
            setShowLogoutModal(false);
            navigate(ROUTES.LOGIN, {
                replace: true,
                state: { toastMessage: "Đăng xuất thành công" },
            });
        }
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <header className={styles.header}>
            <nav className={styles.breadcrumb} aria-label="Đường dẫn điều hướng">
                <span>{config.userRole}</span>
                {pageTitle && (
                    <>
                        <span aria-hidden="true">/</span>
                        <strong aria-current="page" title={pageTitle}>{pageTitle}</strong>
                    </>
                )}
            </nav>
            <div className={styles.headerRight}>
                <div className={styles.languageToggle} aria-label="Ngôn ngữ hiện tại: Tiếng Việt">
                    <span className={styles.languageActive}>VI</span>
                    <span>EN</span>
                </div>
                <button
                    type="button"
                    className={styles.iconButton}
                    title="Thông báo"
                    onClick={() => {
                        setShowAccount(false);
                        setShowNotifications(true);
                    }}
                >
                    <Bell size={20} />
                </button>

                <div className={styles.accountArea} ref={accountArea}>
                    <button
                        type="button"
                        className={styles.avatarButton}
                        onClick={() => setShowAccount(!showAccount)}
                        aria-label="Tài khoản"
                        title={displayName}
                        aria-expanded={showAccount}
                    >
                        <Avatar
                            key={profile?.avatarUrl}
                            name={displayName}
                            src={profile?.avatarUrl}
                            className={styles.avatar}
                            size="sm"
                        />
                    </button>

                    {showAccount && (
                        <div className={styles.accountDropdown}>
                            <div className={styles.accountSummary}>
                                {loadingName ? (
                                    <Spinner size="xs" label="Đang tải tên…" />
                                ) : (
                                    <strong>{displayName}</strong>
                                )}
                                <span>{config.userRole}</span>
                            </div>

                            <Link
                                to={profilePath}
                                onClick={() => setShowAccount(false)}
                            >
                                <UserRound size={17} />
                                Hồ sơ cá nhân
                            </Link>

                            <button
                                type="button"
                                onClick={handleOpenLogoutModal}
                            >
                                <LogOut size={17} />
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                title="Thông báo"
            >
                <p>Chưa có thông báo để hiển thị.</p>
            </Modal>
            <Modal
                isOpen={showLogoutModal}
                onClose={handleCancelLogout}
                title="Xác nhận đăng xuất"
                footer={
                    <>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCancelLogout}
                            disabled={isLoggingOut}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="button"
                            variant="danger"
                            onClick={handleConfirmLogout}
                            loading={isLoggingOut}
                        >
                            Đăng xuất
                        </Button>
                    </>
                }
            >
                <p className={styles.logoutModalText}>
                    Bạn có chắc chắn muốn đăng xuất không?
                </p>
            </Modal>
        </header>
    );
}

export default Header;
