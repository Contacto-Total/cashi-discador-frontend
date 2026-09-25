/**
 * La mascota de Cashi, para pantallas que se pintan sin Angular (el aviso de
 * equipo no permitido). Es la versión arreglada de cashi-frontend-v2
 * (src/components/brand/mascot.tsx y mascot.css), no la del login actual:
 * el CSS está copiado de allí sin comentarios; si cambia allá, se copia de
 * nuevo. Sin el seguimiento del cursor (en un celular no hay) ni el tecleo del
 * bocadillo: el texto sale entero.
 *
 * La cara triste (cejas caídas y boca en arco hacia abajo) es de aquí, no de
 * v2: la sonrisa no iba con «no puedo».
 */

/** Los dos verdes de la marca que usa la diadema (index.css de v2). */
const COLORES = ':root{--color-cashi-500:#10b981;--color-cashi-600:#059669}';

/** Cejas caídas y boca en arco hacia abajo; ganan a las de v2 por especificidad. */
const TRISTE = `
.mascot-eyes.triste .eye::before {
  content: ''; position: absolute; top: -9px; width: 13px; height: 3px; border-radius: 2px;
  background: var(--color-cashi-500);
}
.mascot-eyes.triste .left-eye::before { left: 1px; transform: rotate(-18deg); }
.mascot-eyes.triste .right-eye::before { right: 1px; transform: rotate(18deg); }
.mascot-mouth.triste {
  bottom: 15px; width: 18px; height: 8px; background: transparent;
  border: 2px solid var(--color-cashi-500); border-bottom: none; border-radius: 18px 18px 0 0;
}`;

export const MASCOTA_CSS = COLORES + TRISTE + `
.mascot-container {
  --mascot-scale: 1;
  width: auto;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(20px * var(--mascot-scale) + 14px);
  animation: mascotEntry 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.mascot-figure {
  width: calc(100px * var(--mascot-scale));
  height: calc(100px * var(--mascot-scale));
  display: flex;
  align-items: center;
  justify-content: center;
  animation: respirar 4s ease-in-out infinite;
}
.speech-bubble {
  position: relative;
  z-index: 50;
  background: linear-gradient(
    135deg,
    var(--color-cashi-500) 0%,
    var(--color-cashi-600) 100%
  );
  padding: 10px 18px;
  border-radius: 18px;
  box-shadow:
    0 10px 30px -8px rgb(4 120 87 / 0.55),
    0 2px 6px rgb(2 44 34 / 0.2),
    inset 0 1px 0 rgb(255 255 255 / 0.35),
    inset 0 -1px 0 rgb(2 44 34 / 0.15);
  max-width: 15rem;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.8) translateY(-10px);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.dark .speech-bubble {
  box-shadow:
    0 4px 16px rgb(16 185 129 / 0.3),
    inset 0 1px 2px rgb(255 255 255 / 0.3);
}
.speech-bubble.visible {
  opacity: 1;
  transform: scale(1) translateY(0);
  animation: bubbleFloat 3s ease-in-out infinite;
}
.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid var(--color-cashi-600);
  filter: drop-shadow(0 2px 4px rgb(16 185 129 / 0.2));
  opacity: 0;
  transition: opacity 0.5s ease;
}
.speech-bubble.visible::after {
  opacity: 1;
}
.typing-text {
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: -0.006em;
  line-height: 1.35;
  color: #fff;
  text-wrap: balance;
}
.typing-word {
  display: inline-block;
  white-space: nowrap;
}
.typing-char {
  display: inline-block;
  animation: charAppear 0.26s ease both;
  text-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
  white-space: pre;
}
.typing-char.pending {
  animation: none;
  opacity: 0;
}
.mascot-body {
  position: relative;
  width: 100px;
  height: 100px;
  flex: none;
  transform: scale(var(--mascot-scale));
  z-index: 1;
}
.mascot-antenna {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 16px;
  background: linear-gradient(
    180deg,
    var(--color-cashi-500) 0%,
    var(--color-cashi-600) 100%
  );
  border-radius: 2px;
  animation: antennaWiggle 2s ease-in-out infinite;
}
.mascot-antenna::after {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: var(--color-cashi-500);
  border-radius: 50%;
  box-shadow: 0 0 12px rgb(16 185 129 / 0.8);
  animation: antennaBlink 1.5s ease-in-out infinite;
}
.mascot-head {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
  background: linear-gradient(180deg, #f5f8f9 0%, #e7edf0 100%);
  border-radius: 20px;
  box-shadow:
    0 8px 24px rgb(0 0 0 / 0.1),
    0 0 0 2px rgb(16 185 129 / 0.35),
    0 0 0 1px rgb(0 0 0 / 0.05) inset;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}
.dark .mascot-head {
  box-shadow:
    0 8px 24px rgb(0 0 0 / 0.5),
    0 0 0 2px rgb(16 185 129 / 0.7),
    0 0 0 1px rgb(255 255 255 / 0.4) inset;
}
.mascot-eyes {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.34s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.34s ease;
}
.mascot-eyes.hiding {
  transform: translateY(1px);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.mascot-eyes.peeking {
  animation: peek 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.eye {
  width: 18px;
  height: 18px;
  background: var(--color-cashi-500);
  border-radius: 50%;
  position: relative;
  box-shadow: 0 2px 8px rgb(16 185 129 / 0.4);
  animation: blink 4s ease-in-out infinite;
  overflow: visible;
  transition:
    background-color 0.16s ease,
    box-shadow 0.16s ease,
    transform 0.2s ease;
}
.eye::after {
  content: '';
  position: absolute;
  top: 50%;
  left: -2px;
  right: -2px;
  height: 10px;
  margin-top: -5px;
  border: 3px solid var(--color-cashi-500);
  border-bottom: none;
  border-radius: 999px 999px 0 0;
  opacity: 0;
  transform: scaleY(0.25);
  transform-origin: bottom center;
  transition:
    opacity 0.16s ease,
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pupil {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 7px;
  height: 7px;
  background: #fff;
  border-radius: 50%;
  transform: translate(
    calc(-50% + var(--pupil-x, 0px)),
    calc(-50% + var(--pupil-y, 0px))
  );
  transition:
    transform 0.15s ease-out,
    opacity 0.14s ease;
  box-shadow: 0 0 6px rgb(255 255 255 / 0.8);
  will-change: transform;
}
.mascot-eyes.hiding .eye {
  background: transparent;
  box-shadow: none;
  animation: none;
  transform: scaleY(0.92);
}
.mascot-eyes.hiding .eye::after {
  opacity: 1;
  transform: scaleY(1);
}
.mascot-eyes.hiding .pupil {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0);
}
.mascot-mouth {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 12px;
  background: var(--color-cashi-500);
  border-radius: 0 0 24px 24px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.mascot-mouth.closed {
  width: 18px;
  height: 8px;
  background: transparent;
  border: 2px solid var(--color-cashi-500);
  border-top: none;
  border-radius: 0 0 18px 18px;
  animation: closeMouth 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.mascot-headset {
  position: absolute;
  inset: 0;
  width: 100px;
  height: 100px;
  overflow: visible;
  pointer-events: none;
  filter: drop-shadow(0 3px 9px rgb(16 185 129 / 0.35));
}
@keyframes mascotEntry {
  0% {
    opacity: 0;
    transform: scale(0) translateY(-100px) rotate(-180deg);
  }
  60% {
    transform: scale(1.1) translateY(0) rotate(10deg);
  }
  80% {
    transform: scale(0.95) rotate(-5deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0) rotate(0);
  }
}
@keyframes bubbleFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
@keyframes charAppear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes antennaWiggle {
  0%,
  100% {
    transform: translateX(-50%) rotate(0deg);
  }
  25% {
    transform: translateX(-50%) rotate(-8deg);
  }
  75% {
    transform: translateX(-50%) rotate(8deg);
  }
}
@keyframes antennaBlink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
@keyframes blink {
  0%,
  96%,
  100% {
    transform: scaleY(1);
  }
  98% {
    transform: scaleY(0.1);
  }
}
@keyframes peek {
  0% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  45% {
    transform: scale(1.18);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes closeMouth {
  0% {
    width: 24px;
    height: 12px;
    background: var(--color-cashi-500);
    border: none;
  }
  100% {
    width: 18px;
    height: 8px;
    background: transparent;
    border: 2px solid var(--color-cashi-500);
    border-top: none;
  }
}
@keyframes respirar {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .mascot-container,
  .mascot-figure,
  .mascot-antenna,
  .mascot-antenna::after,
  .mascot-headset,
  .eye,
  .speech-bubble.visible,
  .typing-char {
    animation: none !important;
  }
  .typing-char {
    opacity: 1;
    transform: none;
  }
}
.mascot-plano .mascot-headset {
  filter: none;
}
.mascot-plano .mascot-antenna::after {
  box-shadow: none;
}
.mascot-plano .eye {
  box-shadow: none;
}
.mascot-plano .pupil {
  box-shadow: none;
}
.mascot-plano .mascot-head {
  box-shadow:
    0 0 0 2px rgb(16 185 129 / 0.35),
    0 0 0 1px rgb(0 0 0 / 0.05) inset;
}
.dark .mascot-plano .mascot-head {
  box-shadow:
    0 0 0 2px rgb(16 185 129 / 0.7),
    0 0 0 1px rgb(255 255 255 / 0.4) inset;
}
`;

/** La mascota triste con su bocadillo; la mirada un poco hacia abajo, al texto. */
export function mascotaHtml(mensaje: string): string {
  return `
    <div class="mascot-container" style="--mascot-scale:1">
      <div class="speech-bubble visible"><div class="typing-text">${mensaje}</div></div>
      <div class="mascot-figure">
        <div class="mascot-body">
          <div class="mascot-antenna"></div>
          <div class="mascot-head">
            <div class="mascot-eyes triste" style="--pupil-x:0px;--pupil-y:2px">
              <div class="eye left-eye"><div class="pupil"></div></div>
              <div class="eye right-eye"><div class="pupil"></div></div>
            </div>
            <div class="mascot-mouth triste"></div>
          </div>
          <svg class="mascot-headset" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="cup-bloqueo" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="var(--color-cashi-500)" />
                <stop offset="100%" stop-color="var(--color-cashi-600)" />
              </linearGradient>
            </defs>
            <path d="M10.5 46L10.5 20A20.5 20.5 0 0 1 30 -0.5L70 -0.5A20.5 20.5 0 0 1 89.5 20L89.5 46"
                  stroke="var(--color-cashi-500)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M96 50Q91 72 67 65" stroke="var(--color-cashi-500)" stroke-width="3.5" stroke-linecap="round" />
            <circle cx="67" cy="65" r="4" fill="var(--color-cashi-600)" />
            <rect x="-5" y="28" width="22" height="24" rx="8" fill="url(#cup-bloqueo)" />
            <rect x="83" y="28" width="22" height="24" rx="8" fill="url(#cup-bloqueo)" />
          </svg>
        </div>
      </div>
    </div>`;
}
