import { useEffect, useState } from "react";
import {
    Activity,
    ExternalLink,
    FileCheck2,
    FolderGit2,
    GitFork,
    Star,
} from "lucide-react";

import { gitAnalysisService } from "../../../../services/gitAnalysisService";
import type { GithubRepository } from "../../../../services/gitAnalysisService";
import CandidateSkills from "../candidate-skills/CandidateSkills";
import styles from "./CandidatePortfolio.module.css";

interface CandidatePortfolioProps {
    candidateId: string;
    skillsOnly?: boolean;
}

function CandidatePortfolio({ candidateId, skillsOnly = false }: CandidatePortfolioProps) {
    const [repositories, setRepositories] = useState<GithubRepository[]>([]);
    const [message, setMessage] = useState("Đang tải kho mã…");

    useEffect(() => {
        let active = true;

        async function loadRepositories() {
            try {
                const data = await gitAnalysisService.getRepositories(candidateId);
                if (!active) return;
                if (!Array.isArray(data)) {
                    setMessage("Không đọc được danh sách kho mã.");
                    return;
                }
                setRepositories(data);
                setMessage(data.length ? "" : "Chưa có kho mã GitHub đã đồng bộ.");
            } catch {
                if (active) setMessage("Không thể tải các dự án GitHub.");
            }
        }

        loadRepositories();
        return () => {
            active = false;
        };
    }, [candidateId]);

    const languages = [...new Set(
        repositories.map((repo) => repo.primaryLanguage?.trim()).filter(Boolean)
    )];

    return (
        <section className={styles.card}>
            <h2>
                <FolderGit2 size={20} />
                {skillsOnly ? "Kỹ năng từ dự án GitHub" : "Dự án GitHub"}
            </h2>
            {message && <p role="status">{message}</p>}
            {skillsOnly && !message && languages.length === 0 && (
                <p>Các kho mã chưa có thông tin ngôn ngữ.</p>
            )}
            {repositories.length > 0 && <CandidateSkills languages={languages} />}
            {!skillsOnly && repositories.length > 0 && (
                <>
                    <ul className={styles.projects}>
                        {repositories.map((repo) => (
                            <li key={repo.id}>
                                <div className={styles.projectHeading}>
                                    <h3>{repo.fullName || repo.repoName}</h3>
                                    {repo.isSelected && (
                                        <span className={styles.selected}>Được chọn đánh giá</span>
                                    )}
                                </div>
                                {repo.description && (
                                    <p className={styles.description}>{repo.description}</p>
                                )}
                                <ul className={styles.projectFacts}>
                                    {repo.primaryLanguage && (
                                        <li>{repo.primaryLanguage}</li>
                                    )}
                                    <li><Star size={14} /> {repo.starsCount}</li>
                                    <li><GitFork size={14} /> {repo.forksCount}</li>
                                    {repo.repoScore != null && (
                                        <li><Activity size={14} /> Điểm repo {repo.repoScore}</li>
                                    )}
                                    <li>
                                        <FileCheck2 size={14} />
                                        {repo.hasTests ? "Có kiểm thử" : "Chưa có kiểm thử"}
                                    </li>
                                </ul>
                                {/^https?:\/\//i.test(repo.repoUrl) && (
                                    <a href={repo.repoUrl} target="_blank" rel="noopener noreferrer">
                                        Mở kho mã <ExternalLink size={14} />
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </section>
    );
}

export default CandidatePortfolio;
