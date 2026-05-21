import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Envelope } from "@/components/Envelope";
import { Invitation, EVENT_BABY } from "@/components/Invitation";
import { Particles } from "@/components/Particles";
import { AmbienceToggle } from "@/components/AmbienceToggle";
import { Loader } from "@/components/Loader";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Aqiqah Invitation · Wajdan Ullah Khan" },
      {
        name: "description",
        content:
          "Mr & Mrs Wajahat Ullah Khan invite you to the Aqiqah of Wajdan Ullah Khan — Friday, 29 May 2026 at 8:00 PM, Kohinoor Ballroom, North Karachi.",
      },
      { property: "og:title", content: "Aqiqah Invitation · Wajdan Ullah Khan" },
      {
        property: "og:description",
        content:
          "Join us for the Aqiqah ceremony of Wajdan Ullah Khan, In Sha Allah on Friday, 29 May 2026.",
      },
    ],
  }),
});

function Index() {
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [envelopeOpening, setEnvelopeOpening] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("aqiqah-theme");
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      <AmbienceToggle autoPlayWhenReady={!loading} />

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(8px)" }}
            transition={{ duration: 1 }}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20 sm:pt-28 pb-10"
          >
            <Particles count={35} />
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, oklch(0.95 0.04 80) 0%, var(--background) 70%)",
              }}
            />
            <div className="text-center w-full max-w-lg mx-auto">
              <motion.div
                animate={{
                  opacity: envelopeOpening ? 0 : 1,
                  height: envelopeOpening ? 0 : "auto",
                  marginBottom: envelopeOpening ? 0 : undefined,
                }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="font-arabic text-gold text-xl mb-2">بسم الله</p>
                <p className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground mb-10 sm:mb-12">
                  A Sacred Invitation Awaits
                </p>
              </motion.div>
              <Envelope
                babyName={EVENT_BABY}
                onOpening={() => setEnvelopeOpening(true)}
                onOpened={() => setOpened(true)}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="invitation"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Invitation />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
