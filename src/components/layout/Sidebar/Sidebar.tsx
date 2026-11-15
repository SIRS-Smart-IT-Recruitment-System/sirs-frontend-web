import { NavLink } from "react-router-dom";
import { navigation } from "../../../constants/navigation";
import type { SidebarRole } from "../../../constants/navigation";
import styles from "./Sidebar.module.css";

interface SidebarProps {
    role: SidebarRole;
    progress?: number;
}

function Sidebar({ role, progress = 80 }: SidebarProps) {
    const menuItems = navigation[role];

    return (
        <aside className={styles.sidebar}>
            {/* Logo */}
            <div className={styles.sidebarLogo}>
                <span>SIRS</span>
            </div>

            {/* Navigation */}
            <nav className={styles.sidebarNav}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `${styles.sidebarLink} ${
                                isActive ? styles.active : ""
                            }`
                        }
                    >
                        <span className={styles.sidebarIcon}>
                            {item.icon}
                        </span>

                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Profile Progress */}
            <div className={styles.sidebarProgress}>
                <h4>Tiến độ hồ sơ</h4>

                <div className={styles.progressContent}>
                    <div className={styles.progressCircle}>
                        {progress}%
                    </div>

                    <div className={styles.progressInfo}>
                        <span>Đã hoàn thành</span>
                        <small>Hãy bổ sung thông tin còn thiếu</small>
                    </div>
                </div>

                <div className={styles.progressBar}>
                    <div
                        className={styles.progressBarFill}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;