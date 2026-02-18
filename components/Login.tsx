import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, User } from 'lucide-react';

type UserRole = 'admin' | 'invigilator' | null;

interface AuthUser {
  username: string;
  role: UserRole;
}

interface LoginProps {
  onLogin: (user: AuthUser) => void;
}

const VALID_USERS = {
  admin: { username: 'admin', password: '123', role: 'admin' as const },
  invigilator: { username: 'invisi', password: '1234', role: 'invigilator' as const }
};

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for better UX
    setTimeout(() => {
      const user = Object.values(VALID_USERS).find(
        u => u.username === username && u.password === password
      );

      if (user) {
        onLogin({ username: user.username, role: user.role });
      } else {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#6C5CE7] shadow-lg mb-4"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-[#2D3436] mb-2">ExamShield AI</h1>
          <p className="text-[#636E72]">Proctoring System</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-[#6C5CE7]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#2D3436]">Welcome Back</h2>
              <p className="text-sm text-[#636E72]">Sign in to continue</p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2D3436] mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636E72]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E8E2DC] focus:outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 transition-all"
                  placeholder="Enter username"
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2D3436] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636E72]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E8E2DC] focus:outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 transition-all"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full py-3 px-4 bg-[#6C5CE7] hover:bg-[#5b4dd1] disabled:bg-[#6C5CE7]/50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-[#E8E2DC]">
            <p className="text-xs text-[#636E72] text-center mb-3">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#F5F0EB] rounded-lg">
                <span className="font-semibold text-[#6C5CE7]">Admin</span>
                <p className="text-[#636E72] mt-1">admin / 123</p>
              </div>
              <div className="p-3 bg-[#F5F0EB] rounded-lg">
                <span className="font-semibold text-[#FF6B6B]">Invigilator</span>
                <p className="text-[#636E72] mt-1">invisi / 1234</p>
              </div>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-sm text-[#636E72] mt-6">
          © 2024 ExamShield AI. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};
