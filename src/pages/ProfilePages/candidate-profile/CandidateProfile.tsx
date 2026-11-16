import MainLayout from "../../../layouts/main-layout/MainLayout";
import ProfileStatistics from "../../../components/profile/candidate/profile-statistics/ProfileStatistics";
import CandidateSkills from "../../../components/profile/candidate/candidate-skills/CandidateSkills";
import CandidatePortfolio from "../../../components/profile/candidate/candidate-portfolio/CandidatePortfolio";
import CVStorage from "../../../components/profile/candidate/cv-storage/CVStorage";
import styles from "./CandidateProfile.module.css";

function CandidateProfile() {
    return (
        <MainLayout role="candidate">
            <div className={styles.page}>
                <ProfileStatistics />

                <CandidateSkills />

                <div className={styles.documentSection}>
                    <CandidatePortfolio />
                    <CVStorage />
                </div>
            </div>
        </MainLayout>
    );
}

export default CandidateProfile;
