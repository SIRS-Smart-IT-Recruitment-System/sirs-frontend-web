import { BriefcaseBusiness, Gauge, Star, UserRoundCheck } from "lucide-react";
import styles from "./CompanyStatistics.module.css";

interface CompanyStatisticsProps {
    openJobs: number;
}

function CompanyStatistics({ openJobs }: CompanyStatisticsProps) {
    const metrics = [
        {
            label: "Vị trí đang phụ trách",
            value: openJobs,
            unit: "vị trí",
            detail: "Đang tiếp nhận hồ sơ",
            icon: BriefcaseBusiness,
            color: "blue",
        },
        {
            label: "Tuyển thành công",
            value: 38,
            unit: "nhân sự",
            detail: "+6 trong tháng này",
            icon: UserRoundCheck,
            color: "green",
        },
        {
            label: "Thời gian tuyển",
            value: 14,
            unit: "ngày / vị trí",
            detail: "Trung bình từ mở tin đến nhận việc",
            icon: Gauge,
            color: "cyan",
        },
        {
            label: "Đánh giá từ ứng viên",
            value: "4,9",
            unit: "/ 5",
            detail: "124 lượt đánh giá",
            icon: Star,
            color: "amber",
        },
    ];

    return (
        <dl className={styles.grid} aria-label="Hiệu quả tuyển dụng">
            {metrics.map(({ label, value, unit, detail, icon: Icon, color }) => (
                <div key={label} className={styles.card} data-color={color}>
                    <dt>
                        {label}
                        <span><Icon size={18} aria-hidden="true" /></span>
                    </dt>
                    <dd>
                        <strong>{value}</strong> {unit}
                        <small>{detail}</small>
                    </dd>
                </div>
            ))}
        </dl>
    );
}

export default CompanyStatistics;
