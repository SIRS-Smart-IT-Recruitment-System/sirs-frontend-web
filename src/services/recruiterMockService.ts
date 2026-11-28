import { dayKey } from "../features/recruiter/model";
import type { Application, Interview, RecruitmentData } from "../features/recruiter/model";

interface SampleFile extends Omit<RecruitmentData, "applications" | "interviews"> {
    applications: (Omit<Application, "submitted"> & { day: number })[];
    interviews: (Omit<Interview, "date"> & { day: number })[];
}

// Isolate local edits by login session without copying the access token into a storage key.
export async function loadRecruiterSample(token: string, signal: AbortSignal) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
    const key =
        "sirs.recruiter.mock.v2." +
        Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
    const stored = sessionStorage.getItem(key);
    if (stored) return { key, data: JSON.parse(stored) as RecruitmentData };

    const response = await fetch(import.meta.env.BASE_URL + "mocks/recruitment.json", { signal });
    if (!response.ok) throw new Error("Không tải được dữ liệu mẫu.");
    const sample: SampleFile = await response.json();
    const data: RecruitmentData = {
        openJobs: sample.openJobs,
        interviewers: sample.interviewers,
        applications: sample.applications.map(({ day, ...item }) => ({ ...item, submitted: dayKey(day) })),
        interviews: sample.interviews.map(({ day, ...item }) => ({ ...item, date: dayKey(day) })),
    };
    return { key, data };
}

export function saveRecruiterSample(key: string, data: RecruitmentData) {
    sessionStorage.setItem(key, JSON.stringify(data));
}
