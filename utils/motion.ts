import type { Variants, Transition } from 'framer-motion';

// Spring used across the site (snappy but not bouncy)
export const spring: Transition = { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 };

// Fade + slide up, used for section entrances
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { ...spring } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

// Stagger container — pair with fadeUp on children
export const stagger = (staggerChildren = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

// Card hover lift (use as whileHover on a motion.div)
export const hoverLift = {
  whileHover: { y: -6, transition: spring },
  whileTap: { scale: 0.99 },
};

// Modal overlay + panel
export const overlay: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modal: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: spring },
  exit: { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.15 } },
};