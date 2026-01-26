'use client';

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export const PremiumSplash = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Animated Background Flow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 45, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -30, 0],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[100px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative mb-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-primary/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-x-[-15px] inset-y-[-15px] border-2 border-dashed border-primary/20 rounded-full"
          />
          <div className="relative w-24 h-24 bg-card/40 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/10 transition-colors">
            <ShieldCheck
              className="w-12 h-12 text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
              strokeWidth={1}
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center overflow-hidden">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl font-bold text-foreground tracking-tighter sm:text-3xl"
            >
              Society Management
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="text-xs uppercase tracking-[0.3em] font-medium text-muted-foreground mt-1"
            >
              Premium Security Protocol
            </motion.p>
          </div>

          <div className="relative flex items-center justify-center w-32 h-1 bg-secondary/30 rounded-full overflow-hidden mt-2">
            <motion.div
              animate={{
                left: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-0 bottom-0 w-1/3 bg-primary shadow-[0_0_10px_var(--primary)]"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
