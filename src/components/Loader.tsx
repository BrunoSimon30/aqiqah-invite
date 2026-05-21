import { motion } from "framer-motion";

export function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="size-16 mx-auto rounded-full border-2 border-gold/30 border-t-gold"
        />
        <p className="mt-6 font-arabic text-gold text-xl">بسم الله</p>
        <p className="mt-2 text-xs tracking-[0.4em] text-muted-foreground">
          PREPARING YOUR INVITATION
        </p>
      </div>
    </motion.div>
  );
}
