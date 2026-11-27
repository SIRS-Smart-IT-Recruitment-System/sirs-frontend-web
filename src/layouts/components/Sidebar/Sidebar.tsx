import { BrainCircuit, Layers } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import { navigation } from "../../../constants/navigation";
import type { SidebarRole } from "../../../constants/navigation";
import { ROUTES } from "../../../routers/routePaths";

import styles from "./Sidebar.module.css";

interface SidebarProps {
    role: SidebarRole;
}

function Sidebar({ role }: SidebarProps) {
    const candidate = role === "candidate";

    return (
        <aside className={styles.sidebar} data-candidate={candidate || undefined}>
            {candidate ? (
                <Link
                    className={styles.sidebarLogo}
                    to={ROUTES.CANDIDATE.DASHBOARD}
                    aria-label="SIRS AI OS, trang chủ"
                >
                    <BrainCircuit size={34} className={styles.brandIcon} />
                    <span>SIRS AI OS</span>
                </Link>
            ) : (
                <div className={styles.sidebarLogo} aria-label="SIRS">
                    <Layers size={34} className={styles.brandIcon} />
                    <span>SIRS</span>
                </div>
            )}

            <nav className={styles.sidebarNav} aria-label="Điều hướng chính">
                {navigation[role].map(({ label, path, icon: Icon, badge }) => {
                    const content = (
                        <>
                            <span className={styles.sidebarIcon} aria-hidden="true">
                                <Icon size={18} />
                            </span>
                            <span>{label}</span>
                            {badge && <span className={styles.navBadge}>{badge}</span>}
                        </>
                    );

                    if (!path) {
                        return (
                            <span
                                key={label}
                                className={styles.sidebarLink}
                                aria-label={label + " · Chưa có giao diện"}
                                title={label + " · Chưa có giao diện"}
                            >
                                {content}
                            </span>
                        );
                    }

                    return (
                        <NavLink
                            key={path}
                            to={path}
                            title={label}
                            aria-label={label}
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.sidebarLink} ${styles.active}`
                                    : styles.sidebarLink
                            }
                        >
                            {content}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}

export default Sidebar;
