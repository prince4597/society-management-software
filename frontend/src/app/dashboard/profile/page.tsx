'use client';

import { useState } from 'react';
import { ShieldCheck, Mail, Phone, Building2, Edit3 } from 'lucide-react';
import { ProfileForm } from '@/features/profile';
import { useAuth } from '@/providers/AuthProvider';
import { Card, Badge, CardHeader, CardContent, Button } from '@/components/ui';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Administrative Profile</h1>
        <p className="text-xs text-muted-foreground font-semibold mt-1">
          Manage your identity and verified contact parameters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Overview Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="flat" padding="lg" className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary border border-primary/20 shadow-sm uppercase">
              {user?.firstName?.[0]}
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                {user?.firstName} {user?.lastName}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge
                  variant="info"
                  size="sm"
                  className="bg-primary/10 text-primary border-primary/20 shadow-none uppercase"
                >
                  <ShieldCheck size={10} className="mr-1" />
                  {user?.role?.replace('_', ' ')}
                </Badge>
                {user?.society && (
                  <Badge
                    variant="info"
                    size="sm"
                    className="bg-secondary/20 text-muted-foreground border-border/30 shadow-none uppercase"
                  >
                    <Building2 size={10} className="mr-1" />
                    {user.society.name}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-border/50">
              <div className="text-left space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Access Identifier
                </p>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Mail size={12} className="text-primary/60" />
                  <span className="truncate">{user?.email}</span>
                </div>
              </div>
              <div className="text-left space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Contact Priority
                </p>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Phone size={12} className="text-primary/60" />
                  <span>{user?.phoneNumber || 'UNSET'}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="outline" padding="sm" className="bg-secondary/5 border-dashed border-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
              System Integrity Active
            </p>
          </Card>
        </div>

        {/* Profile Edit Form Section */}
        <div className="lg:col-span-8">
          <Card variant="flat" padding="none">
            <CardHeader
              title="Identity Configuration"
              subtitle="Update your name and communication records"
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
              <ProfileForm
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
