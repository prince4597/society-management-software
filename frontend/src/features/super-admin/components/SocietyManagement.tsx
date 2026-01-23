'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Search, ChevronRight, MapPin, Users, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { systemService } from '../services/system.service';
import { OnboardSocietyForm } from './OnboardSocietyForm';
import type { Society } from '@/types';

export const SocietyManagement = () => {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboardForm, setShowOnboardForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSocieties = async () => {
    setIsLoading(true);
    try {
      const response = await systemService.getSocieties();
      if (response.success) {
        setSocieties(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch societies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSocieties();
  }, []);

  const filteredSocieties = societies.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">Society Management</h2>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Registry of all managed communities</p>
        </div>
        <Button 
          onClick={() => setShowOnboardForm(!showOnboardForm)}
          className="rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
        >
          {showOnboardForm ? 'View Registry' : (
            <>
              <Plus size={18} />
              Onboard New Society
            </>
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {showOnboardForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <OnboardSocietyForm onSuccess={() => {
              setShowOnboardForm(false);
              fetchSocieties();
            }} />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search societies by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-border/60 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-48 bg-card border border-border/40 rounded-2xl animate-pulse" />
                ))
              ) : filteredSocieties.length > 0 ? (
                filteredSocieties.map((society) => (
                  <motion.div
                    key={society.id}
                    whileHover={{ y: -5 }}
                    className="bg-card border border-border/60 rounded-2xl p-6 workspace-shadow group hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Building2 className="text-primary" size={24} />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground uppercase tracking-wider border border-border/50">
                        {society.code}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                      {society.name}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin size={14} className="shrink-0" />
                        <span className="truncate">{society.city}, {society.state}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users size={14} className="shrink-0" />
                        <span>{society.totalFlats || 0} Total Flats</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/40">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        <span className="text-[10px] font-bold uppercase text-success">Active</span>
                      </div>
                      <button className="text-primary p-2 hover:bg-primary/10 rounded-lg transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="inline-flex p-4 bg-secondary rounded-full mb-4">
                    <Activity size={32} className="text-muted-foreground opacity-20" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">No societies found</h3>
                  <p className="text-sm text-muted-foreground">Try broadening your search or onboard a new society.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
