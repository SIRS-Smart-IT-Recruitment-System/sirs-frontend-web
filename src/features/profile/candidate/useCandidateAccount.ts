import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { getCandidateProfile } from "../../../services/candidateProfileService";
import type { CandidateProfileResponse } from "../../../types/authTypes";

export function useCandidateAccount(enabled: boolean) {
    const [profile, setProfile] = useState<CandidateProfileResponse | null>(null);
    const [loading, setLoading] = useState(enabled);
    const [missing, setMissing] = useState(false);
    const [error, setError] = useState("");
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!enabled) return;
        let active = true;
        getCandidateProfile()
            .then((data) => {
                if (active) setProfile(data);
            })
            .catch((cause) => {
                if (!active) return;
                if (isAxiosError(cause) && cause.response?.status === 404) {
                    setMissing(true);
                } else {
                    setError("Không thể tải hồ sơ cá nhân. Vui lòng thử lại.");
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [enabled, attempt]);

    function retry() {
        setError("");
        setMissing(false);
        setLoading(true);
        setAttempt((current) => current + 1);
    }

    function updateProfile(saved: CandidateProfileResponse) {
        setProfile(saved);
        setMissing(false);
        setError("");
    }

    return { profile, loading, missing, error, retry, updateProfile };
}

export type CandidateAccount = ReturnType<typeof useCandidateAccount>;
