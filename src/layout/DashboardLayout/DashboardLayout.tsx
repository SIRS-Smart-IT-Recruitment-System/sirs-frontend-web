import type { ReactNode } from "react";
import { useState } from "react";

import Sidebar, {
    type MenuItem,
} from "../Sidebar/Sidebar.tsx";

import Header from "../Header/Header.tsx";
import styles from "./DashboardLayout.module.css";

interface DashboardLayoutProps {
    children: ReactNode;
    activeItem?: MenuItem;
    onNavigate?: (item: MenuItem) => void;
}

function DashboardLayout({
                             children,
                             activeItem = "profile",
                             onNavigate,
                         }: DashboardLayoutProps) {
    const [currentItem, setCurrentItem] =
        useState<MenuItem>(activeItem);

    const handleNavigate = (item: MenuItem) => {
        setCurrentItem(item);
        onNavigate?.(item);
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.sidebarArea}>
                <Sidebar
                    activeItem={currentItem}
                    onNavigate={handleNavigate}
                />
            </div>

            <div className={styles.mainArea}>
                <div className={styles.headerArea}>
                    <Header />
                </div>

                <main className={styles.contentArea}>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;