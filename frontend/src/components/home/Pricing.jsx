import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, X, Star, Zap, Shield, Headphones } from "lucide-react";

const Pricing = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals and small projects",
      price: billingCycle === "monthly" ? 9 : 90,
      originalPrice: billingCycle === "monthly" ? null : 108,
      features: [
        "Up to 5 projects",
        "10GB storage",
        "Basic collaboration tools",
        "Email support",
        "Mobile app access",
        "Basic analytics",
      ],
      notIncluded: [
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "API access",
      ],
      color: "from-blue-500 to-cyan-500",
      popular: false,
    },
    {
      name: "Professional",
      description: "Ideal for growing teams and businesses",
      price: billingCycle === "monthly" ? 29 : 290,
      originalPrice: billingCycle === "monthly" ? null : 348,
      features: [
        "Up to 50 projects",
        "100GB storage",
        "Advanced collaboration tools",
        "Priority email support",
        "Mobile & desktop apps",
        "Advanced analytics",
        "Custom integrations",
        "Team management",
        "Backup & recovery",
      ],
      notIncluded: [
        "Dedicated support",
        "Custom branding",
        "Advanced security features",
      ],
      color: "from-purple-500 to-pink-500",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Complete solution for large organizations",
      price: billingCycle === "monthly" ? 99 : 990,
      originalPrice: billingCycle === "monthly" ? null : 1188,
      features: [
        "Unlimited projects",
        "Unlimited storage",
        "Enterprise collaboration tools",
        "24/7 phone & email support",
        "All platform features",
        "Custom analytics dashboard",
        "Advanced API access",
        "Custom branding",
        "Advanced security & compliance",
        "Dedicated account manager",
        "Custom training sessions",
        "SLA guarantee",
      ],
      notIncluded: [],
      color: "from-amber-500 to-orange-500",
      popular: false,
    },
  ];

  const handleGetStarted = (planName) => {
    navigate("/payment", { state: { plan: planName, billingCycle } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ z: 10 }}
          className="text-center mb-16 z-50"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Choose Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              Perfect Plan
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={`text-lg ${billingCycle === "monthly" ? "text-white" : "text-gray-400"}`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly",
                )
              }
              className="relative w-16 h-8 bg-gray-700 rounded-full transition-colors"
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  billingCycle === "yearly" ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-lg ${billingCycle === "yearly" ? "text-white" : "text-gray-400"}`}
            >
              Yearly
              <span className="ml-2 text-sm text-green-400 font-semibold">
                Save 17%
              </span>
            </span>
          </div>
        </motion.div>
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative ${plan.popular ? "scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div
                    className="bg-gradient-to-r z-10 from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1"
                  >
                    <Star className="w-4 h-4 " />
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl border ${
                  plan.popular ? "border-purple-500" : "border-white/10"
                } p-8 h-full`}
              >
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  <div className="mb-4">
                    {plan.originalPrice && (
                      <div className="text-gray-500 line-through text-sm">
                        ${plan.originalPrice}/
                        {billingCycle === "monthly" ? "mo" : "yr"}
                      </div>
                    )}
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-white">
                        ${plan.price}
                      </span>
                      <span className="text-gray-400 ml-2">
                        /{billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}

                  {plan.notIncluded.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 opacity-50">
                      <X className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-500">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGetStarted(plan.name)}
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  }`}
                >
                  {plan.popular ? "Get Started Now" : "Get Started"}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{z:10}}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Everything you need to succeed
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-400">
                Optimized performance for seamless workflow management
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-400">
                Enterprise-grade security with 99.9% uptime guarantee
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                24/7 Support
              </h3>
              <p className="text-gray-400">
                Expert support whenever you need it
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{z:10}}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-400">
                Yes! All plans come with a 14-day free trial. No credit card
                required.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-400">
                We accept all major credit cards, PayPal, and bank transfers for
                enterprise plans.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
