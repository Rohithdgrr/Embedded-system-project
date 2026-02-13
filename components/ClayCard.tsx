
import React from 'react';
import { motion } from 'framer-motion';

// Fixed: Added style property to support custom CSS properties like dynamic border colors
interface ClayCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

export const ClayCard: React.FC<ClayCardProps> = ({ children, className = "", delay = 0, style }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      className={`clay-card p-6 ${className}`}
      style={style}
    >
      {children}
    </motion.div>
  );
};
