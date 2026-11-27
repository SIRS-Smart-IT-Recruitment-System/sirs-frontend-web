import { ShieldCheck } from "lucide-react";
import panel from "../CompanyPanel.module.css";

const specialties = [
    "Backend Java / Go",
    "Cloud & DevOps",
    "AI / ML Engineering",
    "Kiến trúc hệ thống",
    "Tuyển dụng quản lý kỹ thuật",
    "Đánh giá năng lực",
];

function RecruitmentExpertise() {
    return (
        <section>
            <div className={panel.heading}>
                <h2><ShieldCheck size={20} /> Chuyên môn tuyển dụng</h2>
            </div>
            <p className={panel.description}>
                Tìm kiếm nhân sự kỹ thuật cấp cao cho đội ngũ sản phẩm và hạ tầng.
                Phối hợp với quản lý kỹ thuật để xây dựng tiêu chí đánh giá,
                phỏng vấn chuyên môn và theo sát ứng viên đến ngày nhận việc.
            </p>
            <div className={panel.tags}>
                {specialties.map((item) => (
                    <span key={item} className={panel.tag}>{item}</span>
                ))}
            </div>
        </section>
    );
}

export default RecruitmentExpertise;
