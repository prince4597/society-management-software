import { useState } from 'react';
import Link from 'next/link';
import { Building2, Plus, Search, MapPin, Users, Activity, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Pagination,
  TableLoading,
  TableEmpty,
} from '@/components/ui';
import { useSocieties } from '../hooks/useSocieties';
import { OnboardSocietyForm } from './OnboardSocietyForm';
import { cn } from '@/lib/utils';

export const SocietyManagement = () => {
  const [showOnboardForm, setShowOnboardForm] = useState(false);
  const {
    societies: pagedSocieties,
    totalCount,
    isLoading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    refresh,
  } = useSocieties({ itemsPerPage: 8 });

  const itemsPerPage = 8;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">Society Management</h2>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">
            Institutional Registry of managed communities
          </p>
        </div>
        <Button
          onClick={() => setShowOnboardForm(!showOnboardForm)}
          className="rounded-xl font-bold gap-2 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          {showOnboardForm ? (
            'View Registry'
          ) : (
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
            <OnboardSocietyForm
              onSuccess={() => {
                setShowOnboardForm(false);
                refresh();
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Filter by name, code, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card/40 backdrop-blur-md border border-border/40 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="relative">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[60px]">#</TableHead>
                    <TableHead>Society Details</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-center">Capacity</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableLoading columns={6} />
                  ) : pagedSocieties.length > 0 ? (
                    pagedSocieties.map((society, index) => (
                      <TableRow key={society.id} className="group">
                        <TableCell>
                          <span className="text-[10px] font-black text-muted-foreground/40">
                            {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-primary border border-border/40">
                              <Building2 size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                                {society.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                                {society.email || 'No email'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <MapPin size={12} className="text-primary/60" />
                            {society.city}, {society.state}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/40 text-[10px] font-bold text-foreground">
                            <Users size={12} className="text-primary/60" />
                            {society.totalFlats || 0} Flats
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <div
                              className={cn(
                                'w-1.5 h-1.5 rounded-full',
                                society.isActive ? 'bg-success animate-pulse' : 'bg-destructive'
                              )}
                            />
                            <span
                              className={cn(
                                'text-[10px] font-black uppercase tracking-widest',
                                society.isActive ? 'text-success' : 'text-destructive'
                              )}
                            >
                              {society.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/super-admin/societies/${society.id}`}>
                            <button className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-all active:scale-90">
                              <ExternalLink size={16} />
                            </button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableEmpty columns={6} message="Registry Empty" icon={Activity} />
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="pt-6 border-t border-border/40 flex items-center justify-between">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Showing {pagedSocieties.length} of {totalCount} Societies
                  </p>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
