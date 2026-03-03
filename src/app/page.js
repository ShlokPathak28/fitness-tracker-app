'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Activity,
  BarChart3,
  Target,
  Zap,
  TrendingUp,
  Shield,
  ArrowRight,
  Dumbbell,
  Heart,
  Flame,
  ChevronRight,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import styles from './landing.module.css';

const features = [
  {
    icon: BarChart3,
    title: 'Beautiful Charts',
    desc: 'Visualize your progress with stunning, interactive charts that make data meaningful.',
    color: '#6366f1',
  },
  {
    icon: Dumbbell,
    title: 'Workout Tracking',
    desc: 'Log every set, rep, and mile. Track strength, cardio, and flexibility workouts.',
    color: '#8b5cf6',
  },
  {
    icon: Target,
    title: 'Smart Goals',
    desc: 'Set and crush personalized fitness goals with intelligent progress tracking.',
    color: '#06b6d4',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    desc: 'Deep insights into your fitness journey with trends, personal records, and streaks.',
    color: '#10b981',
  },
  {
    icon: Heart,
    title: 'Body Metrics',
    desc: 'Track weight, body fat, and measurements over time to see real transformation.',
    color: '#ec4899',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your data is protected with enterprise-grade Supabase security and encryption.',
    color: '#f59e0b',
  },
];

const stats = [
  { value: '50K+', label: 'Workouts Logged' },
  { value: '12K+', label: 'Active Users' },
  { value: '98%', label: 'Satisfaction' },
  { value: '24/7', label: 'Available' },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      {/* Nav */}
      <motion.header
        className={styles.nav}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className={styles.navInner}>
          <div className={styles.navLogo}>
            <div className={styles.logoIcon}>
              <Activity size={22} strokeWidth={2.5} />
            </div>
            <span className={styles.logoText}>FitTrack</span>
          </div>
          <div className={styles.navActions}>
            <ThemeToggle />
            <Link href="/login" className="btn btn-ghost">
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary">
              Get Started Free
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGlow2} />
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className={styles.heroBadge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Zap size={14} />
            <span>Your premium fitness companion</span>
          </motion.div>
          
          <h1 className={styles.heroTitle}>
            Track. Visualize.
            <br />
            <span className="gradient-text">Transform.</span>
          </h1>
          
          <p className={styles.heroSubtitle}>
            The most beautiful way to track your fitness journey.
            Log workouts, set goals, and watch your progress come alive
            through stunning charts and analytics.
          </p>

          <div className={styles.heroCTA}>
            <Link href="/signup" className="btn btn-primary btn-lg">
              Start Your Journey
              <ChevronRight size={18} />
            </Link>
            <Link href="/login" className="btn btn-secondary btn-lg">
              I have an account
            </Link>
          </div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className={styles.floatingCard}
          style={{ top: '15%', right: '8%' }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className={styles.miniStatCard}>
            <Flame size={20} style={{ color: '#ef4444' }} />
            <div>
              <span className={styles.miniStatValue}>2,450</span>
              <span className={styles.miniStatLabel}>Calories Burned</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.floatingCard}
          style={{ bottom: '20%', left: '5%' }}
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <div className={styles.miniStatCard}>
            <TrendingUp size={20} style={{ color: '#10b981' }} />
            <div>
              <span className={styles.miniStatValue}>+12%</span>
              <span className={styles.miniStatLabel}>This Month</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.floatingCard}
          style={{ top: '60%', right: '12%' }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <div className={styles.miniStatCard}>
            <Target size={20} style={{ color: '#6366f1' }} />
            <div>
              <span className={styles.miniStatValue}>85%</span>
              <span className={styles.miniStatLabel}>Goals Completed</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <motion.section className={styles.statsBar} {...fadeUp}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className={styles.statItem}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </motion.div>
        ))}
      </motion.section>

      {/* Features */}
      <section className={styles.features}>
        <motion.div className={styles.sectionHeader} {...fadeUp}>
          <h2>
            Everything you need to
            <br />
            <span className="gradient-text">crush your goals</span>
          </h2>
          <p>A complete fitness tracking toolkit designed with beauty and simplicity in mind.</p>
        </motion.div>

        <div className={styles.featureGrid}>
          {features.map((item, i) => (
            <motion.div
              key={item.title}
              className={styles.featureCard}
              {...stagger}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div
                className={styles.featureIcon}
                style={{ background: `${item.color}15`, color: item.color }}
              >
                <item.icon size={24} />
              </div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.section className={styles.cta} {...fadeUp}>
        <div className={styles.ctaGlow} />
        <h2>Ready to transform your fitness journey?</h2>
        <p>Join thousands who've already started tracking smarter, not harder.</p>
        <Link href="/signup" className="btn btn-primary btn-lg">
          Get Started — It&apos;s Free
          <ArrowRight size={18} />
        </Link>
      </motion.section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.navLogo}>
              <div className={styles.logoIcon}>
                <Activity size={18} strokeWidth={2.5} />
              </div>
              <span className={styles.logoText}>FitTrack</span>
            </div>
            <p>Your premium fitness companion. Track, visualize, transform.</p>
          </div>
          <p className={styles.footerCopy}>
            © {new Date().getFullYear()} FitTrack. Built with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
