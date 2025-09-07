"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Heart,
  Shield,
  Users,
  MessageCircle,
  CheckCircle,
  Star,
  ArrowRight,
  Cloud,
  UploadCloud,
  Globe,
  Clock,
  Phone,
  Leaf
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const pop = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
};

const LandingPage: React.FC = () => {
  const { isSignedIn, user } = useUser();

  const features = [
    {
      icon: <UploadCloud className="h-8 w-8" aria-hidden />,
      title: "Soil & Input Upload",
      description: "Farmers upload soil test results and location data for precise analysis."
    },
    {
      icon: <Cloud className="h-8 w-8" aria-hidden />,
      title: "Weather & Climate Insights",
      description: "Real-time weather and seasonal climate analytics from trusted APIs."
    },
    {
      icon: <Bot className="h-8 w-8" aria-hidden />,
      title: "AI Crop Predictions",
      description: "ML models recommend the best crops and estimate expected yield."
    },
    {
      icon: <Shield className="h-8 w-8" aria-hidden />,
      title: "Pest & Disease Prevention",
      description: "Actionable prevention and localized treatment steps for common pests."
    },
    {
      icon: <Phone className="h-8 w-8" aria-hidden />,
      title: "Farmer App & Offline Mode",
      description: "Lightweight app with offline support for low-connectivity areas."
    },
    {
      icon: <Leaf className="h-8 w-8" aria-hidden />,
      title: "Feedback Loop",
      description: "Farmer feedback improves recommendations over time and localizes models."
    }
  ];

  const stats = [
    { number: "5,000+", label: "Farmers Supported" },
    { number: "120+", label: "Crop Varieties" },
    { number: "12", label: "Regions Covered" },
    { number: "92%", label: "Recommendation Accuracy" }
  ];

  const testimonials = [
    {
      name: "Ashok Mehta",
      role: "Progressive Farmer, Ranchi",
      content: "Smart-Harvest's recommendations improved our yield and helped avoid a pest outbreak.",
      rating: 5
    },
    {
      name: "Dr. Meera Rao",
      role: "Agri Extension Officer",
      content: "Region-specific advice and offline support make this tool practical for distant villages.",
      rating: 5
    },
    {
      name: "Suresh Patel",
      role: "Village Farmer",
      content: "Easy to use, local language tips are very helpful during the cropping season.",
      rating: 5
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-[#1F2937]">
      {/* Hero Section */}
      <motion.section
        id="home"
        className="pt-24 pb-16 bg-[#F0FDF4] min-h-screen flex items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-[#059669] mb-8 shadow-lg"
              variants={pop}
            >
              <Bot size={16} />
              <span>SIH25049 - AI-Driven Crop Recommendation</span>
            </motion.div>

            <motion.h1 className="text-4xl md:text-6xl font-extrabold mb-6" variants={fadeInUp}>
              <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                AI-Powered Crop Recommendation
              </span>
              <br />
              <span className="text-[#1F2937]">Assistant for Jharkhand</span>
            </motion.h1>

            <motion.p className="text-lg md:text-xl text-[#374151] mb-12 max-w-3xl mx-auto leading-relaxed" variants={fadeInUp}>
              🌱 Get instant, localized crop recommendations—understand soil and weather conditions,
              choose suitable crops, and follow pest & disease prevention steps — all from an intelligent
              AI assistant trained on agricultural datasets.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-6 justify-center items-center" variants={fadeInUp}>
              <motion.button
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-semibold hover:from-[#047a56] hover:to-[#0ea06a] transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 shadow-xl"
                onClick={() => scrollToSection('#chat')}
                aria-label="Start recommendation chat"
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <MessageCircle size={20} />
                <span>{isSignedIn ? 'Start Recommendation' : 'Try Demo Chat'}</span>
              </motion.button>

              <motion.button
                className="flex items-center space-x-2 bg-white text-green-500 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg border border-gray-200"
                onClick={() => scrollToSection('#features')}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Heart size={20} />
                <span>Explore Features</span>
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section className="py-16 bg-[#F0FDF4]" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={containerVariants}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8" variants={containerVariants}>
            {stats.map((stat, index) => (
              <motion.div key={index} className="text-center" variants={fadeInUp}>
                <div className="text-3xl md:text-4xl font-bold text-green-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-[#374151] font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section id="features" className="py-20 bg-white" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={containerVariants}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1F2937] mb-6">
              AI-Powered Crop <span className="text-green-500">& Farming Solutions</span>
            </h2>
            <p className="text-lg text-[#374151] max-w-3xl mx-auto">
              Our AI assistant combines agricultural expertise with local soil and weather data to give
              practical, farmer-friendly recommendations.
            </p>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                variants={fadeInUp}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 260 }}
              >
                <div className="bg-gradient-to-br from-green-500 to-green-500 text-white p-3 rounded-xl w-fit mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-4">{feature.title}</h3>
                <p className="text-[#374151] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section id="info" className="py-20 bg-[#F0FDF4]" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={containerVariants}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="grid lg:grid-cols-2 gap-12 items-center" variants={containerVariants}>
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-5xl font-bold text-[#1F2937] mb-6">
                About <span className="text-green-500">Smart-Harvest AI</span>
              </h2>
              <p className="text-lg text-[#374151] mb-6 leading-relaxed">
                Built for the Smart India Hackathon 2025 (SIH25049), Smart-Harvest AI helps farmers make
                confident crop decisions using machine learning, soil analytics and weather-driven models.
                Recommendations are localized for Jharkhand and designed to work even in low-connectivity areas.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-[#374151]">Fine-tuned agricultural models</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-[#374151]">Region-specific farming guidance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-[#374151]">Multi-language & offline support</span>
                </div>
              </div>
            </motion.div>

            <motion.div className="bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-2xl text-white" variants={fadeInUp}>
              <h3 className="text-2xl font-bold mb-4">Why Choose Smart-Harvest AI?</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <CheckCircle size={20} />
                  <span>ML-driven, explainable recommendations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle size={20} />
                  <span>Real-time weather & soil integration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle size={20} />
                  <span>Privacy-focused and farmer-first</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle size={20} />
                  <span>Designed for low bandwidth & offline use</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section className="py-20 bg-white" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={containerVariants}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1F2937] mb-6">
              What <span className="text-green-500">Farmers Say</span>
            </h2>
            <p className="text-lg text-[#374151] max-w-3xl mx-auto">
              Farmers and extension officers trust Smart-Harvest AI for timely, practical guidance.
            </p>
          </motion.div>

          <motion.div className="grid md:grid-cols-3 gap-8" variants={containerVariants}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 220 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-[#374151] mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-[#1F2937]">{testimonial.name}</div>
                  <div className="text-sm text-[#6B7280]">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section id="chat" className="py-20 bg-gradient-to-br from-green-500 to-green-600" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={containerVariants}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 className="text-3xl md:text-5xl font-bold text-white mb-6" variants={fadeInUp}>
            Ready to Get Started?
          </motion.h2>
          <motion.p className="text-lg text-emerald-100 mb-12 max-w-2xl mx-auto" variants={fadeInUp}>
            {isSignedIn
              ? `Welcome back, ${user?.firstName}! Start your farm consultation now.`
              : 'Join thousands of farmers who trust Smart-Harvest for crop recommendations.'}
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-6 justify-center items-center" variants={fadeInUp}>
            <motion.button
              className="flex items-center space-x-2 bg-white text-green-500 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 shadow-xl"
              onClick={() => scrollToSection('#features')}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <MessageCircle size={20} />
              <span>Start Recommendation</span>
            </motion.button>

            <motion.button
              className="flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-green-500 transition-all duration-200"
              onClick={() => scrollToSection('#contact')}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Phone size={20} />
              <span>Farmer Helpline</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section id="contact" className="py-20 bg-white" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={containerVariants}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 className="text-3xl md:text-5xl font-bold text-[#1F2937] mb-6" variants={fadeInUp}>
            Get in <span className="text-green-500">Touch</span>
          </motion.h2>
          <motion.p className="text-lg text-[#374151] mb-12 max-w-2xl mx-auto" variants={fadeInUp}>
            Have questions about Smart-Harvest AI? We're here to help farmers across Jharkhand and nearby regions.
          </motion.p>

          <motion.div className="grid md:grid-cols-3 gap-8 mb-12" variants={containerVariants}>
            <motion.div className="text-center" variants={fadeInUp} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 220 }}>
              <div className="bg-[#ECFDF3] p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-[#1F2937] mb-2">Chat Support</h3>
              <p className="text-[#374151]">24/7 recommendation chat for common queries</p>
            </motion.div>

            <motion.div className="text-center" variants={fadeInUp} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 220 }}>
              <div className="bg-[#ECFDF3] p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-[#1F2937] mb-2">Community</h3>
              <p className="text-[#374151]">Join peer groups and extension officer forums</p>
            </motion.div>

            <motion.div className="text-center" variants={fadeInUp} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 220 }}>
              <div className="bg-[#ECFDF3] p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-[#1F2937] mb-2">Agri Partners</h3>
              <p className="text-[#374151]">Collaboration with local agri-centers and labs</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer className="bg-gray-900 text-white py-12" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={fadeInUp}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-500 rounded-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">Smart-Harvest</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering farmers in Jharkhand with AI-driven crop recommendations, weather insights,
                and pest prevention guidance.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Agricultural Topics</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#diseases" className="hover:text-white transition-colors">Climate Info</a></li>
                <li><a href="#prevention" className="hover:text-white transition-colors">Prevention</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nutrition</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Soil Health</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Smart-Harvest - SIH25049. Developed to support farmers in Jharkhand.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
