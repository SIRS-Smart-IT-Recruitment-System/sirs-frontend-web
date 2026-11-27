import {
    ArrowUpRight,
    Bookmark,
    BriefcaseBusiness,
    MapPin,
    Wallet,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/common/button/Button";
import type { JobPreview } from "./jobPreviewData";

import styles from "./JobsPreview.module.css";

interface JobCardProps {
    job: JobPreview;
}

function JobCard({ job }: JobCardProps) {
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);

    const handleOpenDetails = () => {
        navigate(`/candidate/jobs/${job.id}`);
    };

    const handleToggleSaved = () => {
        setSaved((currentValue) => !currentValue);
    };

    return (
        <article className={styles.jobCard}>
            <div className={styles.jobCardTop}>
                <div
                    className={styles.companyMark}
                    aria-hidden="true"
                >
                    {job.initials}
                </div>

                <button
                    type="button"
                    className={`${styles.iconAction} ${saved ? styles.saved : ""}`}
                    aria-label={saved ? "Bỏ lưu tin" : "Lưu tin"}
                    aria-pressed={saved}
                    onClick={handleToggleSaved}
                >
                    <Bookmark size={18} />
                </button>
            </div>

            <div className={styles.jobCardTitleRow}>
                <div>
                    <p className={styles.companyName}>
                        {job.company}
                    </p>
                    <h3>
                        {job.title}
                    </h3>
                </div>

                <span className={styles.matchPill}>
                    Phù hợp
                </span>
            </div>

            <div className={styles.jobMetaList}>
                <span>
                    <MapPin size={15} />
                    {job.location}
                </span>
                <span>
                    <Wallet size={15} />
                    {job.salary}
                </span>
                <span>
                    <BriefcaseBusiness size={15} />
                    {job.level} · {job.workType}
                </span>
            </div>

            <div className={styles.tagRow}>
                <span className={styles.skillTag}>
                    {job.category}
                </span>
                <span className={styles.skillTag}>
                    {job.level}
                </span>
            </div>

            <div className={styles.jobCardFooter}>
                <span>
                    {job.postedAt}
                </span>

                <Button
                    type="button"
                    variant="outline"
                    className={styles.cardDetailButton}
                    onClick={handleOpenDetails}
                >
                    Xem chi tiết
                    <ArrowUpRight size={15} />
                </Button>
            </div>
        </article>
    );
}

export default JobCard;
