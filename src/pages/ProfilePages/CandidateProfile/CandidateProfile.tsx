import MainLayout from "../../../layouts/mainLayout/MainLayout.tsx";
import Candidate from "../../../components/profile/candidate/Candidate.tsx";

function CandidateProfile() {
    return (
        <MainLayout activeItem="profile">
            <Candidate />
        </MainLayout>
    );
}

export default CandidateProfile;