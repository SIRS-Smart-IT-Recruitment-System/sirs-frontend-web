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

import styles from "./Header.module.css";

interface HeaderProps {
    role: SidebarRole,
    userName?: string,
    userRole?: string | undefined
}

function Header({role, userName, userRole}: HeaderProps) {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [showAccount, setShowAccount] = useState(false);

    // Lấy cấu hình Header theo role
    const config = HEADER_CONFIG[role];

    // Ưu tiên tên người dùng được truyền từ bên ngoài
    const displayName =
        userName?.trim() || config.defaultUserName;

    // Xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");

        setShowAccount(false);

        navigate(ROUTES.LOGIN);
    };

    return (
        <header className={styles.header}>
            <div className={styles.searchArea}>
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
            </div>

            <div className={styles.headerRight}>
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

                <div className={styles.accountArea}>
                    <div className={styles.accountText}>
                        <strong>{displayName}</strong>
                        <span>{config.userRole}</span>
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
                            <button type="button">
                                <UserRound size={17}/>
                                Thông tin tài khoản
                            </button>

                            <button
                                type="button"
                                onClick={handleLogout}
                            >
                                <LogOut size={17}/>
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
