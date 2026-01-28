'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { FlatCard } from '@/features/properties/components/FlatCard';
import { BuildingView } from '@/features/properties/components/BuildingView';
import { FlatMappingDrawer } from '@/features/properties/components/FlatMappingDrawer';
import { AddUnitModal } from '@/features/properties/components/AddUnitModal';
import { Flat, ResidentRole } from '@/features/properties/types';
import { Plus, Building2, Search, Filter, LayoutGrid, Layers, Loader2 } from 'lucide-react';
import { Button, Badge, Pagination } from '@/components/ui';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type ViewMode = 'grid' | 'building';
import { useProperties } from '@/features/properties/hooks/useProperties';

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('building');
  const [selectedBlock, setSelectedBlock] = useState('A');
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    properties: flats, 
    meta,
    params,
    setParams,
    isLoading: loadingFlats, 
    refresh: refreshFlats 
  } = useProperties({ 
    page: 1, 
    limit: 1000, // Show all units for the block
    block: selectedBlock,
    search: searchQuery
  });

  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync params when block or viewMode changes
  useEffect(() => {
    setParams(prev => ({
      ...prev,
      page: 1,
      limit: 1000,
      block: selectedBlock,
      search: searchQuery
    }));
  }, [selectedBlock, searchQuery, setParams]);

  const loading = loadingFlats;

  const fetchData = useCallback(async () => {
    refreshFlats();
  }, [refreshFlats]);

  // Blocks present in data - We might need a separate call for this or use a fixed list
  // For now, assume A, B, C etc. as a fallback or get from first successful fetch
  const [availableBlocks, setAvailableBlocks] = useState<string[]>(['A']);
  
  useEffect(() => {
    if (flats.length > 0) {
      const detectedBlocks = Array.from(new Set(flats.map((f) => f.block))).sort();
      if (detectedBlocks.length > 0) {
        setAvailableBlocks(prev => {
          const combined = Array.from(new Set([...prev, ...detectedBlocks])).sort();
          return combined;
        });
      }
    }
  }, [flats]);

  const blocks = availableBlocks;

  // Since we fetch by block now, we don't need to filter by block client-side
  const filteredFlats = flats;

  const groupedFlats = useMemo(() => {
    return filteredFlats.reduce((acc, flat) => {
      const floor = flat.floor;
      if (!acc[floor]) acc[floor] = [];
      acc[floor].push(flat);
      return acc;
    }, {} as Record<number, Flat[]>);
  }, [filteredFlats]);

  const floors = useMemo(
    () => Object.keys(groupedFlats).map(Number).sort((a, b) => b - a),
    [groupedFlats]
  );

  const getOwner = (flat: Flat) => {
    return flat.residents?.find((r) => r.role === ResidentRole.PRIMARY_OWNER);
  };

  const getTenant = (flat: Flat) => {
    return flat.residents?.find((r) => r.role === ResidentRole.TENANT);
  };

  const handleFlatClick = (flat: Flat) => {
    setSelectedFlat(flat);
    setIsDrawerOpen(true);
  };

  if (loading && flats.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-12">
      {/* ERP Native Header Pattern */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-card p-10 rounded-2xl border border-border shadow-sm overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge
                variant="neutral"
                className="bg-secondary/80 text-muted-foreground border-border/50 font-bold uppercase tracking-[0.2em] text-[9px] px-2 h-5"
              >
                Inventory Hub
              </Badge>
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight leading-tight">
              Property <span className="text-primary italic font-serif">Mapping</span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-2 max-w-md">
              Visual intelligence dashboard for society unit allocation across all sectors.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest lg:text-right mr-2">Visual Engine</p>
            <div className="flex p-1.5 bg-secondary/50 rounded-2xl border border-border/40 backdrop-blur-md shadow-sm">
              <button
                onClick={() => setViewMode('building')}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  viewMode === 'building' ? "bg-card text-primary shadow-md" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Layers size={14} /> Building
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  viewMode === 'grid' ? "bg-card text-primary shadow-md" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid size={14} /> Grid Layout
              </button>
            </div>
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-2xl font-black gap-3 shadow-xl shadow-primary/20 h-14 px-8 text-xs uppercase tracking-widest bg-primary hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={20} />
            Register Unit
          </Button>
        </div>
      </motion.div>

      {/* Infinite Block Switcher & Controls Bar */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3 px-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Asset Sectors</h4>
            <p className="text-[9px] font-bold text-primary/60 uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
              {blocks.length} Blocks Online
            </p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar custom-scrollbar snap-x">
            {blocks.map(block => (
              <motion.button
                key={block}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedBlock(block)}
                className={cn(
                  "relative flex flex-col items-center justify-center min-w-[110px] h-[80px] rounded-xl transition-all snap-start border border-border shadow-sm",
                  selectedBlock === block
                    ? "bg-card border-primary ring-2 ring-primary/5 text-primary scale-105 z-10"
                    : "bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary/20"
                )}
              >
                <Building2 size={24} className={cn("mb-2 opacity-40", selectedBlock === block && "opacity-100")} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Block {block}</span>

                {selectedBlock === block && (
                  <motion.div
                    layoutId="activeBlockLine"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-b-xl"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="xl:w-[400px] flex flex-col gap-4">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-3 px-2">Registry Search</h4>
          <div className="bg-card border border-border p-3 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-colors" size={16} />
              <input
                type="text"
                placeholder="Filter Units..."
                className="w-full bg-secondary/30 border border-transparent focus:border-primary/20 rounded-xl py-2 pl-11 pr-4 text-xs focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-10 h-10 p-0 rounded-xl border-border/60 shrink-0">
              <Filter size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative min-h-[600px]">
        <AnimatePresence mode="wait">
          {viewMode === 'building' ? (
            <motion.div
              key={`building-${selectedBlock}`}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <BuildingView
                blockName={selectedBlock}
                flats={filteredFlats}
                onFlatClick={handleFlatClick}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${selectedBlock}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-12"
            >
              {floors.map(floor => (
                <div key={floor} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground/40 font-black text-xs">L{floor}</div>
                    <span className="text-xl font-black text-foreground tracking-tighter">Level {floor} Registry</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-border/80 to-transparent" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {groupedFlats[floor].map(flat => (
                      <FlatCard
                        key={flat.id}
                        flat={flat}
                        owner={getOwner(flat)}
                        tenant={getTenant(flat)}
                        onClick={() => handleFlatClick(flat)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Registry Status Footer */}
      <div className="flex justify-between items-center bg-card border border-border/60 p-6 rounded-[2rem] shadow-sm">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          Showing <span className="text-foreground">{flats.length}</span> Total Units in Block {selectedBlock}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Live Inventory
        </div>
      </div>

      {/* Detailed Mapping Drawer */}
      <FlatMappingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        flat={selectedFlat}
      />

      <AddUnitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
