export type SidebarRole = "candidate" | "company";

export interface NavigationItem {
    label: string;
    path: string;
    icon: string;
    badge?: string;
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
        {
            label: "Đánh giá Git",
            path: "/candidate/git-verification",
            icon: "⌥",
            badge: "Mới",
        },
    ],

    company: [
        {
            label: "Tổng quan",
            path: "/company/dashboard",
            icon: "▦",
        },
        {
            label: "Quản lý tuyển dụng",
            path: "/company/jobs",
            icon: "▣",
        },
        {
            label: "Lịch phỏng vấn",
            path: "/company/interviews",
            icon: "▦",
        },
        {
            label: "Quản lý ứng viên",
            path: "/company/candidates",
            icon: "♙",
        },
        {
            label: "Hồ sơ nhà tuyển dụng",
            path: "/company/profile",
            icon: "♧",
        },
    ],
};