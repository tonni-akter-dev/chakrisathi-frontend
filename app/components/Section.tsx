'use client';
import { motion, type MotionProps } from 'framer-motion';
import { fadeUp } from '@/utils/motion';

interface Props extends MotionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: 'section' | 'div';
  delay?: number;
}

export default function Section({ children, className, id, as = 'section', delay = 0, ...rest }: Props) {
  const Comp = as === 'section' ? motion.section : motion.div;
  return (
    <Comp
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}