import { useRef, useState } from "react";
import { ArrowUpRight, Hand, Heart, Leaf, MousePointer2, PawPrint, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Capybara from "../../components/mascot/Capybara";
import { animateCapy, type CapyAction } from "../../components/mascot/motion";
import { ROUTES } from "../../routers/routePaths";
import styles from "./MascotDemo.module.css";

const gestures = [
    { id: "idle", label: "Nghỉ ngơi", status: "Đang nghỉ ngơi", icon: Leaf },
    { id: "wave", label: "Vẫy chào", status: "Đang vẫy chào", icon: Hand },
    { id: "happy", label: "Vui vẻ", status: "Đang vui vẻ", icon: Heart },
    { id: "celebrate", label: "Ăn mừng", status: "Đang ăn mừng", icon: Sparkles },
] as const;

export default function MascotDemo() {
    const controls = useRef<ReturnType<typeof animateCapy> | null>(null);
    const [action, setAction] = useState<CapyAction>("idle");
    return <div className={styles.page}>
        <header className={styles.bar}>
            <div className={styles.brand}><PawPrint size={22} /> SIRS <span>Linh vật</span></div>
            <Link to={ROUTES.HOME}>Về hệ thống <ArrowUpRight size={16} /></Link>
        </header>
        <main className={styles.main}>
            <h1>Gặp gỡ <em>Capy.</em></h1>
            <p className={styles.intro}>Chú capybara khăn xanh bên bờ nước. Chọn một cử chỉ để chơi cùng Capy.</p>
            <section className={styles.studio} aria-label="Trải nghiệm mascot Capy">
                <div className={styles.scene}>
                    <span className={styles.status} role="status"><i />{gestures.find(g => g.id === action)?.status}</span>
                    <div className={styles.actor}><Capybara controls={controls} onAction={setAction} /></div>
                </div>
                <div className={styles.controls}>
                    <h2>Cử chỉ của Capy</h2>
                    <div className={styles.buttons}>
                        {gestures.map(({ id, label, icon: Icon }) => <button key={id} type="button"
                            aria-pressed={action === id} onClick={() => controls.current?.play(id)}>
                            <Icon size={17} strokeWidth={1.7} />{label}
                        </button>)}
                    </div>
                </div>
            </section>
            <p className={styles.tip}><MousePointer2 size={16} /><span>Rê chuột lại gần để Capy nhìn theo, hoặc chạm vào Capy để thấy chú mỉm cười.</span></p>
        </main>
    </div>;
}
