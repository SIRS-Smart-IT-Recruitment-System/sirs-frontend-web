import { Network, PanelsTopLeft, BriefcaseBusiness, CalendarDays, UsersRound, Building2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navigation } from "../../../constants/navigation.ts";
import type { SidebarRole } from "../../../constants/navigation.ts";
import styles from "./Sidebar.module.css";

interface SidebarProps {
    role: SidebarRole;
    progress?: number;
    workspace?: boolean;
}

const companyIcons = {
    "/company/dashboard": PanelsTopLeft,
    "/company/jobs": BriefcaseBusiness,
    "/company/interviews": CalendarDays,
    "/company/candidates": UsersRound,
    "/company/profile": Building2,
};

function Sidebar({ role, progress = 80, workspace }: SidebarProps) {
    const menuItems = navigation[role];

    return (
        <aside className={workspace ? styles.workspace : styles.sidebar}>
            {/* Logo */}
            <div className={styles.sidebarLogo}>
                {workspace && <Network size={30} />}
                <span>SIRS</span>
            </div>

            {/* Navigation */}
            <nav className={styles.sidebarNav}>
                {menuItems.map((item) => {
                    const Icon = companyIcons[item.path as keyof typeof companyIcons];
                    if (workspace && item.path === "/company/jobs")
                        return (
                            <span
                                key={item.path}
                                className={styles.unavailable}
                                title="Trang quản lý tin chưa được triển khai"
                            >
                                <BriefcaseBusiness size={18} />
                                {item.label}
                            </span>
                        );
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `${styles.sidebarLink} ${isActive ? styles.active : ""}`
                            }
                        >
                            <span className={styles.sidebarIcon}>
                                {workspace && Icon ? <Icon size={18} /> : item.icon}
                            </span>

                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Profile Progress */}
            {!workspace && (
                <div className={styles.sidebarProgress}>
                    <h4>Tiến độ hồ sơ</h4>

                    <div className={styles.progressContent}>
                        <div className={styles.progressCircle}>{progress}%</div>

                        <div className={styles.progressInfo}>
                            <span>Đã hoàn thành</span>
                            <small>Hãy bổ sung thông tin còn thiếu</small>
                        </div>
                    </div>

                    <div className={styles.progressBar}>
                        <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
                    </div>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;
