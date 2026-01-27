'use client';

import { Flat, OccupancyStatus, MaintenanceStatus, ResidentReference } from '../types';
import { Card, Badge } from '@/components/ui';
import { User, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlatCardProps {
  flat: Flat;
  owner?: ResidentReference;
  tenant?: ResidentReference;
  onClick?: () => void;
}

export const FlatCard = ({ flat, owner, tenant, onClick }: FlatCardProps) => {
  const isRented = flat.occupancyStatus === OccupancyStatus.RENTED;
  const resident = isRented ? (tenant || owner) : owner;
  const isOccupied = !!resident;

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer overflow-hidden border border-border/60 hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-card rounded-3xl flex flex-col"
    >
      {/* Visual Status Indicator Line */}
      <div className={cn(
        "h-1.5 w-full",
        flat.maintenanceStatus === MaintenanceStatus.PAID ? "bg-success" :
          flat.maintenanceStatus === MaintenanceStatus.DUE ? "bg-warning" : "bg-danger"
      )} />

      <div className="p-6 flex flex-col flex-1">
        {/* Header: Vertical Hierarchy Stack */}
        <div className="flex flex-col gap-4 mb-6">
          <h3 className="text-4xl font-black text-foreground tracking-tighter leading-none group-hover:text-primary transition-colors">
            Flat {flat.number}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={
                flat.occupancyStatus === OccupancyStatus.OWNER_OCCUPIED ? 'success' :
                  flat.occupancyStatus === OccupancyStatus.RENTED ? 'info' : 'neutral'
              }
              className="rounded-lg font-black text-[9px] px-2.5 py-1 uppercase tracking-widest border-0 shadow-sm"
            >
              {flat.occupancyStatus.replace('_', ' ')}
            </Badge>
            <Badge variant="neutral" className="bg-secondary text-[8px] font-black uppercase tracking-widest px-2.5 h-6 rounded-md border-0 shrink-0">
              {flat.unitType}
            </Badge>
          </div>

          <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest bg-secondary/30 px-3 py-1.5 rounded-xl border border-border/40 w-fit">
            Sector {flat.block} • Level {flat.floor}
          </p>
        </div>

        {/* Resident Section: Standard Profile Box */}
        <div className="flex-1 mb-6">
          {isOccupied && resident ? (
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 group-hover:bg-secondary/50 transition-colors">
              <p className="text-[8px] text-muted-foreground/60 font-black uppercase tracking-widest mb-3">
                {isRented ? 'Lease Holder' : 'Primary Owner'}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground/60 shadow-sm">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground leading-none mb-1">
                    {resident.firstName} {resident.lastName}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[150px]">
                    {resident.email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-6 border border-dashed border-border/60 rounded-2xl bg-secondary/10">
              <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                Vacant Unit
              </p>
            </div>
          )}
        </div>

        {/* Footer: Maintenance & Action */}
        <div className="pt-4 border-t border-border/40 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest">Maintenance</span>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wide",
                flat.maintenanceStatus === MaintenanceStatus.PAID ? "text-success" :
                  flat.maintenanceStatus === MaintenanceStatus.DUE ? "text-warning" : "text-danger"
              )}>
                {flat.maintenanceStatus}
              </span>
              {flat.maintenanceStatus === MaintenanceStatus.OVERDUE && (
                <AlertCircle size={10} className="text-danger" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
            <span>Details</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Card>
  );
};
