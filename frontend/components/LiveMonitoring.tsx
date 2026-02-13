
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, Shield, Play, Square, Activity, Pause, Download, Video, Maximize2 } from 'lucide-react';
import { processProctorFrame } from '../../backend/proctoring';
import { ProctorAlert, DetectionStats } from '../../database/types';
import { ClayCard } from '../../components/ClayCard';
import { ClayButton } from '../../components/ClayButton';

interface LiveMonitoringProps {
  onNewAlert: (alert: ProctorAlert) => void;
  updateIntegrityScore: (score: number) => void;
  updateStats: (stats: Omit<DetectionStats, 'expectedCount'>) => void;
  streamUrl?: string;
  isExternalStream?: boolean;
  cameraSource?: 'direct' | 'ip';
  isConnected?: boolean;
}

export const LiveMonitoring: React.FC<LiveMonitoringProps> = ({ 
  onNewAlert, 
  updateIntegrityScore,
  updateStats,
  streamUrl,
  isExternalStream,
  cameraSource = 'direct',
  isConnected = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = '';
    }
    setConnectionError(null);
  }, [stream]);

  const startMonitoring = async () => {
    setConnectionError(null);
    console.log('=== Starting Monitoring ===');
    console.log('cameraSource:', cameraSource);
    console.log('streamUrl:', streamUrl);
    console.log('videoRef.current:', videoRef.current);
    
    if (!videoRef.current) {
      console.error('Video ref is null!');
      setConnectionError('Video element not ready');
      return;
    }
    
    if (cameraSource === 'ip' && streamUrl) {
      // IP Camera / DroidCam mode
      try {
        const videoEndpoints = [
          `${streamUrl}/video`,
          `${streamUrl}/mjpeg`,
          streamUrl,
        ];
        
        console.log('Setting IP camera source:', videoEndpoints[0]);
        videoRef.current.src = videoEndpoints[0];
        videoRef.current.crossOrigin = 'anonymous';
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('=== Video Metadata Loaded ===');
          console.log('Dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
          console.log('Ready state:', videoRef.current?.readyState);
          
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              console.log('=== Video Playing Successfully ===');
              setIsMonitoring(true);
            }).catch(err => {
              console.error('Video play failed:', err);
              setConnectionError('Failed to play video stream. Check if the camera app is running.');
              setIsMonitoring(false);
            });
          }
        };
        
        videoRef.current.onerror = (e) => {
          console.error('=== Video Error ===');
          console.error('Error event:', e);
          console.error('Video error code:', videoRef.current?.error?.code);
          console.error('Video error message:', videoRef.current?.error?.message);
          setConnectionError('Failed to connect to IP camera. Check the URL and ensure the camera app is running.');
          setIsMonitoring(false);
        };
        
        // Timeout fallback
        setTimeout(() => {
          if (!isMonitoring) {
            console.warn('Video did not load within 5 seconds, forcing play attempt');
            if (videoRef.current) {
              videoRef.current.play().catch(e => console.error('Forced play failed:', e));
              setIsMonitoring(true);
            }
          }
        }, 5000);
        
      } catch (err) {
        console.error('Error connecting to IP camera:', err);
        setConnectionError('Failed to connect to IP camera: ' + (err as Error).message);
      }
    } else {
      // Direct laptop camera mode
      try {
        console.log('=== Requesting Camera Access ===');
        const constraints = {
          video: { 
            width: { ideal: 1280 }, 
            height: { ideal: 720 }, 
            frameRate: { ideal: 15 }
          },
          audio: false
        };
        
        const userStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('=== Camera Stream Obtained ===');
        console.log('Stream tracks:', userStream.getTracks());
        
        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
          videoRef.current.playsInline = true;
          videoRef.current.muted = true;
          videoRef.current.autoplay = true;
          
          // Set explicit dimensions
          videoRef.current.width = 1280;
          videoRef.current.height = 720;
          
          console.log('Video srcObject set');
          console.log('Video element:', videoRef.current);
          console.log('Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
          
          // Force play immediately
          const playPromise = videoRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log('=== Video Playing ===');
              console.log('Video readyState:', videoRef.current?.readyState);
              console.log('Video dimensions after play:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
              setIsMonitoring(true);
              setStream(userStream);
            }).catch(err => {
              console.error('Play failed, trying again:', err);
              // Retry with delay
              setTimeout(() => {
                if (videoRef.current) {
                  videoRef.current.play().then(() => {
                    console.log('=== Video Playing on Retry ===');
                    setIsMonitoring(true);
                    setStream(userStream);
                  }).catch(e => {
                    console.error('Retry also failed:', e);
                    setConnectionError('Failed to start video playback: ' + (e as Error).message);
                  });
                }
              }, 100);
            });
          } else {
            console.log('Video play returned undefined, assuming playing');
            setIsMonitoring(true);
            setStream(userStream);
          }
        }
      } catch (err) {
        console.error('=== Camera Access Failed ===');
        console.error('Error:', err);
        setConnectionError('Please allow camera permissions to use live proctoring.');
        alert('Please allow camera permissions to use live proctoring.');
      }
    }
  };

  const stopMonitoring = () => {
    stopStream();
    setIsMonitoring(false);
    setIsPaused(false);
  };

  const captureAndAnalyze = useCallback(async () => {
    if (!isMonitoring || !videoRef.current || !canvasRef.current || isAnalyzing || isPaused) return;

    setIsAnalyzing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx && video.readyState >= 2) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

      try {
        const result = await processProctorFrame(base64Image);
        updateIntegrityScore(result.overallIntegrityScore);
        updateStats(result.stats);
        
        result.alerts.forEach(alertData => {
          onNewAlert({
            ...alertData,
            id: crypto.randomUUID(),
            timestamp: new Date(),
            screenshot: canvas.toDataURL('image/jpeg', 0.5)
          } as ProctorAlert);
        });
      } catch (err) {
        console.error('Analysis failed', err);
      }
    }
    setIsAnalyzing(false);
  }, [isMonitoring, isAnalyzing, isPaused, onNewAlert, updateIntegrityScore, updateStats]);

  useEffect(() => {
    let interval: number | undefined;
    if (isMonitoring && !isPaused) {
      interval = window.setInterval(captureAndAnalyze, 5000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring, isPaused, captureAndAnalyze]);

  // Auto-start monitoring when connected
  useEffect(() => {
    if (isConnected && !isMonitoring) {
      startMonitoring();
    }
  }, [isConnected]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="text-[#6C5CE7]" /> {cameraSource === 'ip' ? 'Remote Feed' : 'Direct Monitor'}
        </h2>
        <div className="flex gap-2">
          {!isMonitoring ? (
            <ClayButton onClick={startMonitoring} variant="primary" className="px-4 py-2">
              <Play size={18} /> Start Session
            </ClayButton>
          ) : (
            <ClayButton onClick={stopMonitoring} variant="danger" className="px-4 py-2">
              <Square size={18} /> Stop
            </ClayButton>
          )}
        </div>
      </div>

      <div className="relative group">
        <ClayCard className="relative overflow-hidden aspect-video bg-[#2D3436] flex items-center justify-center p-0 border-4 border-white shadow-xl">
          {!isMonitoring ? (
            <div className="text-center p-8">
              <div className="w-24 h-24 bg-[#F5F0EB]/10 rounded-full flex items-center justify-center mx-auto mb-6 clay-inset">
                <Camera size={48} className="text-[#636E72]" />
              </div>
              <p className="text-white/60 font-medium text-lg">
                {connectionError ? connectionError : 'Waiting for connection...'}
              </p>
              {connectionError && (
                <p className="text-[#FF6B6B] text-sm mt-2">{connectionError}</p>
              )}
              <div className="mt-4 w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                <div className="w-1/3 h-full bg-[#6C5CE7] animate-[shimmer_1.5s_infinite]" />
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full bg-black">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                controls={false}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  backgroundColor: '#000'
                }}
                className={`transition-opacity duration-500 ${isPaused ? 'opacity-40 grayscale' : 'opacity-100'}`}
                onLoadedData={() => {
                  console.log('Video loaded data, readyState:', videoRef.current?.readyState);
                  console.log('Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
                }}
                onCanPlay={() => console.log('Video can play')}
                onPlaying={() => console.log('Video is playing')}
                onError={(e) => {
                  console.error('Video error event:', e);
                  console.error('Video error details:', videoRef.current?.error);
                  setConnectionError('Video playback error - check camera connection');
                }}
              />
              {/* Debug overlay */}
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded">
                Video: {videoRef.current?.readyState ? 'Ready' : 'Loading...'} | 
                Dim: {videoRef.current?.videoWidth || 0}x{videoRef.current?.videoHeight || 0}
              </div>
              {!isPaused && isAnalyzing && (
                <div className="absolute inset-0 pointer-events-none">
                   <div className="absolute top-[20%] left-[30%] w-[15%] h-[40%] border-2 border-[#00B894] rounded-lg shadow-[0_0_15px_rgba(0,184,148,0.5)]">
                      <span className="absolute -top-6 left-0 bg-[#00B894] text-white text-[10px] px-2 py-0.5 rounded font-bold">STUDENT (AI Check)</span>
                   </div>
                </div>
              )}
            </div>
          )}
        </ClayCard>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
