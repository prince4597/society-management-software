'use client';

import { FamilyMember } from '../types';
import { User, Phone, Mail } from 'lucide-react';

interface FamilyMemberListProps {
  members: FamilyMember[];
}

export const FamilyMemberList = ({ members }: FamilyMemberListProps) => {
  if (!members || members.length === 0) {
    return (
      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest italic">
        No family members registered
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">
        Family Members ({members.length})
      </h4>
      <div className="grid gap-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border/50 group hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-background flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors border border-border/50">
                <User size={14} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  {member.name}
                </p>
                <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest">
                  {member.relation}
                </p>
              </div>
            </div>
            {(member.phoneNumber || member.email) && (
              <div className="flex gap-1">
                {member.phoneNumber && (
                  <div title={member.phoneNumber} className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    <Phone size={12} />
                  </div>
                )}
                {member.email && (
                  <div title={member.email} className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    <Mail size={12} />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
