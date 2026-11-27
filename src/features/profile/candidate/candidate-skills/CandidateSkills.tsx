import styles from "./CandidateSkills.module.css";

interface CandidateSkillsProps {
    languages: string[];
}

function CandidateSkills({ languages }: CandidateSkillsProps) {
    if (!languages.length) return null;

    return (
        <div className={styles.skills}>
            <h3>Ngôn ngữ trong các kho mã</h3>
            <ul>
                {languages.map((language) => (
                    <li key={language}>{language}</li>
                ))}
            </ul>
        </div>
    );
}

export default CandidateSkills;
