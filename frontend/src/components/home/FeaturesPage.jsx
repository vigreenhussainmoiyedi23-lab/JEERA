import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Users, BarChart, Clock, Globe, Rocket, Star, ArrowRight } from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Experience blazing-fast performance with optimized workflows and instant synchronization across all devices.',
      color: 'from-yellow-400 to-orange-500',
      bgGradient: 'from-yellow-400/10 to-orange-500/10'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption, SOC 2 compliance, and advanced threat protection keep your data safe and secure.',
      color: 'from-blue-400 to-cyan-500',
      bgGradient: 'from-blue-400/10 to-cyan-500/10'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Real-time collaboration with team members, file sharing, and seamless communication tools.',
      color: 'from-purple-400 to-pink-500',
      bgGradient: 'from-purple-400/10 to-pink-500/10'
    },
    {
      icon: BarChart,
      title: 'Advanced Analytics',
      description: 'Deep insights into your projects with comprehensive analytics, custom reports, and data visualization.',
      color: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-400/10 to-emerald-500/10'
    },
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Automatic time tracking, productivity insights, and detailed timesheet management for accurate billing.',
      color: 'from-red-400 to-rose-500',
      bgGradient: 'from-red-400/10 to-rose-500/10'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Multi-language support, timezone-aware scheduling, and global collaboration capabilities.',
      color: 'from-indigo-400 to-purple-500',
      bgGradient: 'from-indigo-400/10 to-purple-500/10'
    }
  ];

  const capabilities = [
    {
      title: 'Project Management',
      items: [
        'Kanban boards & Gantt charts',
        'Task dependencies & milestones',
        'Resource allocation',
        'Budget tracking',
        'Custom workflows'
      ]
    },
    {
      title: 'Communication',
      items: [
        'Real-time chat & video calls',
        'Screen sharing & whiteboarding',
        'File sharing & version control',
        'Discussion threads',
        'Mention notifications'
      ]
    },
    {
      title: 'Integrations',
      items: [
        'Slack, Microsoft Teams, Zoom',
        'GitHub, GitLab, Bitbucket',
        'Google Workspace, Office 365',
        'Zapier, webhooks, API',
        'Custom app development'
      ]
    },
    {
      title: 'Security & Compliance',
      items: [
        'End-to-end encryption',
        'Two-factor authentication',
        'Role-based access control',
        'Audit logs & compliance',
        'Data residency options'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Modern Teams
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Everything you need to manage projects, collaborate with your team, and accelerate your workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/30"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built for teams that demand excellence. Our features are designed to boost productivity and streamline collaboration.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className={`bg-gradient-to-br ${feature.bgGradient} rounded-2xl border border-white/10 p-8 h-full hover:scale-105 transition-transform duration-300`}>
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Comprehensive Capabilities
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From project planning to execution, we've got you covered with industry-leading tools and features.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">{category.title}</h3>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-gray-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of teams who rely on our platform to deliver exceptional results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '99.9%', label: 'Uptime' },
              { number: '10M+', label: 'Projects Managed' },
              { number: '50K+', label: 'Active Teams' },
              { number: '150+', label: 'Countries' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-3xl border border-white/20 p-12 text-center"
          >
            <Rocket className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start your free 14-day trial today. No credit card required. Cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/30"
              >
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
