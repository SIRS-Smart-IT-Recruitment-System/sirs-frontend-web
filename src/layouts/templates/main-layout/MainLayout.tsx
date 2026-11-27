import { Outlet } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar.tsx";
import Header from "../../components/Header/Header.tsx";

import type { SidebarRole } from "../../../constants/navigation.ts";

import { useCandidateAccount } from "../../../features/profile/candidate/useCandidateAccount";
import styles from "./MainLayout.module.css";

interface MainLayoutProps {
    role: SidebarRole;
}

function MainLayout({ role }: MainLayoutProps) {
    const account = useCandidateAccount(role === "candidate");

    return (
        <div className={styles.layout} data-role={role}>
            <div className={styles.sidebarArea}>
                <Sidebar role={role} />
            </div>

            <div className={styles.mainArea}>
                <div className={styles.headerArea}>
                    <Header
                        role={role}
                        profile={account.profile}
                        loadingName={account.loading}
                    />
                </div>

                <main className={styles.contentArea}>
                    <Outlet context={account} />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
