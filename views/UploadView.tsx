
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UploadZone } from '../components/upload/UploadZone';
import { ProcessingState } from '../components/upload/ProcessingState';
import { ResultsState } from '../components/upload/ResultsState';

type UploadStep = 'IDLE' | 'PROCESSING' | 'COMPLETED';

export const UploadView: React.FC = () => {
  const [step, setStep] = useState<UploadStep>('IDLE');
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const startAnalysis = (file: File) => {
    setSelectedFile(file);
    setStep('PROCESSING');
    setProgress(0);
  };

  useEffect(() => {
    let interval: number;
    if (step === 'PROCESSING') {
      interval = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('COMPLETED'), 1000);
            return 100;
          }
          return prev + 1;
        });
      }, 300); // Simulated processing speed
    }
    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'IDLE' && (
          <motion.div 
            key="idle"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <UploadZone onStart={startAnalysis} />
          </motion.div>
        )}

        {step === 'PROCESSING' && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ProcessingState progress={progress} fileName={selectedFile?.name || 'video_recording.mp4'} />
          </motion.div>
        )}

        {step === 'COMPLETED' && (
          <motion.div 
            key="completed"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
          >
            <ResultsState />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
