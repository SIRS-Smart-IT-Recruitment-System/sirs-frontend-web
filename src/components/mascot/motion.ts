export type CapyAction = "idle" | "wave" | "happy" | "celebrate";

const duration = { idle: 0, wave: 1.85, happy: 1.35, celebrate: 2.1 };
const tau = 2 * Math.PI;
const between = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (value: number) => Math.max(-1, Math.min(1, value));

// One clock and one pose. A new gesture changes targets without resetting any joint.
export function animateCapy(host: HTMLElement, greet: boolean, onAction?: (action: CapyAction) => void) {
    function part(name: string, pivot: string) {
        const group = host.querySelector<SVGGElement>(`[data-part="${name}"]`)!;
        group.style.transformBox = "view-box";
        group.style.transformOrigin = pivot;
        return group;
    }
    const body = part("body", "119px 169px");
    const head = part("head", "95px 96px");
    const ear = part("ear", "104px 53px");
    const scarf = part("scarf", "92px 99px");
    const paw = part("paw", "87px 123px");
    const eyes = part("eyes", "76px 63px");
    const gaze = part("gaze", "76px 63px");
    const mouth = part("mouth", "25px 85px");
    const glints = part("glints", "141px 39px");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");

    let action: CapyAction = "idle";
    let age = 0, time = 0, blinkAt = between(1.5, 4), tiltAt = between(3, 8);
    let wave = 0, joy = 0, cheer = 0, lookX = 0, lookY = 0;
    let pointer: { x: number; y: number } | null = null;
    let touchUntil = 0;
    let bounds: DOMRect | undefined;
    let frame = 0, previous: number | undefined, staticTimer = 0;
    let intersecting = false, firstAppearance = true;
    const visible = () => intersecting && !document.hidden;

    function setAction(next: CapyAction) {
        if (next !== action) {
            action = next;
            onAction?.(next);
        }
        age = 0;
    }

    function draw(breath: number, tilt: number, blink: number) {
        body.style.transform = `rotate(${wave * .027 - cheer * 1.7}deg) scale(1,${1 + breath * .008 + joy * .014})`;
        head.style.transform = `translateY(${-joy * 2 - cheer * 2}px) rotate(${tilt + lookX * 2.6 + lookY * 1.8 - wave * .044 - joy * 4 + cheer * 3.5}deg)`;
        gaze.style.transform = `translate(${lookX * 2}px,${lookY * 1.5}px)`;
        eyes.style.transform = `scaleY(${Math.max(.09, 1 - blink * .91 - joy * .68 - cheer * .4)})`;
        ear.style.transform = `rotate(${joy * 8 + cheer * 7 - wave * .035}deg)`;
        scarf.style.transform = `rotate(${breath * .5 + wave * .045 + joy * 4 - cheer * 3}deg)`;
        mouth.style.transform = `rotate(${-joy * 12 - cheer * 8}deg)`;
        paw.style.transform = `rotate(${wave}deg)`;
        glints.style.opacity = cheer.toFixed(3);
        glints.style.transform = `translateY(${-cheer * 4}px)`;
    }

    function staticPose() {
        wave = action === "wave" ? 76 : 0;
        joy = action === "happy" ? 1 : 0;
        cheer = action === "celebrate" ? 1 : 0;
        lookX = lookY = 0;
        draw(0, 0, 0);
    }

    function play(next: CapyAction) {
        if (!visible() || next === action) return;
        setAction(next);
        if (reduced.matches) {
            window.clearTimeout(staticTimer);
            staticPose();
            if (next !== "idle") staticTimer = window.setTimeout(() => play("idle"), 1000);
        }
    }

    function tick(now: number) {
        const dt = previous === undefined ? 0 : Math.min(.05, (now - previous) / 1000);
        previous = now;
        time += dt;
        age += dt;
        if (action !== "idle" && age >= duration[action]) setAction("idle");
        const progress = action === "idle" ? 0 : age / duration[action];
        const envelope = Math.sin(Math.PI * progress) ** 2;
        const blend = -Math.expm1(-dt * 15);
        const waveTarget = action === "wave" ? envelope * (93 + 13 * Math.sin(tau * 2.6 * progress)) : 0;
        const joyTarget = action === "happy" ? envelope : 0;
        const cheerTarget = action === "celebrate" ? envelope * (.8 - .2 * Math.cos(tau * 2.5 * progress)) : 0;
        wave += (waveTarget - wave) * blend;
        joy += (joyTarget - joy) * blend;
        cheer += (cheerTarget - cheer) * blend;

        if (touchUntil && time > touchUntil) clearPointer();
        let x = 0, y = 0;
        if (pointer) {
            bounds ??= host.getBoundingClientRect();
            const dx = pointer.x - bounds.left - bounds.width * .4;
            const dy = pointer.y - bounds.top - bounds.height * .34;
            const reach = Math.max(180, bounds.width * 1.4);
            const weight = Math.max(0, Math.min(1, 2 - 2 * Math.hypot(dx, dy) / reach));
            x = clamp(dx / (reach * .45)) * weight;
            y = clamp(dy / (reach * .45)) * weight;
        }
        const follow = -Math.expm1(-dt * 7);
        lookX += (x - lookX) * follow;
        lookY += (y - lookY) * follow;

        const blinkPhase = (time - blinkAt) / .24;
        const tiltPhase = (time - tiltAt) / 2.8;
        const pulse = (phase: number) => phase > 0 && phase < 1 ? Math.sin(Math.PI * phase) ** 2 : 0;
        draw(Math.sin(tau * time / 4.1), pulse(tiltPhase) * 3.4, pulse(blinkPhase));
        if (blinkPhase >= 1) blinkAt = time + between(2.7, 6.1);
        if (tiltPhase >= 1) tiltAt = time + between(5, 12);
        frame = requestAnimationFrame(tick);
    }

    function clearPointer() { pointer = null; touchUntil = 0; }
    function track(event: PointerEvent) {
        if (!visible() || reduced.matches || (event.pointerType === "touch" && !host.contains(event.target as Node))) return;
        pointer = { x: event.clientX, y: event.clientY };
        touchUntil = event.pointerType === "touch" ? time + .85 : 0;
    }
    function leave(event: PointerEvent) { if (!event.relatedTarget) clearPointer(); }
    function invalidate() { bounds = undefined; }
    function stop() {
        cancelAnimationFrame(frame);
        window.clearTimeout(staticTimer);
        previous = undefined;
        clearPointer();
        invalidate();
    }
    function sync() {
        stop();
        if (!visible()) return;
        if (reduced.matches) {
            setAction("idle");
            staticPose();
        } else {
            if (firstAppearance && greet) play("wave");
            frame = requestAnimationFrame(tick);
        }
        firstAppearance = false;
    }
    const observer = new IntersectionObserver(([entry]) => {
        intersecting = entry.isIntersecting;
        sync();
    });
    observer.observe(host);
    const resize = new ResizeObserver(invalidate);
    resize.observe(host);
    const listeners = new AbortController();
    const options = { passive: true, signal: listeners.signal };
    window.addEventListener("pointermove", track, options);
    host.addEventListener("pointerdown", track, options);
    window.addEventListener("pointerout", leave, options);
    window.addEventListener("blur", clearPointer, options);
    window.addEventListener("scroll", invalidate, { ...options, capture: true });
    window.addEventListener("resize", invalidate, options);
    document.addEventListener("visibilitychange", sync, options);
    reduced.addEventListener("change", sync, options);
    return {
        play,
        dispose() {
            stop();
            listeners.abort();
            observer.disconnect();
            resize.disconnect();
        },
    };
}
