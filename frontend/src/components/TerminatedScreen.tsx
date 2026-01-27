import React from 'react';
import { motion } from 'framer-motion';
import { UserX, Mail, Phone, Building2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TerminatedScreenProps {
  companyName?: string;
  onLogout: () => void;
}

export default function TerminatedScreen({ companyName, onLogout }: TerminatedScreenProps) {
  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl overflow-hidden">
          {/* Header accent */}
          <div className="h-2 bg-gradient-to-r from-rose-500 via-red-500 to-orange-500" />
          
          <CardContent className="p-8 md:p-10 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-red-100 flex items-center justify-center mb-6"
            >
              <UserX className="w-10 h-10 text-rose-500" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-slate-800 mb-3"
            >
              Account Access Restricted
            </motion.h1>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 mb-8"
            >
              <p className="text-slate-600 leading-relaxed">
                We regret to inform you that your employment with{' '}
                <span className="font-semibold text-slate-800">{companyName || 'the company'}</span>{' '}
                has been concluded, and your account access has been deactivated.
              </p>
              
              <p className="text-slate-500 text-sm leading-relaxed">
                We appreciate your contributions during your time with us and wish you all the best 
                in your future endeavors.
              </p>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-50 rounded-xl p-5 mb-6"
            >
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center justify-center gap-2">
                <Building2 className="w-4 h-4" />
                Need Assistance?
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                If you believe this is an error or have any questions regarding your employment status, 
                please reach out to the HR department:
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
                <a 
                  href="mailto:hr@company.com" 
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  Contact HR Department
                </a>
              </div>
            </motion.div>

            {/* Logout Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={onLogout}
                variant="outline"
                className="w-full sm:w-auto px-8 gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </motion.div>

            {/* Footer note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs text-slate-400 mt-6"
            >
              Thank you for being part of our team.
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
