import {
    FileText,
    BriefcaseBusiness,
    Eye,
    CalendarDays,
} from "lucide-react";

import styles from "./ProfileStatistics.module.css";

const statistics = [
    {
        title: "CV đã tải lên",
        value: 3,
        description: "Tài liệu hồ sơ",
        icon: FileText,
        color: "blue",
    },
    {
        title: "Việc làm đã ứng tuyển",
        value: 12,
        description: "Tổng đơn ứng tuyển",
        icon: BriefcaseBusiness,
        color: "purple",
    },
    {
        title: "Lượt xem hồ sơ",
        value: 86,
        description: "Nhà tuyển dụng đã xem",
        icon: Eye,
        color: "green",
    },
    {
        title: "Lịch phỏng vấn",
        value: 3,
        description: "Cuộc hẹn sắp tới",
        icon: CalendarDays,
        color: "orange",
    },
];

function ProfileStatistics() {
    return (
        <section className={styles.statistics}>
            {statistics.map((item) => {
                const Icon = item.icon;

                return (
                    <div className={styles.card} key={item.title}>
                        <div className={`${styles.icon} ${styles[item.color]}`}>
                            <Icon size={21} />
                        </div>

                        <h2>{item.value}</h2>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                    </div>
                );
            })}
        </section>
    );
}

export default ProfileStatistics;
