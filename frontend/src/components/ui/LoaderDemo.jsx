import { useState } from 'react';
import BackendLoader from './BackendLoader';
import VideoLoader from './VideoLoader';

const LoaderDemo = () => {
  const [useVideoLoader, setUseVideoLoader] = useState(false);

  return (
    <div className="relative">
      {/* Toggle Button for Demo */}
      <div className="fixed top-4 right-4 z-[60] bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-lg p-2">
        <button
          onClick={() => setUseVideoLoader(!useVideoLoader)}
          className="px-3 py-1 text-xs bg-yellow-400 text-slate-900 rounded font-semibold hover:bg-yellow-500 transition-colors"
        >
          {useVideoLoader ? 'Use Card Loader' : 'Use Full Video Loader'}
        </button>
      </div>

      {/* Render Selected Loader */}
      {useVideoLoader ? <VideoLoader /> : <BackendLoader />}
    </div>
  );
};

export default LoaderDemo;
