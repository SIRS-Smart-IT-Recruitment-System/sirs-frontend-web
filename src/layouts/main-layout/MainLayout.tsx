import type { ReactNode } from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar.tsx";
import type { SidebarRole } from "../../constants/navigation";
import Header from "../../components/layout/Header/Header.tsx";
import styles from "./MainLayout.module.css";

interface MainLayoutProps {
    children: ReactNode;
    role: SidebarRole;
    progress?: number;
    userName?: string;
    userRole?: string;
}

function MainLayout({
                        children,
                        role,
                        progress,
                        userName = "Công ty ABC",
                        userRole = "Nhà tuyển dụng",
                    }: MainLayoutProps) {
    return (
        <div className={styles.layout}>
            <div className={styles.sidebarArea}>
                <Sidebar role={role} progress={progress} />
            </div>

            <div className={styles.mainArea}>
                <div className={styles.headerArea}>
                    <Header userName={userName} userRole={userRole} />
                </div>

                <main className={styles.contentArea}>{children}</main>
            </div>
        </div>
    );
}

export default MainLayout;