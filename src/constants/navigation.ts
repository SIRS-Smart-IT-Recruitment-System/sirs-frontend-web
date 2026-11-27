import {
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    GitBranch,
    LayoutDashboard,
    House,
    UserRound,
    Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ROUTES } from "../routers/routePaths";

export type SidebarRole = "candidate" | "company";

export interface NavigationItem {
    label: string;
    path?: string;
    icon: LucideIcon;
    badge?: string;
}

export const navigation: Record<SidebarRole, NavigationItem[]> = {
    candidate: [
        {
            label: "Trang chủ",
            path: ROUTES.CANDIDATE.DASHBOARD,
            icon: House,
        },
        {
            label: "Vị trí tuyển dụng",
            path: ROUTES.CANDIDATE.JOBS,
            icon: BriefcaseBusiness,
        },
        {
            label: "Lịch phỏng vấn",
            icon: CalendarDays,
        },
        {
            label: "Hồ sơ cá nhân",
            path: ROUTES.CANDIDATE.PROFILE,
            icon: UserRound,
        },
        {
            label: "Đánh giá Git",
            path: ROUTES.CANDIDATE.GIT_VERIFICATION,
            icon: GitBranch,
        },
        {
            label: "Cài đặt",
            icon: LayoutDashboard,
        },
    ],

    company: [
        {
            label: "Tổng quan",
            path: "/company/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Quản lý tuyển dụng",
            path: "/company/jobs",
            icon: BriefcaseBusiness,
        },
        {
            label: "Lịch phỏng vấn",
            path: "/company/interviews",
            icon: CalendarDays,
        },
        {
            label: "Quản lý ứng viên",
            path: "/company/candidates",
            icon: Users,
        },
        {
            label: "Hồ sơ nhà tuyển dụng",
            path: "/company/profile",
            icon: Building2,
        },
    ],
};
