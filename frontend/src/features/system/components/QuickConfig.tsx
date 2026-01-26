'use client';

import { ShieldAlert, Globe, RefreshCcw } from 'lucide-react';
import { Button, Card, CardHeader, CardContent, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { systemService } from '../api/system.service';
import type { ConfigItem } from '@/types';

interface QuickConfigProps {
  initialData?: ConfigItem[];
}

export const QuickConfig = ({ initialData = [] }: QuickConfigProps) => {
  const [configs, setConfigs] = useState<ConfigItem[]>(initialData);
  const [loading, setLoading] = useState(!initialData.length);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const data = await systemService.getConfigs();
      setConfigs(data);
    } catch (error) {
      console.error('Failed to fetch configs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData.length > 0) return;
    fetchConfigs();
  }, [initialData.length]);

  const handleToggle = async (key: string, currentValue: unknown) => {
    try {
      setUpdating(key);
      const newValue = !currentValue;
      await systemService.updateConfig(key, newValue);
      setConfigs((prev) => prev.map((c) => (c.key === key ? { ...c, value: newValue } : c)));
    } catch (error) {
      console.error(`Failed to update ${key}:`, error);
    } finally {
      setUpdating(null);
    }
  };

  const getConfig = (key: string) => configs.find((c) => c.key === key);

  const maintenance = getConfig('maintenance_mode');
  const registration = getConfig('registration_enabled');

  return (
    <Card variant="flat" padding="none">
      <CardHeader
        title="Quick Infrastructure Controls"
        subtitle="Global system override switches"
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchConfigs()}
            className="h-8 w-8 p-0"
            disabled={loading}
          >
            <RefreshCcw size={14} className={cn(loading && 'animate-spin')} />
          </Button>
        }
        className="px-6 py-4 mb-0"
      />
      <CardContent className="p-6 space-y-4">
        {/* Maintenance Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-secondary/10 border border-border/50 rounded-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert
                size={16}
                className={maintenance?.value ? 'text-rose-500' : 'text-muted-foreground/60'}
              />
              <span className="text-sm font-bold text-foreground uppercase tracking-tight">
                Maintenance Mode
              </span>
              <Badge variant={maintenance?.value ? 'error' : 'success'} size="sm">
                {maintenance?.value ? 'Active' : 'Disabled'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Instantly disable non-admin operations across all system nodes.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={updating === 'maintenance_mode'}
            onClick={() => handleToggle('maintenance_mode', maintenance?.value)}
            className={cn(
              'text-[10px] font-bold uppercase tracking-wider h-8 min-w-[140px]',
              maintenance?.value
                ? 'hover:bg-rose-500/10 hover:text-rose-500'
                : 'hover:bg-emerald-500/10 hover:text-emerald-500'
            )}
          >
            {updating === 'maintenance_mode'
              ? 'Processing...'
              : maintenance?.value
                ? 'Disable'
                : 'Enable'}
          </Button>
        </div>

        {/* Global Registration */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-secondary/10 border border-border/50 rounded-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe
                size={16}
                className={registration?.value ? 'text-primary/70' : 'text-muted-foreground/60'}
              />
              <span className="text-sm font-bold text-foreground uppercase tracking-tight">
                Public Onboarding
              </span>
              <Badge variant={registration?.value ? 'success' : 'warning'} size="sm">
                {registration?.value ? 'Permitted' : 'Paused'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Control if new societies can onboard via the public portal.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={updating === 'registration_enabled'}
            onClick={() => handleToggle('registration_enabled', registration?.value)}
            className="text-[10px] font-bold uppercase tracking-wider h-8 min-w-[140px]"
          >
            {updating === 'registration_enabled'
              ? 'Processing...'
              : registration?.value
                ? 'Pause Registration'
                : 'Resume Registration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
