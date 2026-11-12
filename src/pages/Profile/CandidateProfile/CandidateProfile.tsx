import DashboardLayout from "../../../layout/DashboardLayout/DashboardLayout.tsx";
import Candidate from "../../../components/profile/candidate/Candidate.tsx";

function CandidateProfile() {
    return (
        <DashboardLayout activeItem="profile">
            <Candidate />
        </DashboardLayout>
    );
}

export default CandidateProfile;