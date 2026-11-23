
import type { ReactNode } from "react";

import Sidebar from "../../components/Sidebar/Sidebar.tsx";
import Header from "../../components/Header/Header.tsx";

import type { SidebarRole } from "../../../constants/navigation.ts";

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
                        userName,
                        userRole,
                    }: MainLayoutProps) {
    return (
        <div className={styles.layout}>
            <div className={styles.sidebarArea}>
                <Sidebar
                    role={role}
                    progress={progress}
                />
            </div>

            <div className={styles.mainArea}>
                <div className={styles.headerArea}>
                    <Header
                        role={role}
                        userName={userName}
                        userRole={userRole}
                    />
                </div>

                <main className={styles.contentArea}>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
