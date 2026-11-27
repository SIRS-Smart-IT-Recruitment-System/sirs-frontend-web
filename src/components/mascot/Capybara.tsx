import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import artwork from "./capybara.svg?raw";
import { animateCapy } from "./motion";
import type { CapyAction } from "./motion";
import { CAPY_SUCCESS } from "./events";
import styles from "./Capybara.module.css";

// Vite bundles this local, editable SVG at build time.
const drawing = { __html: artwork };
type Props = {
    controls?: RefObject<ReturnType<typeof animateCapy> | null>;
    greet?: boolean;
    onAction?: (action: CapyAction) => void;
};

export default function Capybara({ controls, greet = false, onAction }: Props) {
    const host = useRef<HTMLButtonElement>(null);
    const animator = useRef<ReturnType<typeof animateCapy> | null>(null);
    useEffect(() => {
        const motion = animateCapy(host.current!, greet, onAction);
        animator.current = motion;
        if (controls) controls.current = motion;
        const celebrate = () => motion.play("celebrate");
        window.addEventListener(CAPY_SUCCESS, celebrate);
        return () => {
            window.removeEventListener(CAPY_SUCCESS, celebrate);
            motion.dispose();
            animator.current = null;
            if (controls) controls.current = null;
        };
    }, [controls, greet, onAction]);

    return <button ref={host} type="button" className={styles.character}
        aria-label="Chạm để Capy vui" onClick={() => animator.current?.play("happy")}
        dangerouslySetInnerHTML={drawing} />;
}
