'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Phone } from 'lucide-react';
import { ProfileForm } from '@/features/profile';
import { useAuth } from '@/providers/AuthProvider';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 pb-24">
      <header className="space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Account Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your administrative profile and contact information</p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Profile Overview Card */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4"
        >
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 space-y-8 sticky top-28">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary border border-primary/20 shadow-inner">
                {user?.firstName?.[0]}
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-foreground">{user?.firstName} {user?.lastName}</h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-[10px] font-bold text-muted-foreground uppercase tracking-wider border border-border/50">
                  <ShieldCheck size={12} className="text-primary" />
                  {user?.role?.replace('_', ' ')}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-secondary/30 border border-border/30 space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</p>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Mail size={14} className="text-muted-foreground/60" />
                  <span className="truncate">{user?.email}</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/30 border border-border/30 space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Phone Number</p>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Phone size={14} className="text-muted-foreground/60" />
                  <span>{user?.phoneNumber || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Edit Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8"
        >
          <div className="bg-card border border-border/50 rounded-3xl p-8 md:p-10">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
              <p className="text-sm text-muted-foreground">Update your name and verified contact details</p>
            </div>
            <ProfileForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
