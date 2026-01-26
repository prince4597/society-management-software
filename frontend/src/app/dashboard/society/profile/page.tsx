'use client';

import { useState } from 'react';
import { Building2, ShieldCheck, MapPin, Edit3 } from 'lucide-react';
import { SocietyProfileForm } from '@/features/societies/components/SocietyProfileForm';
import { useSocietyProfile } from '@/features/societies/hooks/useSocietyProfile';
import { Card, Badge, CardHeader, CardContent, Button } from '@/components/ui';

export default function SocietyProfilePage() {
  const { society, isLoading } = useSocietyProfile();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Society Profile</h1>
        <p className="text-xs text-muted-foreground font-semibold mt-1">
          Manage institutional parameters and verified geospatial data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Institutional Overview Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="flat" padding="lg" className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary border border-primary/20 shadow-sm">
              <Building2 size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                {isLoading ? 'Loading...' : society?.name}
              </h2>
              <Badge
                variant="info"
                size="sm"
                className="bg-primary/10 text-primary border-primary/20 shadow-none"
              >
                <ShieldCheck size={10} className="mr-1" />
                VERIFIED ENTITY
              </Badge>
            </div>

            <div className="space-y-3 pt-6 border-t border-border/50">
              <div className="text-left space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Registry Code
                </p>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <span className="px-2 py-0.5 bg-secondary/30 rounded font-mono text-[10px] border border-border/50 uppercase">
                    {society?.code || '---'}
                  </span>
                </div>
              </div>
              <div className="text-left space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Geospatial Key
                </p>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <MapPin size={12} className="text-primary/60" />
                  <span>{society?.zipCode || '---'}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="outline" padding="sm" className="bg-secondary/5 border-dashed border-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
              Protocol Integrity Validated
            </p>
          </Card>
        </div>

        {/* Profile Edit Form Section */}
        <div className="lg:col-span-8">
          <Card variant="flat" padding="none">
            <CardHeader
              title="Society Configuration"
              subtitle="Update institutional records and geospatial markers"
              className="px-8 py-6 mb-0"
              action={
                !isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-primary hover:bg-primary/5"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 size={14} />
                    Edit Profile
                  </Button>
                )
              }
            />
            <CardContent className="px-8 py-8">
              <SocietyProfileForm
                mode={isEditing ? 'edit' : 'view'}
                onCancel={() => setIsEditing(false)}
                onSuccess={() => setIsEditing(false)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
