import { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { Button } from "../../../components/common";
import CandidateProfileContent from "../../../features/profile/candidate/candidate-profile-content/CandidateProfileContent";
import CandidateProfileDetails from "../../../features/profile/candidate/candidate-profile-details/CandidateProfileDetails";
import CandidateProfileSummary from "../../../features/profile/candidate/candidate-profile-summary/CandidateProfileSummary";
import EditCandidateModal from "../../../features/profile/candidate/edit-candidate-modal/EditCandidateModal";
import ProfileStatistics from "../../../features/profile/candidate/profile-statistics/ProfileStatistics";
import type { CandidateAccount } from "../../../features/profile/candidate/useCandidateAccount";
import type { CandidateProfileResponse } from "../../../types/authTypes";
import feedback from "../../../features/profile/ProfileFeedback.module.css";
import styles from "./CandidateProfile.module.css";

function CandidateProfile() {
    const location = useLocation();
    const email = localStorage.getItem("accountEmail")?.trim();
    const {
        profile,
        loading,
        missing,
        error,
        retry,
        updateProfile,
    } = useOutletContext<CandidateAccount>();
    const [shareError, setShareError] = useState("");
    const [success, setSuccess] = useState("");
    const [editing, setEditing] = useState(false);
    useEffect(() => {
        if (profile && location.hash) {
            document.getElementById(location.hash.slice(1))?.scrollIntoView();
        }
    }, [profile, location.hash, location.key]);

    function handleSaved(saved: CandidateProfileResponse) {
        updateProfile(saved);
        setEditing(false);
        setSuccess("Đã lưu hồ sơ cá nhân.");
    }

    async function shareProfile() {
        setShareError("");
        try {
            await navigator.clipboard.writeText(window.location.href);
            setSuccess("Đã sao chép liên kết trang hồ sơ.");
        } catch {
            setShareError("Không thể sao chép liên kết hồ sơ trên trình duyệt này.");
        }
    }

    function openEditor() {
        setSuccess("");
        setEditing(true);
    }

    const link = profile?.cvUrl?.trim();
    const cvUrl = link && /^https?:\/\//i.test(link) ? link : undefined;
    const fields = [
        { label: "Họ tên", complete: Boolean(profile?.name?.trim()) },
        { label: "Giới thiệu bản thân", complete: Boolean(profile?.bio?.trim()) },
        { label: "Số điện thoại", complete: Boolean(profile?.phoneNumber?.trim()) },
        { label: "Liên kết CV", complete: Boolean(cvUrl) },
        { label: "Ảnh đại diện", complete: Boolean(profile?.avatarUrl?.trim()) },
        { label: "Trạng thái tìm việc", complete: Boolean(profile?.jobStatus) },
    ];
    const completed = fields.filter((field) => field.complete).length;
    const completion = Math.round(completed / fields.length * 100);

    return (
        <>
            <div className={styles.page}>
                <CandidateProfileSummary
                    profile={profile}
                    email={email}
                    loading={loading}
                    canEdit={Boolean(profile || missing)}
                    cvUrl={cvUrl}
                    onEdit={openEditor}
                    onShare={shareProfile}
                />

                {success && <p className={feedback.alertSuccess} role="status">{success}</p>}
                {shareError && <p role="alert" className={feedback.alertError}>{shareError}</p>}
                {missing && <p role="status">Tài khoản này chưa có hồ sơ ứng viên.</p>}
                {error && (
                    <div className={feedback.alertError} role="alert">
                        <p>{error}</p>
                        <Button variant="outline" onClick={retry}>Thử lại</Button>
                    </div>
                )}

                {profile && (
                    <>
                        <ProfileStatistics
                            key={profile.candidateId}
                            candidateId={profile.candidateId}
                        />
                        <div className={styles.columns}>
                            <CandidateProfileContent candidateId={profile.candidateId} />
                            <CandidateProfileDetails
                                onEdit={openEditor}
                                fields={fields}
                                completion={completion}
                            />
                        </div>
                    </>
                )}
            </div>
            {editing && (
                <EditCandidateModal
                    profile={profile}
                    onClose={() => setEditing(false)}
                    onSaved={handleSaved}
                />
            )}
        </>
    );
}

export default CandidateProfile;
