// src/pages/Home.jsx
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRef } from 'react';
import Hero from '../components/Hero';
import {
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Statistics data
const stats = [
  { label: 'Insurance Policies Analyzed', value: '10+', icon: DocumentTextIcon },
  { label: 'Languages Supported', value: '10+', icon: GlobeAltIcon },
  { label: 'User Satisfaction', value: '98%', icon: ChartBarIcon },
  { label: 'AI-Powered Insights', value: '24/7', icon: SparklesIcon }
];

// Benefits section data
const benefits = [
  {
    title: 'Clear Understanding',
    description: 'Transform complex insurance documents into easy-to-understand summaries that highlight key terms and coverage details.',
    icon: DocumentTextIcon,
  },
  {
    title: 'Language Accessibility',
    description: 'Break language barriers with instant translations into regional languages, ensuring everyone understands their policy.',
    icon: GlobeAltIcon,
  },
  {
    title: 'Intelligent Assistance',
    description: 'Get instant answers to your policy questions with our AI-powered chatbot that understands your specific insurance documents.',
    icon: ChatBubbleBottomCenterTextIcon,
  }
];

// Animated Shield SVG Component
const AnimatedShield = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20
    }}
    className="w-64 h-64 mx-auto"
  >
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      // whileHover={{ rotate: 360 }}
      transition={{ duration: 1 }}
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 5 }}
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
    </motion.svg>
  </motion.div>
);

// Animated Counter Component
const Counter = ({ from, to }) => {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef);

  const count = useSpring(from, {
    to: isInView ? to : from,
    duration: 2000,
  });

  return (
    <motion.span ref={nodeRef}>
      {count.to((value) => Math.floor(value))}
    </motion.span>
  );
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Animated Shield Section */}
      <section className="relative h-[60vh] bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center">
        <h1 className=' font-bold text-6xl mb-7'>We Help You To Buy Insurance</h1>
        <AnimatedShield />
      </section>

      {/* Statistics Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-primary"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm"
              >
                <stat.icon className="h-8 w-8 mx-auto text-white mb-4" />
                <motion.dt className="text-2xl font-bold text-white">
                  {stat.label.includes('98') ? (
                    <Counter from={0} to={98} />
                  ) : (
                    stat.value
                  )}
                </motion.dt>
                <dd className="text-sm text-gray-100 mt-2">{stat.label}</dd>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose PolicyLens?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience a new way of understanding your insurance policies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)"
                }}
                className="relative p-8 bg-gray-50 rounded-2xl hover:bg-white transition-colors duration-300"
              >
                <motion.div
                  className="absolute -top-4 left-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <benefit.icon className="h-8 w-8 text-primary" />
                </motion.div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mt-4 text-gray-600">
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-24 bg-gradient-to-r from-primary to-secondary"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Transform Your Insurance Experience?
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-100">
            Join thousands of users who have already simplified their insurance understanding
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10"
          >
            <a
              href="/signup"
              className="rounded-md bg-white px-8 py-3 text-base font-semibold text-primary shadow-sm hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-2"
            >
              Get Started Today
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
