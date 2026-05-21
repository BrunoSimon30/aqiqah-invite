import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sparkles } from "lucide-react";

interface EnvelopeProps {
  onOpened: () => void;
  onOpening?: () => void;
  babyName: string;
}

const FLAP_OPEN = 1.1;
const CARD_DELAY = 0.38;
const CARD_RISE = 1.2;
const SETTLE = 1;

export function Envelope({ onOpened, onOpening, babyName }: EnvelopeProps) {
  const [stage, setStage] = useState<"closed" | "opening" | "card">("closed");
  const isOpen = stage !== "closed";

  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        /* noop */
      }
    }
  };

  const handleOpen = () => {
    if (stage !== "closed") return;
    triggerHaptic([12, 40, 18]);
    onOpening?.();
    setStage("opening");

    window.setTimeout(
      () => triggerHaptic(8),
      (CARD_DELAY + CARD_RISE) * 1000,
    );
    window.setTimeout(() => setStage("card"), (CARD_DELAY + CARD_RISE) * 1000);
    window.setTimeout(
      onOpened,
      (CARD_DELAY + CARD_RISE + SETTLE) * 1000,
    );
  };

  return (
    <div
      className="flex flex-col items-center w-full max-w-[min(100%,460px)] mx-auto"
      style={{ perspective: 1100 }}
    >
      {/* Envelope — tap anywhere on envelope or CTA below */}
      <motion.button
        type="button"
        onClick={handleOpen}
        disabled={isOpen}
        aria-label="Open invitation envelope"
        className="relative w-full outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 rounded-2xl touch-manipulation select-none disabled:pointer-events-none"
        style={{ WebkitTapHighlightColor: "transparent" }}
        whileHover={stage === "closed" ? { scale: 1.015 } : undefined}
        whileTap={stage === "closed" ? { scale: 0.99 } : undefined}
      >
        <div className="relative w-full aspect-[1.45] max-h-[300px] sm:max-h-[320px]">
          {/* Glow */}
          <div
            className="absolute -inset-8 rounded-full blur-3xl opacity-35 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, oklch(0.85 0.12 80 / 0.55), transparent 68%)",
            }}
          />

          {/* Envelope body */}
          <motion.div
            className="absolute inset-0 rounded-lg shadow-luxe overflow-hidden"
            style={{
              background:
                "linear-gradient(165deg, oklch(0.95 0.025 82) 0%, oklch(0.88 0.045 76) 100%)",
            }}
            animate={
              stage === "closed"
                ? { y: [0, -5, 0] }
                : { y: 0, boxShadow: "0 20px 50px -15px oklch(0.4 0.08 60 / 0.25)" }
            }
            transition={
              stage === "closed"
                ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.5 }
            }
          >
            {/* Side folds */}
            <div
              className="absolute left-0 top-[42%] bottom-0 w-[18%] pointer-events-none opacity-50"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.82 0.05 74), transparent)",
                clipPath: "polygon(0 0, 100% 35%, 100% 100%, 0 100%)",
              }}
            />
            <div
              className="absolute right-0 top-[42%] bottom-0 w-[18%] pointer-events-none opacity-50"
              style={{
                background:
                  "linear-gradient(-90deg, oklch(0.82 0.05 74), transparent)",
                clipPath: "polygon(100% 0, 0 35%, 0 100%, 100% 100%)",
              }}
            />

            {/* Front pocket */}
            <div
              className="absolute inset-x-0 bottom-0 h-[55%] z-[2] pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, oklch(0.84 0.05 74) 100%)",
                clipPath: "polygon(0 100%, 50% 22%, 100% 100%)",
              }}
            />

            {/* Name — visible below flap tip */}
            {!isOpen && (
              <div className="absolute inset-x-0 bottom-4 top-[50%] z-[3] flex items-center justify-center px-5 pointer-events-none">
                <div className="text-center">
                  <p className="text-[9px] sm:text-[10px] tracking-[0.35em] text-gold/90 font-medium mb-1">
                    YOU ARE INVITED
                  </p>
                  <p className="font-display italic text-xl sm:text-2xl leading-tight envelope-name">
                    {babyName}
                  </p>
                  <p className="mt-1 font-arabic text-gold text-base">عقيقة</p>
                </div>
              </div>
            )}

            {/* Inner opening shadow */}
            <motion.div
              className="absolute inset-x-4 top-0 h-[46%] z-[4] pointer-events-none"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background:
                  "linear-gradient(180deg, oklch(0.32 0.04 58 / 0.35), transparent 90%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            />

            {/* Top flap */}
            <div
              className="absolute inset-x-0 top-0 h-[46%]"
              style={{
                perspective: 700,
                zIndex: isOpen ? 1 : 15,
              }}
            >
              <motion.div
                className="relative w-full h-full"
                style={{
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
                initial={false}
                animate={{
                  rotateX: isOpen ? [-12, -175] : 0,
                }}
                transition={{
                  duration: FLAP_OPEN,
                  times: [0, 1],
                  ease: [0.34, 1.05, 0.4, 1],
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, oklch(0.92 0.035 80) 0%, oklch(0.85 0.055 74) 100%)",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    backfaceVisibility: "hidden",
                    boxShadow: isOpen
                      ? "none"
                      : "0 8px 20px oklch(0.35 0.06 58 / 0.15)",
                  }}
                />

                {/* Wax seal */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 bottom-[6%] z-10"
                  animate={
                    isOpen
                      ? { scale: 0, opacity: 0, rotate: 12 }
                      : { scale: 1, opacity: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.35, ease: "easeIn" }}
                >
                  <motion.div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "radial-gradient(circle at 32% 28%, oklch(0.8 0.12 80), oklch(0.52 0.13 58))",
                      boxShadow:
                        "0 4px 14px oklch(0.35 0.1 50 / 0.45), inset 0 -2px 5px oklch(0.35 0.1 50 / 0.35)",
                    }}
                    animate={
                      stage === "closed"
                        ? { scale: [1, 1.06, 1] }
                        : { scale: 1 }
                    }
                    transition={{
                      duration: 2,
                      repeat: stage === "closed" ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                  >
                    <span className="font-arabic text-cream text-lg sm:text-xl">ع</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Invitation card slides up from inside */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="card"
                className="absolute left-1/2 -translate-x-1/2 w-[86%] z-20"
                style={{ bottom: "58%", originY: 1 }}
                initial={{ y: 72, opacity: 0, scale: 0.96 }}
                animate={{
                  y: stage === "card" ? -8 : 36,
                  opacity: 1,
                  scale: 1,
                }}
                exit={{ y: 40, opacity: 0 }}
                transition={{
                  y: {
                    duration: CARD_RISE,
                    ease: [0.22, 1, 0.36, 1],
                    delay: CARD_DELAY,
                  },
                  opacity: { duration: 0.3, delay: CARD_DELAY * 0.6 },
                  scale: { duration: CARD_RISE, delay: CARD_DELAY },
                }}
              >
                <div className="rounded-md border border-gold/25 bg-[oklch(0.995_0.008_85)] px-5 py-8 sm:py-9 text-center shadow-luxe">
                  <div className="gold-divider w-16 mx-auto mb-4" />
                  <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground">
                    Aqiqah Celebration
                  </p>
                  <p className="font-display italic text-2xl sm:text-3xl envelope-name mt-3">
                    {babyName}
                  </p>
                  <div className="gold-divider w-16 mx-auto mt-4" />
                  <p className="mt-4 text-xs text-muted-foreground">
                    Opening your invitation…
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>

      {/* Tap to open — clear CTA below envelope */}
      <AnimatePresence>
        {stage === "closed" && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3 }}
            onClick={handleOpen}
            className="envelope-cta mt-8 group"
          >
            <Sparkles className="size-3.5 opacity-80 group-hover:opacity-100 transition-opacity" />
            <span>Tap to open</span>
            <Sparkles className="size-3.5 opacity-80 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
