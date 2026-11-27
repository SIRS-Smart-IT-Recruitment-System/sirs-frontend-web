import { useEffect, useRef } from 'react';
import capybyteSprite from '../../assets/capybyte_sprite.png';
import capybyteWebp from '../../assets/capybyte_walking.webp';
import capybyteGif from '../../assets/capybyte_walking.gif';

/** ---- CSS SPRITE ANIMATION (6 frames, cực mượt) ---- */
const SPRITE_FRAME_W = 300;   // px mỗi frame trong sprite strip
const SPRITE_FRAME_H = 300;
const SPRITE_TOTAL_FRAMES = 6;
const SPRITE_FPS = 12;        // số frame mỗi giây

const spriteStyle = (size: number): React.CSSProperties => ({
  display: 'inline-block',
  width: size,
  height: size,
  backgroundImage: `url(${capybyteSprite})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: `${SPRITE_TOTAL_FRAMES * 100}% 100%`,
  imageRendering: 'auto',
  animation: `capybyte-walk ${SPRITE_TOTAL_FRAMES / SPRITE_FPS}s steps(${SPRITE_TOTAL_FRAMES}) infinite`,
});

const CSS_KEYFRAMES = `
@keyframes capybyte-walk {
  from { background-position-x: 0%; }
  to   { background-position-x: 100%; }
}
`;

interface CapyByteProps {
  /** Kích thước (px). Mặc định 120. */
  size?: number;
  /** 'sprite' = CSS animation (mượt, nhẹ) | 'webp' = animated WebP (nhiều frames). Mặc định 'sprite'. */
  mode?: 'sprite' | 'webp';
  className?: string;
  title?: string;
  /** Dừng animation khi hover */
  pauseOnHover?: boolean;
}

/**
 * 🐾 CapyByte — linh vật chạy bộ của SIRS
 *
 * @example
 * // CSS sprite (mặc định, mượt nhất):
 * <CapyByte size={120} />
 *
 * // Animated WebP 32 frames với transition:
 * <CapyByte size={120} mode="webp" />
 *
 * // Dừng khi hover:
 * <CapyByte pauseOnHover />
 */
export default function CapyByte({
  size = 120,
  mode = 'sprite',
  className = '',
  title = 'CapyByte - Linh vật SIRS',
  pauseOnHover = false,
}: CapyByteProps) {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Inject CSS keyframes một lần duy nhất
  useEffect(() => {
    if (mode !== 'sprite') return;
    if (document.getElementById('capybyte-keyframes')) return;
    const el = document.createElement('style');
    el.id = 'capybyte-keyframes';
    el.textContent = CSS_KEYFRAMES;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => { el.remove(); };
  }, [mode]);

  if (mode === 'webp') {
    return (
      <picture className={className} style={{ display: 'inline-block', width: size, height: size }}>
        <source srcSet={capybyteWebp} type="image/webp" />
        <img
          src={capybyteGif}
          alt={title}
          title={title}
          width={size}
          height={size}
          style={{ objectFit: 'contain' }}
        />
      </picture>
    );
  }

  return (
    <div
      className={className}
      title={title}
      role="img"
      aria-label={title}
      style={{
        ...spriteStyle(size),
        ...(pauseOnHover ? {} : {}),
      }}
      onMouseEnter={pauseOnHover ? (e) => {
        (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused';
      } : undefined}
      onMouseLeave={pauseOnHover ? (e) => {
        (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running';
      } : undefined}
    />
  );
}

/** ---- Preset tiện dụng ---- */

/** CapyByte nhỏ cho navbar/loading indicator */
export const CapyByteSmall = () => <CapyByte size={48} />;

/** CapyByte vừa cho card/sidebar */
export const CapyByteMedium = () => <CapyByte size={120} />;

/** CapyByte lớn cho trang 404/empty state */
export const CapyByteLarge = () => <CapyByte size={240} mode="webp" />;
