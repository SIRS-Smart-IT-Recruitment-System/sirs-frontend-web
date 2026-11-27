import { Link, useLocation } from "react-router-dom";
import {
    Award,
    BriefcaseBusiness,
    Code2,
    GraduationCap,
    TrendingUp,
} from "lucide-react";

import { profilePreview } from "../profilePreview";
import CandidatePortfolio from "../candidate-portfolio/CandidatePortfolio";
import panel from "../CandidatePanel.module.css";
import styles from "./CandidateProfileContent.module.css";

const sampleExperiences = [
    {
        company: "TechCorp Vietnam",
        title: "Senior Full-stack Engineer · Tech Lead",
        period: "03/2022 – Hiện tại",
        description:
            "Dẫn dắt nhóm kỹ thuật xây dựng sản phẩm web, phối hợp cùng các nhóm sản phẩm và thiết kế.",
        outcomes: ["500.000 người dùng đồng thời", "Giảm 40% chi phí hạ tầng"],
        skills: ["Golang", "Kubernetes", "AWS EKS", "Kafka", "PostgreSQL"],
    },
    {
        company: "FinScale Asia",
        title: "Full-stack Developer",
        period: "06/2020 – 02/2022",
        description:
            "Phát triển tính năng cho nền tảng tài chính và tối ưu trải nghiệm ứng dụng web.",
        outcomes: ["Cải thiện 55% thời gian tải nội dung chính"],
        skills: ["React", "Next.js", "Redis"],
    },
    {
        company: "CloudNexus Studio",
        title: "Backend Engineer",
        period: "05/2018 – 05/2020",
        description:
            "Xây dựng API và dịch vụ backend, làm việc với hệ thống cơ sở dữ liệu quan hệ và NoSQL.",
        outcomes: [],
        skills: ["Go", "Docker", "gRPC"],
    },
];

const tabs = [
    { id: "experience", label: "Kinh nghiệm & thành tựu", icon: BriefcaseBusiness },
    { id: "skills", label: "Kỹ năng & chứng chỉ", icon: GraduationCap },
    { id: "projects", label: "Dự án thực chiến", icon: Code2 },
] as const;

const sampleSkills = [
    { label: "Phát triển ứng dụng", level: "Nổi bật", score: 88 },
    { label: "Thiết kế hệ thống", level: "Tốt", score: 76 },
    { label: "Làm việc nhóm", level: "Tốt", score: 82 },
    { label: "Giao tiếp", level: "Khá", score: 68 },
];

const sampleQualifications = [
    ...profilePreview.certificates,
    "Kỹ thuật phần mềm",
];

interface CandidateProfileContentProps {
    candidateId: string;
}

function CandidateProfileContent({ candidateId }: CandidateProfileContentProps) {
    const { hash, search } = useLocation();
    const active = tabs.find((tab) => "#" + tab.id === hash) ?? tabs[0];

    return (
        <div className={styles.mainColumn}>
            <nav className={styles.sectionTabs} aria-label="Các phần hồ sơ">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <Link
                        key={id}
                        to={{ search, hash: "#" + id }}
                        className={id === active.id ? styles.activeTab : undefined}
                        aria-current={id === active.id ? "location" : false}
                    >
                        <Icon size={17} aria-hidden="true" />
                        {label}
                    </Link>
                ))}
            </nav>

            <section
                className={panel.card}
                id={active.id}
                aria-label={active.label}
            >
                {active.id === "experience" ? (
                    <>
                        <header className={panel.heading}>
                            <h2>Lộ trình sự nghiệp & cột mốc</h2>
                        </header>
                        <ol className={styles.timeline}>
                            {sampleExperiences.map((experience) => (
                                <li key={experience.company} className={styles.experience}>
                                    <div className={styles.experienceTop}>
                                        <div>
                                            <h3>{experience.company}</h3>
                                            <strong>{experience.title}</strong>
                                        </div>
                                        <span className={styles.period}>
                                            {experience.period}
                                        </span>
                                    </div>
                                    <p>{experience.description}</p>
                                    {experience.outcomes.length > 0 && (
                                        <ul className={styles.outcomes}>
                                            {experience.outcomes.map((outcome) => (
                                                <li key={outcome}>
                                                    <TrendingUp size={15} aria-hidden="true" />
                                                    {outcome}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <ul className={styles.tags}>
                                        {experience.skills.map((skill) => (
                                            <li key={skill}>{skill}</li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ol>
                    </>
                ) : (
                    <>
                        <CandidatePortfolio
                            candidateId={candidateId}
                            skillsOnly={active.id === "skills"}
                        />
                        {active.id === "skills" && (
                            <div className={styles.qualifications}>
                                <header className={panel.heading}>
                                    <h2>Kỹ năng, chứng chỉ & học vấn</h2>
                                </header>
                                <ul className={styles.skillList}>
                                    {sampleSkills.map(({ label, level, score }) => (
                                        <li key={label}>
                                            <span>{label}</span>
                                            <strong>{level}</strong>
                                            <progress
                                                aria-label={label}
                                                value={score}
                                                max={100}
                                            />
                                        </li>
                                    ))}
                                </ul>
                                <ul className={styles.certificates}>
                                    {sampleQualifications.map((title) => (
                                        <li key={title}>
                                            <Award size={20} aria-hidden="true" />
                                            {title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}

export default CandidateProfileContent;
