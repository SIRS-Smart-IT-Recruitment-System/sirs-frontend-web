import styles from "./Sidebar.module.css";
import logo from "../../assets/logo.png";
import {
    LayoutDashboard,
    BriefcaseBusiness,
    CalendarDays,
    UserRound,
} from "lucide-react";

export type MenuItem =
    | "overview"
    | "jobs"
    | "interviews"
    | "profile";

interface SidebarProps {
    activeItem: MenuItem;
    onNavigate: (item: MenuItem) => void;
}

const menuItems = [
    {
        id: "overview" as MenuItem,
        icon: LayoutDashboard,
        label: "Tổng quan",
    },
    {
        id: "jobs" as MenuItem,
        icon: BriefcaseBusiness,
        label: "Tìm kiếm việc làm",
    },
    {
        id: "interviews" as MenuItem,
        icon: CalendarDays,
        label: "Lịch phỏng vấn",
    },
    {
        id: "profile" as MenuItem,
        icon: UserRound,
        label: "Hồ sơ ứng viên",
    },
];

function Sidebar({ activeItem, onNavigate }: SidebarProps) {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoWrapper}>
                <img src={logo} alt="SIRS" className={styles.logo} />
            </div>

            <div className={styles.divider} />

            <nav className={styles.navigation}>
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={`${styles.menuItem} ${
                                activeItem === item.id ? styles.active : ""
                            }`}
                            onClick={() => onNavigate(item.id)}>

                            <Icon className={styles.menuIcon} size={20} />

                            <span>{item.label}</span>
                        </button>
                    );
                })}

                <section className={styles.progressCard}>
                    <h3>Tiến độ hồ sơ</h3>

                    <div className={styles.progressInfo}>
                        <div className={styles.progressCircle}>
                            80%
                        </div>

                        <div className={styles.progressText}>
                            <span>Sắp hoàn thành</span>
                            <p>Hãy bổ sung thông tin còn thiếu</p>
                        </div>
                    </div>

                    <div className={styles.progressBar}>
                        <div className={styles.progressValue} />
                    </div>
                </section>
            </nav>
        </aside>
    );
}

export default Sidebar;
