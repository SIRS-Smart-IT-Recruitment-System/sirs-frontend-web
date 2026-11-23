
import { Code2, Plus } from "lucide-react";
import styles from "./CandidateSkills.module.css";

const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "ReactJS",
    "NodeJS",
    "Java",
    "Spring Boot",
    "SQL",
    "Git",
    "REST API",
    "Responsive Design",
    "Figma",
    "OOP",
    "Agile",
    "Teamwork",
    "Communication",
    "Problem Solving",
];

function CandidateSkills() {
    return (
        <section className={styles.card}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <div className={styles.icon}>
                        <Code2 size={19} />
                    </div>

                    <div>
                        <h3>Kỹ năng của tôi</h3>
                        <p>Các kỹ năng chuyên môn và kỹ năng cá nhân</p>
                    </div>
                </div>

                <button type="button" className={styles.addButton}>
                    <Plus size={15} />
                    Thêm kỹ năng
                </button>
            </div>

            <div className={styles.skillGrid}>
                {skills.map((skill) => (
                    <div className={styles.skillItem} key={skill}>
                        <span className={styles.dot} />
                        {skill}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default CandidateSkills;
