'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import styles from './landing-components.module.css';

export default function DataCard({ title, value, icon: Icon, color, delay }) {
  const { theme } = useTheme();
  const isDark = theme !== 'light';

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Dynamic Styles based on Theme
  const cardStyle = {
    rotateX,
    rotateY,
    transformStyle: 'preserve-3d',
    background: isDark ? 'rgba(20, 20, 25, 0.4)' : 'rgba(255, 255, 255, 0.6)',
    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
    boxShadow: isDark 
      ? '0 30px 60px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' 
      : '0 30px 60px -10px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)',
  };

  return (
    <motion.div
      className={styles.dataCardWrapper}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className={styles.dataCard}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={cardStyle}
      >
        <div
          className={styles.dataCardInner}
          style={{ transform: 'translateZ(50px)' }}
        >
          <div className={styles.iconWrapper} style={{ backgroundColor: `${color}20`, color }}>
            <Icon size={24} />
          </div>
          <div className={styles.dataContent}>
            <span className={styles.dataTitle}>{title}</span>
            <span className={styles.dataValue} style={{ color }}>{value}</span>
            <div className={styles.sparkline}>
               {/* Decorative sparkline using local SVG */}
              <svg viewBox="0 0 100 30" style={{ stroke: color, fill: 'none', strokeWidth: 3, strokeLinecap: 'round' }}>
                 <path d="M 0,25 C 20,20 30,10 50,15 C 70,20 80,5 100,10" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
