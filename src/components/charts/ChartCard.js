'use client';

import { motion } from 'framer-motion';
import styles from './charts.module.css';

export default function ChartCard({ title, subtitle, children, action, className = '' }) {
  return (
    <motion.div
      className={`${styles.chartCard} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.chartHeader}>
        <div>
          <h4 className={styles.chartTitle}>{title}</h4>
          {subtitle && <p className={styles.chartSubtitle}>{subtitle}</p>}
        </div>
        {action && <div className={styles.chartAction}>{action}</div>}
      </div>
      <div className={styles.chartBody}>
        {children}
      </div>
    </motion.div>
  );
}
