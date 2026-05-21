import { motion, type MotionProps } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & MotionProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}