import {useState} from "react";
import {useNavigate} from "react-router-dom";

import {
    Search,
    SlidersHorizontal,
    CircleHelp,
    Bell,
    ChevronDown,
    UserRound,
    LogOut,
} from "lucide-react";

import {ROUTES} from "../../../routers/routePaths.ts";
import type {SidebarRole} from "../../../constants/navigation.ts";
import {HEADER_CONFIG} from "../../../constants/headerConfig.ts";
import Modal from "../../../components/common/modal/Modal";
import Button from "../../../components/common/button/Button";
import {logout} from "../../../services/authService";

import styles from "./Header.module.css";

interface HeaderProps {
    role: SidebarRole,
    sectionTitle?: string,
    userName?: string,
    userRole?: string | undefined
}

function Header({role, userName, userRole, sectionTitle}: HeaderProps) {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [showAccount, setShowAccount] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Lấy cấu hình Header theo role
    const config = HEADER_CONFIG[role];

    // Ưu tiên tên người dùng được truyền từ bên ngoài
    const displayName =
        userName?.trim() || config.defaultUserName;

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
            {sectionTitle ? <div className={styles.breadcrumb}>Nhà tuyển dụng <span>/</span> <strong>{sectionTitle}</strong></div> : <div className={styles.searchArea}>
                <div className={styles.searchBox}>
                    <Search size={19}/>

                    <input
                        type="text"
                        placeholder="Tìm kiếm ...."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <button
                    type="button"
                    className={styles.filterButton}
                    title="Bộ lọc"
                >
                    <SlidersHorizontal size={20}/>
                </button>
            </div>}

            <div className={styles.headerRight}>
                {!sectionTitle && <>
                <button
                    type="button"
                    className={styles.iconButton}
                    title="Trợ giúp"
                >
                    <CircleHelp size={21}/>
                </button>

                <button
                    type="button"
                    className={styles.iconButton}
                    title="Thông báo"
                >
                    <Bell size={21}/>
                </button>

                </>}
                <div className={styles.accountArea}>
                    <div className={styles.accountText}>
                        <strong>{displayName}</strong>
                        <span>{userRole || config.userRole}</span>
                    </div>

                    <button
                        type="button"
                        className={styles.avatarButton}
                        onClick={() => setShowAccount(!showAccount)}
                        aria-label="Tài khoản"
                        aria-expanded={showAccount}
                    >
                        <UserRound size={27}/>
                        <ChevronDown size={17}/>
                    </button>

                    {showAccount && (
                        <div className={styles.accountDropdown}>
                            <button type="button" onClick={() => navigate(role === "company" ? ROUTES.RECRUITER.PROFILE : ROUTES.CANDIDATE.PROFILE)}>
                                <UserRound size={17}/>
                                Thông tin tài khoản
                            </button>

                            <button
                                type="button"
                                onClick={handleOpenLogoutModal}
                            >
                                <LogOut size={17}/>
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>

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
