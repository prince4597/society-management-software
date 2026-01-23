'use client';

import { motion } from 'framer-motion';
import { 
  GlobalMetrics, 
  SystemHealthCard, 
  AuditTrail, 
  QuickConfig
} from '@/features/super-admin';

/**
 * SuperAdminPage
 * The root controller for the global administrative interface.
 * Orchestrates modular components for infrastructure and system-wide monitoring.
 */
export default function SuperAdminPage() {
  return (
    <div className="space-y-10 pb-10">
      
      {/* Infrastructure Health - Highest Priority */}
      <section aria-label="System Infrastructure">
        <SystemHealthCard />
      </section>

      {/* Global Business Metrics */}
      <section aria-label="Global Metrics">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-foreground tracking-tight">System Performance</h2>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Cross-cluster business indicators</p>
        </div>
        <GlobalMetrics />
      </section>

      {/* Live Monitoring & Config Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Detailed Audit Trail */}
        <section className="lg:col-span-2" aria-label="System Activity">
          <AuditTrail />
        </section>

        {/* Rapid Configuration Controls */}
        <section aria-label="Quick Actions">
          <QuickConfig />
        </section>
        
      </div>

      {/* Visual Footer Polish */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="pt-10 border-t border-border/40 text-center"
      >
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em] font-bold">
          Lead Engineering Management System • Optimized for Production Stability
        </p>
      </motion.div>
    </div>
  );
}
