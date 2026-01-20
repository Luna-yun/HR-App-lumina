import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await authAPI.verifyEmail(token);
      setStatus('success');
      setMessage(response.data.message);
      toast.success('Email verified successfully!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.detail || 'Verification failed');
      toast.error('Verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-background/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border/50 p-8 text-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 justify-center mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-lg font-display">L</span>
            </div>
            <span className="text-xl font-display font-bold text-foreground">LuminaHR</span>
          </Link>

          {/* Status Icon */}
          <div className="mb-6 flex justify-center">
            {status === 'loading' && (
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center"
              >
                <XCircle className="w-10 h-10 text-red-600" />
              </motion.div>
            )}
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold mb-3">
            {status === 'loading' && 'Verifying your email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h1>
          <p className="text-muted-foreground mb-8">{message}</p>

          {/* Action Button */}
          {status === 'success' && (
            <Button
              onClick={() => navigate('/login')}
              className="w-full h-12 group"
              size="lg"
            >
              Continue to Login
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
          {status === 'error' && (
            <Button
              onClick={() => navigate('/signup')}
              variant="outline"
              className="w-full h-12"
              size="lg"
            >
              Try Again
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
