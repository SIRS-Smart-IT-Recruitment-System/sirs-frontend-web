import { Activity } from "lucide-react";
import panel from "../CompanyPanel.module.css";
import styles from "./RecruitmentActivity.module.css";

const events = [
    {
        title: "Gửi thư mời nhận việc",
        detail: "Frontend Engineer · Đang chờ ứng viên phản hồi",
        time: "15:30",
    },
    {
        title: "Xếp lịch phỏng vấn kỹ thuật",
        detail: "Backend Developer · Vòng thiết kế hệ thống",
        time: "11:00",
    },
    {
        title: "Hoàn tất phiếu đánh giá",
        detail: "Frontend Engineer · Đã ghi nhận nhận xét sau phỏng vấn",
        time: "09:15",
    },
];

function RecruitmentActivity() {
    return (
        <section>
            <div className={panel.heading}>
                <h2><Activity size={20} /> Nhật ký hoạt động</h2>
            </div>
            <ol className={styles.timeline}>
                {events.map((event) => (
                    <li key={event.title}>
                        <time>{event.time}</time>
                        <strong>{event.title}</strong>
                        <p>{event.detail}</p>
                    </li>
                ))}
            </ol>
        </section>
    );
}

export default RecruitmentActivity;
