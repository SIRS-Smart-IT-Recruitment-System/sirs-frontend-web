import {
    ArrowRight,
    Banknote,
    BriefcaseBusiness,
    Code2,
    Gift,
    IdCard,
    Terminal,
    Building2,
    Circle,
    CircleCheck,
    MapPin,
} from "lucide-react";

import { profilePreview } from "../profilePreview";
import panel from "../CandidatePanel.module.css";
import styles from "./CandidateProfileDetails.module.css";

const samplePreferences = [
    { label: "Mức lương kỳ vọng", value: profilePreview.salary + " NET / tháng", icon: Banknote },
    { label: "Hình thức làm việc", value: "Hybrid hoặc Remote", icon: Building2 },
    { label: "Vị trí hướng tới", value: "Senior Backend, Tech Lead", icon: BriefcaseBusiness },
    { label: "Phúc lợi ưu tiên", value: "Bảo hiểm sức khỏe, cổ phần ESOP", icon: Gift },
];

const sampleVerifications = [
    { name: "GitHub Developer Profile", detail: "Hồ sơ mã nguồn", icon: Code2 },
    { name: "LinkedIn Talent", detail: "Kết nối nghề nghiệp", icon: IdCard },
    { name: "Codility Assessment", detail: "Đánh giá kỹ thuật", icon: Terminal },
];

interface CandidateProfileDetailsProps {
    fields: Array<{ label: string; complete: boolean }>;
    completion: number;
    onEdit: () => void;
}

function CandidateProfileDetails({
    fields,
    completion,
    onEdit,
}: CandidateProfileDetailsProps) {
    const nextField = fields.find((field) => !field.complete);

    return (
        <aside className={styles.sideColumn}>
            <section className={panel.card}>
                <div className={panel.heading}>
                    <h2>Mức độ hoàn thiện</h2>
                    <span className={styles.percent}>{completion}%</span>
                </div>
                <progress
                    className={styles.completion}
                    value={completion}
                    max={100}
                    aria-label="Mức độ hoàn thiện hồ sơ"
                />
                <ul className={styles.checkList}>
                    {fields.map((field) => (
                        <li key={field.label} data-complete={field.complete}>
                            {field.complete
                                ? <CircleCheck size={16} />
                                : <Circle size={16} />}
                            <span>{field.label}</span>
                            <b>{field.complete ? "Đã có" : "Còn thiếu"}</b>
                        </li>
                    ))}
                </ul>
                {nextField && (
                    <button type="button" className={styles.completeAction} onClick={onEdit}>
                        Bổ sung {nextField.label.toLocaleLowerCase("vi")}
                        <ArrowRight size={16} aria-hidden="true" />
                    </button>
                )}
            </section>

            <section className={panel.card}>
                <div className={panel.heading}>
                    <h2>Xác thực đa nền tảng</h2>
                </div>
                <div className={styles.verifications}>
                    {sampleVerifications.map(({ name, detail, icon: Icon }) => (
                        <article key={name}>
                            <span className={styles.verifyIcon}>
                                <Icon size={18} aria-hidden="true" />
                            </span>
                            <div>
                                <strong>{name}</strong>
                                <span>{detail}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className={panel.card}>
                <div className={panel.heading}>
                    <h2>Tiêu chí tìm việc</h2>
                </div>
                <div className={styles.preferences}>
                    {samplePreferences.map(({ label, value, icon: Icon }) => (
                        <article key={label}>
                            <Icon size={17} aria-hidden="true" />
                            <div>
                                <span>{label}</span>
                                <strong>{value}</strong>
                            </div>
                        </article>
                    ))}
                    <p>
                        <MapPin size={15} />
                        TP. Hồ Chí Minh · Hybrid / Remote
                    </p>
                </div>
            </section>
        </aside>
    );
}

export default CandidateProfileDetails;
