
import { useState } from "react";
import {
    UserRound,
    Pencil,
    Phone,
    Mail,
    Share2,
    ChevronDown,
    CheckCircle2,
} from "lucide-react";

import styles from "./Candidate.module.css";

function Candidate() {
    const [jobStatus, setJobStatus] = useState("Đang tìm việc");
    const [showStatus, setShowStatus] = useState(false);

    const statuses = [
        "Đang tìm việc",
        "Đang cân nhắc",
        "Đã có việc làm",
    ];

    return (
        <div className={styles.candidate}>
            <div className={styles.profileCard}>

                {/* Avatar */}
                <div className={styles.avatarWrapper}>
                    <div className={styles.avatar}>
                        <UserRound size={98} strokeWidth={2.5} />
                    </div>

                    <button
                        type="button"
                        className={styles.avatarEdit}
                        aria-label="Chỉnh sửa ảnh đại diện"
                    >
                        <Pencil size={15} />
                    </button>
                </div>

                {/* Candidate information */}
                <div className={styles.profileInfo}>

                    <div className={styles.nameRow}>
                        <h2>Nguyễn Văn A</h2>

                        <span className={styles.githubBadge}>
                            <CheckCircle2 size={11} />
                            GitHub Connected
                        </span>
                    </div>

                    <p className={styles.role}>Ứng viên</p>

                    <div className={styles.contactInfo}>

                        <div className={styles.contactItem}>
                            <Phone size={19} />
                            <span>0123456789</span>
                        </div>

                        <span className={styles.separator}>•</span>

                        <div className={styles.contactItem}>
                            <Mail size={20} />
                            <span>nguyenvana@email.com</span>
                        </div>

                        <span className={styles.separator}>•</span>

                        {/* Job status */}
                        <div className={styles.statusWrapper}>
                            <button
                                type="button"
                                className={styles.jobStatus}
                                onClick={() =>
                                    setShowStatus(!showStatus)
                                }
                            >
                                <span className={styles.statusDot}></span>

                                {jobStatus}

                                <ChevronDown size={15} />
                            </button>

                            {showStatus && (
                                <div className={styles.statusDropdown}>
                                    {statuses.map((status) => (
                                        <button
                                            type="button"
                                            key={status}
                                            onClick={() => {
                                                setJobStatus(status);
                                                setShowStatus(false);
                                            }}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Action buttons */}
                <div className={styles.actions}>

                    <button
                        type="button"
                        className={styles.shareButton}
                    >
                        <Share2 size={20} />
                        Chia sẻ hồ sơ
                    </button>

                    <button
                        type="button"
                        className={styles.editButton}
                    >
                        <Pencil size={19} />
                        Chỉnh sửa hồ sơ
                    </button>

                </div>
            </div>
        </div>
    );
}

export default Candidate;
