"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";

const varian: Variants = {
  sembunyi: { opacity: 0, y: 28 },
  tampil: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export default function Reveal({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      custom={delay}
      variants={varian}
      initial="sembunyi"
      whileInView="tampil"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
