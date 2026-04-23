"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export function XPGainToast({ amount, show }: { amount: number; show: boolean }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          className="pointer-events-none fixed left-1/2 top-28 z-[90] -translate-x-1/2 rounded-full border border-primary/40 bg-primary/15 px-5 py-2 text-sm font-bold text-white shadow-glow-lg backdrop-blur"
        >
          <span className="inline-flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />+{amount} XP
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
