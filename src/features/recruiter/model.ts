// These labels describe the local sample only. They are not API enums.
export const sampleStages = ["Chờ duyệt", "Đã duyệt CV", "Phỏng vấn", "Đã từ chối"] as const;
export type SampleStage = typeof sampleStages[number];

export interface Application {
    id: string;
    name: string;
    email: string;
    job: string;
    city: string;
    skills: string[];
    cvSummary: string | null;
    gitReport: { state: "available"; score: number } | { state: "processing" | "unavailable" };
    stage: SampleStage;
    submitted: string;
}

export interface Interview {
    id: string;
    applicationId: string;
    round: string;
    date: string;
    start: string;
    end: string;
    format: "Trực tuyến" | "Tại văn phòng";
    location: string;
    panel: string[];
    notes: string;
    status: "Chờ xác nhận" | "Đã xác nhận" | "Đã hủy";
}

export interface RecruitmentData {
    applications: Application[];
    interviews: Interview[];
    openJobs: string[];
    interviewers: string[];
}

export function dayKey(offset = 0) {
    const ict = new Date(Date.now() + 7 * 3600000);
    ict.setUTCDate(ict.getUTCDate() + offset);
    return ict.toISOString().slice(0, 10);
}

export function displayDate(value: string) {
    return value.split("-").reverse().join("/");
}

export function searchable(value: string) {
    return value.toLocaleLowerCase("vi").normalize("NFD").replace(/\p{M}/gu, "").replaceAll("đ", "d").trim();
}

export function upcomingInterviews(data: RecruitmentData) {
    return data.interviews
        .filter(
            (item) =>
                item.status !== "Đã hủy" &&
                new Date(item.date + "T" + item.end + ":00+07:00").getTime() > Date.now()
        )
        .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
}

export function applicationStage(item: Application, data: RecruitmentData): SampleStage {
    return data.interviews.some((meeting) => meeting.applicationId === item.id && meeting.status !== "Đã hủy")
        ? "Phỏng vấn"
        : item.stage;
}
