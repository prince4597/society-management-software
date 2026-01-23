import { Building2, MapPin, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge, Card } from '@/components/ui';
import type { Society } from '@/types';

interface SocietyHeaderProps {
  society: Society;
}

export const SocietyHeader = ({ society }: SocietyHeaderProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-14 h-14 rounded bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 shadow-sm">
          <Building2 className="text-primary" size={28} />
        </div>

        <div className="flex-1 space-y-4 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" size="sm">{society.code}</Badge>
                <Badge variant={society.isActive ? 'success' : 'error'} size="sm">
                  {society.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">{society.name}</h1>
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-1 font-semibold">
                <MapPin size={12} className="text-primary/60" />
                <span>{society.address}, {society.city}, {society.state} {society.zipCode}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-3 text-xs text-foreground/80 font-bold bg-secondary/20 px-3 py-2 rounded border border-border/30">
              <Mail size={14} className="text-primary/70" />
              <span className="truncate">{society.email || 'NO_MAIL_RECORD'}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-foreground/80 font-bold bg-secondary/20 px-3 py-2 rounded border border-border/30">
              <Phone size={14} className="text-primary/70" />
              <span className="truncate">{society.phone || 'NO_PHONE_RECORD'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
