import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Home, Download, ArrowRight } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, price, billingCycle, email } = location.state || {};

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleDownloadInvoice = () => {
    // Simulate invoice download
    const invoiceData = {
      plan,
      price,
      billingCycle,
      email,
      date: new Date().toLocaleDateString(),
      invoiceNumber: `INV-${Date.now()}`
    };
    
    const blob = new Blob([JSON.stringify(invoiceData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceData.invoiceNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-white/10 p-12 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Payment Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-300 mb-8"
          >
            Thank you for upgrading to {plan}
          </motion.p>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-slate-700/50 rounded-2xl p-6 mb-8 text-left"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Order Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Plan</span>
                <span className="text-white font-medium">{plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Billing Cycle</span>
                <span className="text-white font-medium capitalize">{billingCycle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount Paid</span>
                <span className="text-white font-medium">${price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email</span>
                <span className="text-white font-medium">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date</span>
                <span className="text-white font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoToDashboard}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadInvoice}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Invoice
            </motion.button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"
          >
            <p className="text-blue-300 text-sm">
              A confirmation email has been sent to {email}. You can start using all {plan.toLowerCase()} features immediately!
            </p>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 text-left"
          >
            <h4 className="text-lg font-semibold text-white mb-4">What's Next?</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <span className="text-gray-300">Explore your new {plan} features in the dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <span className="text-gray-300">Invite team members to collaborate on projects</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <span className="text-gray-300">Set up your workspace and start creating</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
