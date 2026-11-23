import type { SidebarRole } from "./navigation";

interface HeaderConfig {
    defaultUserName: string;
    userRole: string;
}

export const HEADER_CONFIG: Record<SidebarRole, HeaderConfig> = {
    candidate: {
        defaultUserName: "Tài khoản ứng viên",
        userRole: "Ứng viên",
    },

    company: {
        defaultUserName: "Tài khoản nhà tuyển dụng",
        userRole: "Nhà tuyển dụng",
    },
};
