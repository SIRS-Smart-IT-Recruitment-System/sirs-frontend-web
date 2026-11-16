
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routers/routePaths";
import {
    Search,
    SlidersHorizontal,
    CircleHelp,
    Bell,
    ChevronDown,
    UserRound,
    LogOut,
} from "lucide-react";

import styles from "./Header.module.css";

interface HeaderProps {
    userName?: string;
    userRole?: string;
}

function Header({
                    userName = "Công ty ABC",
                    userRole = "Nhà tuyển dụng",
                }: HeaderProps) {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [showAccount, setShowAccount] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        navigate(ROUTES.LOGIN);
    };

    return (
        <header className={styles.header}>
            <div className={styles.searchArea}>
                <div className={styles.searchBox}>
                    <Search size={19} />

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
                    <SlidersHorizontal size={20} />
                </button>
            </div>

            <div className={styles.headerRight}>
                <button
                    type="button"
                    className={styles.iconButton}
                    title="Trợ giúp"
                >
                    <CircleHelp size={21} />
                </button>

                <button
                    type="button"
                    className={styles.iconButton}
                    title="Thông báo"
                >
                    <Bell size={21} />
                </button>

                <div className={styles.accountArea}>
                    <div className={styles.accountText}>
                        <strong>{userName}</strong>
                        <span>{userRole}</span>
                    </div>

                    <button
                        type="button"
                        className={styles.avatarButton}
                        onClick={() => setShowAccount(!showAccount)}
                        aria-label="Tài khoản"
                    >
                        <UserRound size={27} />
                        <ChevronDown size={17} />
                    </button>

                    {showAccount && (
                        <div className={styles.accountDropdown}>
                            <button type="button">
                                <UserRound size={17} />
                                Thông tin tài khoản
                            </button>

                            <button type="button" onClick={handleLogout}>
                                <LogOut size={17} />
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
