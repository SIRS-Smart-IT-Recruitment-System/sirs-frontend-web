import { CalendarClock } from "lucide-react";
import panel from "../CompanyPanel.module.css";

function InterviewSchedule() {
    return (
        <section>
            <div className={panel.heading}>
                <h2><CalendarClock size={20} /> Lịch hẹn phỏng vấn</h2>
            </div>
            <p className={panel.description}>Khung giờ phỏng vấn gợi ý · Giờ Việt Nam</p>
            <div className={panel.tags}>
                <span className={panel.tag}>Thứ Ba · 09:00 – 10:00</span>
                <span className={panel.tag}>Thứ Năm · 14:00 – 15:00</span>
            </div>
            <h3 className={panel.subheading}>Liên kết đặt lịch</h3>
            <p className={panel.description}>Chưa có liên kết đặt lịch công khai.</p>
        </section>
    );
}

export default InterviewSchedule;
