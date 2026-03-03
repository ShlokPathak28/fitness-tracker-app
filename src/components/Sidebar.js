'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Dumbbell,
  TrendingUp,
  Target,
  User,
  LogOut,
  ChevronLeft,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';
import styles from './Sidebar.module.css';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { href: '/progress', icon: TrendingUp, label: 'Progress' },
  { href: '/goals', icon: Target, label: 'Goals' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className={styles.sidebarInner}>
          {/* Logo */}
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  className={styles.logoText}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  FitTrack
                </motion.span>
              )}
            </AnimatePresence>
            <button
              className={styles.collapseBtn}
              onClick={() => setCollapsed(!collapsed)}
            >
              <motion.div
                animate={{ rotate: collapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeft size={16} />
              </motion.div>
            </button>
          </div>

          {/* Navigation */}
          <nav className={styles.nav}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  {isActive && (
                    <motion.div
                      className={styles.activeIndicator}
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon size={20} className={styles.navIcon} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className={styles.sidebarBottom}>
            <ThemeToggle />
            <button
              className={styles.navItem}
              onClick={signOut}
              title={collapsed ? 'Sign Out' : undefined}
            >
              <LogOut size={20} className={styles.navIcon} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Sign Out
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* User info */}
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  className={styles.userInfo}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className={styles.userAvatar}>
                    {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
                  </div>
                  <div className={styles.userDetails}>
                    <span className={styles.userName}>
                      {profile?.full_name || 'User'}
                    </span>
                    <span className={styles.userEmail}>
                      {user?.email || ''}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <nav className={styles.mobileNav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.mobileNavItem} ${isActive ? styles.mobileActive : ''}`}
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
