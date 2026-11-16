export type SidebarRole = "candidate" | "recruiter";

export interface NavigationItem {
    label: string;
    path: string;
    icon: string;
}

export const navigation: Record<SidebarRole, NavigationItem[]> = {
    candidate: [
        {
            label: "Tổng quan",
            path: "/candidate/dashboard",
            icon: "▦",
        },
        {
            label: "Tìm kiếm việc làm",
            path: "/candidate/jobs",
            icon: "▣",
        },
        {
            label: "Lịch phỏng vấn",
            path: "/candidate/interviews",
            icon: "▦",
        },
        {
            label: "Hồ sơ ứng viên",
            path: "/candidate/profile",
            icon: "♙",
        },
    ],

    recruiter: [
        {
            label: "Tổng quan",
            path: "/recruiter/dashboard",
            icon: "▦",
        },
        {
            label: "Quản lý tuyển dụng",
            path: "/recruiter/jobs",
            icon: "▣",
        },
        {
            label: "Lịch phỏng vấn",
            path: "/recruiter/interviews",
            icon: "▦",
        },
        {
            label: "Quản lý ứng viên",
            path: "/recruiter/candidates",
            icon: "♙",
        },
        {
            label: "Hồ sơ nhà tuyển dụng",
            path: "/recruiter/profile",
            icon: "♧",
        },
    ],
};