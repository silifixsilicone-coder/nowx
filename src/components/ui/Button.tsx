'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'glow' | 'pink-glow' | 'orange-glow';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'solid',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  // Sizing styles
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg font-medium',
    md: 'px-4 py-2 text-sm rounded-xl font-semibold',
    lg: 'px-6 py-3 text-base rounded-2xl font-bold tracking-wide',
  };

  // Variant styles
  const variantClasses = {
    solid: 'bg-purple text-text hover:bg-opacity-90 active:bg-opacity-80 transition-colors shadow-lg shadow-purple/10',
    outline: 'border border-purple/40 text-purple hover:bg-purple/10 hover:border-purple active:bg-purple/20 transition-all',
    ghost: 'text-gray-text hover:text-text hover:bg-white/5 active:bg-white/10 transition-colors',
    glow: 'bg-purple text-text hover:bg-opacity-95 shadow-[0_0_20px_rgba(124,58,237,0.5)] active:shadow-[0_0_10px_rgba(124,58,237,0.3)] transition-all',
    'pink-glow': 'bg-pink text-text hover:bg-opacity-95 shadow-[0_0_20px_rgba(255,46,147,0.5)] active:shadow-[0_0_10px_rgba(255,46,147,0.3)] transition-all',
    'orange-glow': 'bg-orange text-text hover:bg-opacity-95 shadow-[0_0_20px_rgba(255,138,0,0.5)] active:shadow-[0_0_10px_rgba(255,138,0,0.3)] transition-all',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={`inline-flex items-center justify-center cursor-pointer select-none active:outline-none focus:outline-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
