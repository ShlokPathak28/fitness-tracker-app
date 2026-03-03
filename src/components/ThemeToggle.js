'use client';

import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle({ size = 20 }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      className="btn-icon btn-ghost"
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
      >
        {theme === 'light' ? (
          <Moon size={size} />
        ) : (
          <Sun size={size} />
        )}
      </motion.div>
    </motion.button>
  );
}
