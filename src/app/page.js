'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
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
  ChevronRight,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import styles from './landing.module.css';
import Scene from '@/components/landing/Scene';
import DataCard from '@/components/landing/DataCard';

const features = [
  {
    icon: BarChart3,
    title: 'Beautiful Analytics',
    desc: 'Visualize your progress with stunning, interactive charts that make data beautiful and meaningful.',
    color: '#6366f1',
  },
  {
    icon: Dumbbell,
    title: 'Workout Tracking',
    desc: 'Log every set, rep, and mile with precision. Track strength and cardio.',
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
    title: 'Deep Insights',
    desc: 'Dive into trends, personal records, and granular data of your fitness journey.',
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
    title: 'Secure by Design',
    desc: 'Your data is protected with enterprise-grade security and encryption.',
    color: '#f59e0b',
  },
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
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax values for main content
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className={styles.landing} ref={containerRef}>
      {/* 3D Background Scene */}
      <div className={styles.sceneContainer}>
        <Scene />
      </div>

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
        <motion.div
          className={styles.heroContent}
          style={{ y: heroY, opacity: heroOpacity }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className={styles.heroBadge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Zap size={14} />
            <span>Welcome to the future of fitness</span>
          </motion.div>
          
          <h1 className={styles.heroTitle}>
            Data-Driven.
            <br />
            <span className="gradient-text gradient-animated">Results-Oriented.</span>
          </h1>
          
          <p className={styles.heroSubtitle}>
            Experience a fitness tracker that looks as good as you feel.
            Interactive 3D tracking, beautiful analytics, and personalized insights 
            to help you transform your body.
          </p>

          <div className={styles.heroCTA}>
            <Link href="/signup" className="btn btn-primary btn-lg shine-effect">
              Start Your Journey
              <ChevronRight size={18} />
            </Link>
            <Link href="/login" className="btn btn-secondary btn-lg glass-effect">
              I have an account
            </Link>
          </div>
        </motion.div>

        {/* 3D Interactive Data Cards Layout */}
        <div className={styles.cardsContainer}>
           <DataCard title="Weekly Volume" value="12,450 kg" icon={Dumbbell} color="#8b5cf6" delay={0.4} />
           <DataCard title="Calories Burned" value="3,240 kcal" icon={Zap} color="#ec4899" delay={0.6} />
           <DataCard title="Goal Progress" value="85%" icon={Target} color="#10b981" delay={0.8} />
        </div>
      </section>

      {/* Stats Bar */}
      <section className={styles.statsSection}>
        <div className={styles.statsInner}>
            {[
            { value: '50K+', label: 'Workouts Logged' },
            { value: '12K+', label: 'Active Users' },
            { value: '98%', label: 'Satisfaction' },
            { value: '24/7', label: 'Availability' },
            ].map((stat, i) => (
            <motion.div
                key={stat.label}
                className={styles.statItem}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
            >
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
            </motion.div>
            ))}
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <motion.div className={styles.sectionHeader} {...fadeUp}>
          <h2>
            Everything you need to
            <br />
            <span className="gradient-text">crush your goals</span>
          </h2>
          <p>A complete fitness tracking toolkit beautifully crafted for you.</p>
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
                style={{ background: `${item.color}15`, color: item.color, boxShadow: `0 0 20px ${item.color}30` }}
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
        <Link href="/signup" className="btn btn-primary btn-lg shine-effect">
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
            <p>Your premium 3D fitness companion.</p>
          </div>
          <p className={styles.footerCopy}>
            © {new Date().getFullYear()} FitTrack. Built with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
