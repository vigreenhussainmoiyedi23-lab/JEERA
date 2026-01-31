import { motion } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useBackendHealth } from '../../hooks/useBackendHealth';

const VideoLoader = () => {
  const { isBackendLive, isLoading, error, retryCount, retry } = useBackendHealth();

  // Don't show loader if backend is live
  if (isBackendLive) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black">
      {/* Main Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/loader_untill_backend_is_live.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-lg mx-4"
      >
        {/* Status Icon */}
        <motion.div
          animate={{
            scale: isLoading ? [1, 1.1, 1] : 1,
            opacity: isLoading ? [0.8, 1, 0.8] : 1
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          {isLoading ? (
            <div className="w-24 h-24 mx-auto rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          ) : (
            <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 backdrop-blur-md border-2 border-red-400/50 flex items-center justify-center">
              <WifiOff className="w-12 h-12 text-red-400" />
            </div>
          )}
        </motion.div>

        {/* Status Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl">
            {isLoading ? 'Connecting...' : 'Connection Lost'}
          </h1>
          
          <p className="text-lg text-white/90 drop-shadow-lg max-w-md mx-auto">
            {isLoading 
              ? 'Establishing secure connection to JEERA servers'
              : error || 'Unable to connect to backend services'
            }
          </p>

          {/* Retry Count */}
          {retryCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block"
            >
              <span className="text-yellow-400 font-semibold bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                Attempt {retryCount}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center space-x-2 mt-6 text-white/80"
        >
          {isBackendLive ? (
            <>
              <Wifi className="w-5 h-5 text-green-400" />
              <span className="text-green-400">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-red-400" />
              <span className="text-red-400">Disconnected</span>
            </>
          )}
        </motion.div>

        {/* Manual Retry Button */}
        {!isLoading && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={retry}
            className="mt-8 flex items-center space-x-2 px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-2xl hover:shadow-white/25 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Retry Connection</span>
          </motion.button>
        )}

        {/* Progress Indicator */}
        {isLoading && (
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-yellow-400 via-white to-yellow-400"
          />
        )}
      </motion.div>

      {/* Floating Particles Effect */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          animate={{
            x: [0, 200, -200, 0],
            y: [0, -150, 150, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 1,
            ease: "easeInOut"
          }}
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + i * 8}%`
          }}
        />
      ))}
    </div>
  );
};

export default VideoLoader;
