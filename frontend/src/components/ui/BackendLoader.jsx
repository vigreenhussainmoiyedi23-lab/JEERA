import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useBackendHealth } from '../../hooks/useBackendHealth';

const BackendLoader = () => {
  const { isBackendLive, isLoading, error, retryCount, retry } = useBackendHealth();

  // Don't show loader if backend is live
  if (isBackendLive) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      >
        <source src="/loader_untill_backend_is_live.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-900/90 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl relative z-10"
      >
        {/* Loading Animation */}
        <div className="flex flex-col items-center space-y-6">
          {/* Status Icon */}
          <motion.div
            animate={{
              rotate: isLoading ? 360 : 0,
              scale: isLoading ? [1, 1.1, 1] : 1
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative"
          >
            {isLoading ? (
              <div className="w-20 h-20 rounded-full border-4 border-yellow-400/30 border-t-yellow-400 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-yellow-400/20 border-t-yellow-400 animate-spin" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-red-500/30 backdrop-blur-sm flex items-center justify-center border-2 border-red-400/50">
                <WifiOff className="w-10 h-10 text-red-400" />
              </div>
            )}
          </motion.div>

          {/* Status Text */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              {isLoading ? 'Connecting to Backend...' : 'Backend Unavailable'}
            </h2>
            
            <p className="text-gray-200 text-sm drop-shadow-md bg-slate-900/50 px-4 py-2 rounded-lg backdrop-blur-sm">
              {isLoading 
                ? 'Please wait while we establish connection to JEERA servers'
                : error || 'Unable to connect to backend services'
              }
            </p>

            {/* Retry Count */}
            {retryCount > 0 && (
              <p className="text-yellow-400 text-sm font-semibold drop-shadow-md">
                Retry attempts: {retryCount}
              </p>
            )}
          </div>

          {/* Connection Status */}
          <div className="flex items-center space-x-2 text-sm">
            {isBackendLive ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-red-400">Disconnected</span>
              </>
            )}
          </div>

          {/* Manual Retry Button */}
          {!isLoading && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={retry}
              className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-yellow-400 to-amber-500 text-slate-900 rounded-xl font-semibold hover:from-yellow-500 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-yellow-500/25"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Connection</span>
            </motion.button>
          )}

          {/* Progress Bar */}
          {isLoading && (
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-yellow-400 to-amber-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          )}

          {/* Help Text */}
          <div className="text-center space-y-1">
            <p className="text-gray-500 text-xs">
              This usually takes a few seconds...
            </p>
            <p className="text-gray-600 text-xs">
              If the problem persists, please check your internet connection
            </p>
          </div>
        </div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute inset-0 bg-linear-to-br from-yellow-400/10 via-transparent to-amber-500/10 rounded-2xl" />
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${10 + i * 10}%`
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BackendLoader;
