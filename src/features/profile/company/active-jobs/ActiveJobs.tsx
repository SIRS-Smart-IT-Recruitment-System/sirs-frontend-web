import {
    BriefcaseBusiness,
    Users,
    CalendarDays,
} from "lucide-react";

import styles from "./ActiveJobs.module.css";

export interface ActiveJobItem {
    id: number | string;
    name: string;
    applications: number;
    deadline: string;
    status: string;
}

interface ActiveJobsProps {
    jobs?: ActiveJobItem[];
}

function ActiveJobs({ jobs = [] }: ActiveJobsProps) {
    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <h2>Tin tuyển dụng đang hoạt động</h2>

                <span className={styles.jobCount}>
                    {jobs.length} tin
                </span>
            </div>

            <div className={styles.jobList}>
                {jobs.length === 0 ? (
                    <p>Chưa có tin tuyển dụng nào.</p>
                ) : (
                    jobs.map((job) => (
                        <div
                            className={styles.jobItem}
                            key={job.id}
                        >
                            <div className={styles.jobIcon}>
                                <BriefcaseBusiness size={19} />
                            </div>

                            <div className={styles.jobInfo}>
                                <h3>{job.name}</h3>

                                <div className={styles.jobMeta}>
                                    <span>
                                        <Users size={14} />
                                        {job.applications} ứng viên
                                    </span>

                                    <span>
                                        <CalendarDays size={14} />
                                        Hạn: {job.deadline}
                                    </span>
                                </div>
                            </div>

                            <span className={styles.status}>
                                {job.status}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

export default ActiveJobs;
