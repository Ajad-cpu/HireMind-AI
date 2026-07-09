import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Find Your Dream Job with{' '}
              <span className="text-primary-600">AI-Powered</span> Insights
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Upload your resume, get instant ATS scoring, and let our AI match you with the perfect role.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/jobs">
                <Button size="lg">Browse Jobs</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg">Get Started</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose AI Job Portal?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Resume Screening',
                description: 'Get instant ATS compatibility scores and AI-powered resume analysis to improve your chances.',
                icon: '🤖',
              },
              {
                title: 'Smart Job Matching',
                description: 'Our AI matches your skills and experience with the perfect job opportunities.',
                icon: '🎯',
              },
              {
                title: 'Real-time Insights',
                description: 'Receive detailed feedback and recommendations to optimize your job applications.',
                icon: '📊',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};