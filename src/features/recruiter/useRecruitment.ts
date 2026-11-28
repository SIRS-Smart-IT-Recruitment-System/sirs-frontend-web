import { useOutletContext } from "react-router-dom";
import type { RecruitmentData } from "./model";

export interface WorkspaceContext {
    data: RecruitmentData;
    save: (data: RecruitmentData) => void;
}

export function useRecruitment() {
    return useOutletContext<WorkspaceContext>();
}
