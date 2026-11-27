import { BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";

import type { JobPreview } from "../../../jobs/jobPreviewData";
import { ROUTES } from "../../../../routers/routePaths";
import panel from "../CompanyPanel.module.css";
import styles from "./ActiveJobs.module.css";

const stageLabels = ["Sàng lọc", "Đánh giá", "Phỏng vấn", "Đề nghị"];
const stageCountsByJob: Record<string, number[]> = {
    "preview-frontend": [10, 4, 3, 1],
    "preview-backend": [7, 3, 2, 0],
};

function ActiveJobs({ jobs }: { jobs: JobPreview[] }) {
    return (
        <section>
            <div className={panel.heading}>
                <h2><BriefcaseBusiness size={20} /> Vị trí đang phụ trách</h2>
                <Link to={ROUTES.RECRUITER.JOBS}>Quản lý tin →</Link>
            </div>
            <div className={styles.list}>
                {jobs.map((job) => (
                    <article key={job.id} className={styles.job}>
                        <div className={styles.title}>
                            <h3>{job.title}</h3>
                            <span className={panel.tag}>{job.applicants} hồ sơ</span>
                        </div>
                        <p>{job.category} · {job.location} · {job.salary}</p>
                        <dl className={styles.stages}>
                            {stageLabels.map((label, index) => (
                                <div key={label}>
                                    <dt>{label}</dt>
                                    <dd>{stageCountsByJob[job.id]?.[index] ?? "—"}</dd>
                                </div>
                            ))}
                        </dl>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default ActiveJobs;
