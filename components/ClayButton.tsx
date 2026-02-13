
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

// Fixed: Extended HTMLMotionProps<"button"> to resolve type conflicts with framer-motion's specific event handlers
interface ClayButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const ClayButton: React.FC<ClayButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading,
  className = "",
  ...props 
}) => {
  const variants = {
    primary: "bg-[#6C5CE7] text-white",
    secondary: "bg-[#00B894] text-white",
    danger: "bg-[#FF6B6B] text-white",
    ghost: "bg-white text-[#2D3436] border-2 border-[#E8E2DC]"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={`clay-button px-6 py-3 font-semibold flex items-center justify-center gap-2 ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : children}
    </motion.button>
  );
};
