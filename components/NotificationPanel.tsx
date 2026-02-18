import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Send, Mail, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { ClayCard } from './ClayCard';
import { ClayButton } from './ClayButton';
import { sendNotification, sendViolationAlert } from '../services/notificationService';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  violationType?: string;
  seat?: string;
  confidence?: number;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  violationType,
  seat,
  confidence
}) => {
  const [emails, setEmails] = useState<string[]>(['']);
  const [subject, setSubject] = useState(
    violationType ? `🚨 Violation Alert: ${violationType}` : ''
  );
  const [message, setMessage] = useState(
    violationType && seat
      ? `Violation detected at Seat ${seat}. ${violationType} has been identified with ${((confidence || 0) * 100).toFixed(0)}% confidence. Please review immediately.`
      : ''
  );
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSend = async () => {
    const validEmails = emails.filter(e => e.trim() && e.includes('@'));
    
    if (validEmails.length === 0) {
      setSendStatus({ success: false, message: 'Please enter at least one valid email address' });
      return;
    }

    if (!subject.trim() || !message.trim()) {
      setSendStatus({ success: false, message: 'Please fill in subject and message' });
      return;
    }

    setIsSending(true);
    setSendStatus(null);

    const result = await sendNotification({
      to: validEmails,
      subject: subject.trim(),
      message: message.trim(),
      violationType,
      seat,
      timestamp: new Date().toLocaleString()
    });

    setIsSending(false);

    if (result.success) {
      setSendStatus({ success: true, message: 'Notification sent successfully!' });
      setTimeout(() => {
        onClose();
        setEmails(['']);
        setSubject('');
        setMessage('');
        setSendStatus(null);
      }, 2000);
    } else {
      setSendStatus({ success: false, message: result.error || 'Failed to send notification' });
    }
  };

  const handleQuickSend = async () => {
    const validEmails = emails.filter(e => e.trim() && e.includes('@'));
    
    if (validEmails.length === 0) {
      setSendStatus({ success: false, message: 'Please enter at least one email' });
      return;
    }

    if (!violationType || !seat) {
      setSendStatus({ success: false, message: 'No violation data available' });
      return;
    }

    setIsSending(true);
    setSendStatus(null);

    const result = await sendViolationAlert(validEmails, violationType, seat, confidence || 0);

    setIsSending(false);

    if (result.success) {
      setSendStatus({ success: true, message: 'Violation alert sent!' });
      setTimeout(() => {
        onClose();
        setSendStatus(null);
      }, 2000);
    } else {
      setSendStatus({ success: false, message: result.error || 'Failed to send' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-lg"
            onClick={e => e.stopPropagation()}
          >
            <ClayCard className="bg-white">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#6C5CE7] rounded-xl flex items-center justify-center">
                    <Bell size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#2D3436]">Send Notification</h3>
                    <p className="text-xs text-[#636E72]">Alert other invigilators</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#F5F0EB] rounded-lg transition-colors"
                >
                  <X size={20} className="text-[#636E72]" />
                </button>
              </div>

              {/* Violation Info Banner */}
              {violationType && (
                <div className="mb-4 p-3 bg-[#FFE5E5] border-l-4 border-[#FF6B6B] rounded-r-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={16} className="text-[#FF6B6B]" />
                    <span className="font-bold text-sm text-[#2D3436]">{violationType}</span>
                  </div>
                  {seat && (
                    <p className="text-xs text-[#636E72]">
                      Seat {seat} • {confidence ? `${(confidence * 100).toFixed(0)}% confidence` : ''}
                    </p>
                  )}
                </div>
              )}

              {/* Email Inputs */}
              <div className="mb-4">
                <label className="text-xs font-bold text-[#636E72] uppercase tracking-wider mb-2 block">
                  Invigilator Emails
                </label>
                {emails.map((email, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <div className="flex-1 relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#636E72]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailChange(index, e.target.value)}
                        placeholder="invigilator@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F5F0EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                      />
                    </div>
                    {emails.length > 1 && (
                      <button
                        onClick={() => handleRemoveEmail(index)}
                        className="p-2.5 text-[#FF6B6B] hover:bg-[#FFE5E5] rounded-xl transition-colors"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddEmail}
                  className="text-sm text-[#6C5CE7] font-medium hover:underline"
                >
                  + Add another email
                </button>
              </div>

              {/* Subject */}
              <div className="mb-4">
                <label className="text-xs font-bold text-[#636E72] uppercase tracking-wider mb-2 block">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter notification subject..."
                  className="w-full px-4 py-2.5 bg-[#F5F0EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                />
              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="text-xs font-bold text-[#636E72] uppercase tracking-wider mb-2 block">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#F5F0EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] resize-none"
                />
              </div>

              {/* Status Message */}
              <AnimatePresence>
                {sendStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mb-4 p-3 rounded-xl flex items-center gap-2 ${
                      sendStatus.success 
                        ? 'bg-[#00B894]/10 text-[#00B894]' 
                        : 'bg-[#FF6B6B]/10 text-[#FF6B6B]'
                    }`}
                  >
                    {sendStatus.success ? <Check size={18} /> : <AlertTriangle size={18} />}
                    <span className="text-sm font-medium">{sendStatus.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <ClayButton
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1 py-3"
                >
                  Cancel
                </ClayButton>
                
                {violationType && (
                  <ClayButton
                    variant="primary"
                    onClick={handleQuickSend}
                    disabled={isSending}
                    className="flex-1 py-3 bg-[#FF6B6B] hover:bg-[#FF5252]"
                  >
                    {isSending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <AlertTriangle size={18} className="mr-2" />
                        Quick Alert
                      </>
                    )}
                  </ClayButton>
                )}
                
                <ClayButton
                  variant="primary"
                  onClick={handleSend}
                  disabled={isSending}
                  className="flex-1 py-3"
                >
                  {isSending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Send
                    </>
                  )}
                </ClayButton>
              </div>
            </ClayCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
