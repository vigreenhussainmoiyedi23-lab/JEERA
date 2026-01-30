import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Lock, Check, ArrowLeft, Shield, Zap } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, billingCycle } = location.state || { plan: 'Professional', billingCycle: 'monthly' };

  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    country: '',
    zipCode: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const planPrices = {
    Starter: { monthly: 9, yearly: 90 },
    Professional: { monthly: 29, yearly: 290 },
    Enterprise: { monthly: 99, yearly: 990 }
  };

  const price = planPrices[plan][billingCycle];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.cvv) newErrors.cvv = 'CVV is required';
    if (!formData.cardholderName) newErrors.cardholderName = 'Cardholder name is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/payment-success', { 
        state: { 
          plan, 
          price, 
          billingCycle,
          email: formData.email 
        } 
      });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Pricing
        </motion.button>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="bg-slate-700/50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{plan} Plan</h3>
                    <p className="text-gray-400 capitalize">{billingCycle} billing</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">${price}</div>
                    <div className="text-sm text-gray-400">
                      per {billingCycle === 'monthly' ? 'month' : 'year'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Instant access to all {plan.toLowerCase()} features</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>14-day money-back guarantee</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${price}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white">$0</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold text-white">
                  <span>Total</span>
                  <span>${price}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="flex items-center gap-2 text-green-400">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Secure Payment</span>
                </div>
                <p className="text-green-300 text-sm mt-1">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Payment Details</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-700 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.email ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Card Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Card Information
                  </label>
                  <div className="bg-slate-700 border border-white/20 rounded-xl p-4">
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        handleInputChange({ target: { name: 'cardNumber', value: formatted } });
                      }}
                      className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none mb-4"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    {errors.cardNumber && (
                      <p className="text-red-400 text-sm mb-2">{errors.cardNumber}</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value);
                          handleInputChange({ target: { name: 'expiryDate', value: formatted } });
                        }}
                        className="bg-transparent text-white placeholder-gray-500 focus:outline-none"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="bg-transparent text-white placeholder-gray-500 focus:outline-none"
                        placeholder="CVV"
                        maxLength={4}
                      />
                    </div>
                    {(errors.expiryDate || errors.cvv) && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.expiryDate || errors.cvv}
                      </p>
                    )}
                  </div>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-700 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.cardholderName ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.cardholderName && (
                    <p className="text-red-400 text-sm mt-1">{errors.cardholderName}</p>
                  )}
                </div>

                {/* Billing Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Billing Address
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full bg-slate-700 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.country ? 'border-red-500' : 'border-white/20'
                        }`}
                        placeholder="Country"
                      />
                      {errors.country && (
                        <p className="text-red-400 text-sm mt-1">{errors.country}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={`w-full bg-slate-700 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.zipCode ? 'border-red-500' : 'border-white/20'
                        }`}
                        placeholder="ZIP Code"
                      />
                      {errors.zipCode && (
                        <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isProcessing}
                  whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Pay ${price}
                    </>
                  )}
                </motion.button>

                <p className="text-center text-gray-400 text-sm">
                  By completing this purchase you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
