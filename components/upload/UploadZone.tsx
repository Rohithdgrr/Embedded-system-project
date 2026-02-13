
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileVideo, X } from 'lucide-react';
import { ClayCard } from '../ClayCard';
import { ClayButton } from '../ClayButton';

interface UploadZoneProps {
  onStart: (file: File, examName: string, studentCount: number) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onStart }) => {
  const [file, setFile] = useState<File | null>(null);
  const [examName, setExamName] = useState('');
  const [studentCount, setStudentCount] = useState(35);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-[#2D3436]">Upload Examination Video</h2>
        <p className="text-[#636E72]">Process recorded footage for deep behavioral and object analysis</p>
      </div>

      <ClayCard className="p-0 overflow-hidden bg-white">
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`p-12 border-4 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center space-y-6 ${
            isDragging ? 'border-[#6C5CE7] bg-[#6C5CE7]/5 scale-[1.01]' : 'border-[#E8E2DC] bg-transparent'
          }`}
          style={{ borderRadius: '24px' }}
        >
          {file ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
              <div className="w-20 h-20 bg-[#00B894]/10 rounded-full flex items-center justify-center mb-4 clay-inset">
                <FileVideo size={32} className="text-[#00B894]" />
              </div>
              <h3 className="font-bold text-lg mb-1">{file.name}</h3>
              <p className="text-xs text-[#636E72] mb-4">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis</p>
              <button onClick={() => setFile(null)} className="text-[#FF6B6B] text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:underline">
                <X size={14} /> Remove File
              </button>
            </motion.div>
          ) : (
            <>
              <div className="w-24 h-24 bg-[#6C5CE7]/10 rounded-full flex items-center justify-center clay-inset">
                <UploadCloud size={48} className="text-[#6C5CE7]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Drag and drop your exam recording</h3>
                <p className="text-[#636E72]">Supported: MP4, AVI, MOV, MKV, WEBM (Max 2GB)</p>
              </div>
              <div className="flex gap-4">
                <label className="clay-button px-6 py-3 font-semibold flex items-center justify-center gap-2 bg-[#6C5CE7] text-white cursor-pointer hover:scale-105 transition-transform active:scale-95">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="video/*" 
                    onChange={(e) => e.target.files && setFile(e.target.files[0])} 
                  />
                  Browse Files
                </label>
              </div>
            </>
          )}
        </div>

        <div className="p-8 border-t border-[#E8E2DC] bg-[#F5F0EB]/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#636E72] uppercase tracking-widest ml-1">Exam Name</label>
              <input 
                type="text" 
                placeholder="e.g., Final Year Mathematics - Hall A"
                className="w-full clay-inset px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 transition-all text-sm font-medium"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#636E72] uppercase tracking-widest ml-1">Expected Students</label>
              <input 
                type="number" 
                className="w-full clay-inset px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 transition-all text-sm font-medium"
                value={studentCount}
                onChange={(e) => setStudentCount(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <ClayButton 
            variant="primary" 
            className="w-full h-14 text-lg" 
            disabled={!file}
            onClick={() => file && onStart(file, examName, studentCount)}
          >
            🚀 Start Analysis
          </ClayButton>
        </div>
      </ClayCard>
    </div>
  );
};
