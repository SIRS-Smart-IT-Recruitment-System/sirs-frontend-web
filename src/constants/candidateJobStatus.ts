import type { CandidateJobStatus } from "../types/authTypes";

export const JOB_STATUS_OPTIONS: {
    value: CandidateJobStatus;
    label: string;
}[] = [
    {
        value: "OPEN_FOR_WORK",
        label: "Đang tìm việc",
    },
    {
        value: "READY_FOR_OPPORTUNITY",
        label: "Sẵn sàng nhận cơ hội",
    },
    {
        value: "NOT_LOOKING",
        label: "Không tìm việc",
    },
];
