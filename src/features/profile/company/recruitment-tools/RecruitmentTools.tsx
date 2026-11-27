import { CalendarDays, GitFork, Network, UsersRound, Video } from "lucide-react";
import panel from "../CompanyPanel.module.css";

const tools = [
    { name: "Google Calendar", detail: "Lịch phỏng vấn", icon: CalendarDays },
    { name: "Google Meet", detail: "Phòng phỏng vấn trực tuyến", icon: Video },
    { name: "LinkedIn Recruiter", detail: "Tìm kiếm ứng viên", icon: UsersRound },
    { name: "GitHub", detail: "Đối chiếu dự án kỹ thuật", icon: GitFork },
];

function RecruitmentTools() {
    return (
        <section>
            <div className={panel.heading}>
                <h2><Network size={20} /> Công cụ tuyển dụng</h2>
            </div>
            <ul className={panel.list}>
                {tools.map(({ name, detail, icon: Icon }) => (
                    <li className={panel.row} key={name}>
                        <Icon size={20} aria-hidden="true" />
                        <div>
                            <strong>{name}</strong>
                            <small>{detail}</small>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default RecruitmentTools;
