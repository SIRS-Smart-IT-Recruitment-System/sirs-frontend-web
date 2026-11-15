import { BriefcaseBusiness, Users, CalendarDays } from "lucide-react";
import { jobs } from "../recruiterProfileData";
import styles from "./ActiveJobs.module.css";

function ActiveJobs() {
    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <h2>Tin tuyển dụng đang hoạt động</h2>
                <span className={styles.jobCount}>
                    {jobs.length} tin
                </span>
            </div>

            <div className={styles.jobList}>
                {jobs.map((job) => (
                    <div className={styles.jobItem} key={job.id}>
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
                            Đang tuyển
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ActiveJobs;