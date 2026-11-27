import { useState } from "react";
import { Minus, PawPrint } from "lucide-react";
import Capybara from "./Capybara";
import styles from "./Capybara.module.css";

const preference = "sirs.capy.collapsed";

export default function CapyDock() {
    const [collapsed, setCollapsed] = useState(() => {
        try {
            const saved = localStorage.getItem(preference);
            if (saved !== null) return saved === "true";
        } catch { /* Storage can be unavailable in an embedded page. */ }
        return matchMedia("(max-width: 640px)").matches;
    });
    function toggle() {
        setCollapsed(!collapsed);
        try { localStorage.setItem(preference, String(!collapsed)); } catch { /* Session only. */ }
    }
    const label = collapsed ? "Hiện Capy" : "Thu gọn Capy";
    return <div className={styles.dock}>
        {!collapsed && <Capybara greet />}
        <button className={styles.toggle} type="button" aria-label={label} title={label}
            aria-expanded={!collapsed} onClick={toggle}>
            {collapsed ? <PawPrint size={19} /> : <Minus size={15} />}
        </button>
    </div>;
}
