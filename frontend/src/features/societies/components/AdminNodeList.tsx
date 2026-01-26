import { ShieldCheck, Plus, Power, RotateCcw, Trash2, UserCheck } from 'lucide-react';
import { Button, EmptyState, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { AdminUser } from '@/types';

interface AdminNodeListProps {
  admins: AdminUser[] | undefined;
  onAddClick: () => void;
  onAction: (admin: AdminUser, action: 'deactivate' | 'delete') => void;
}

export const AdminNodeList = ({ admins, onAddClick, onAction }: AdminNodeListProps) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30">
        <h3 className="font-bold text-xs text-foreground uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" />
          Society Administrators
        </h3>
        <Button onClick={onAddClick} size="sm" variant="outline" leftIcon={<Plus size={14} />}>
          Add New Admin
        </Button>
      </div>

      <div className="divide-y divide-border/50">
        {admins && admins.length > 0 ? (
          admins.map((admin) => (
            <div
              key={admin.id}
              className="px-6 py-4 flex items-center justify-between group hover:bg-secondary/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center border border-primary/20 text-primary text-sm font-bold shadow-inner">
                  {admin.firstName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm tracking-tight">
                    {admin.firstName} {admin.lastName}
                  </h4>
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-tight">
                    {admin.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <Badge variant={admin.isActive ? 'success' : 'error'} size="sm">
                  {admin.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'h-8 w-8 p-0 rounded',
                      admin.isActive
                        ? 'text-danger hover:bg-danger/10'
                        : 'text-success hover:bg-success/10'
                    )}
                    onClick={() => onAction(admin, 'deactivate')}
                    title={admin.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {admin.isActive ? <Power size={16} /> : <RotateCcw size={16} />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded hover:bg-danger/5 text-muted-foreground/60 hover:text-danger"
                    onClick={() => onAction(admin, 'delete')}
                    title="Delete Account"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-secondary/5">
            <EmptyState message="No administrators found" icon={UserCheck} />
          </div>
        )}
      </div>
    </div>
  );
};
