import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface RouteTransitionProps {
  children: ReactNode;
}

const routeTransition = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1],
} as const;

const RouteTransition = ({ children }: RouteTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={routeTransition}>
      {children}
    </motion.div>
  );
};

export default RouteTransition;
