'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  Phone,
  Mail,
  ShieldCheck,
  UserCheck,
  Calendar,
  Activity,
  Plus,
  Edit,
  X,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Power,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import { Button, ConfirmDialog, Input, Dialog } from '@/components/ui';
import { useSociety } from '../hooks/useSociety';
import type { AdminUser } from '../types';
import { cn } from '@/lib/utils';

interface SocietyDetailProps {
  id: string;
}

export const SocietyDetail = ({ id }: SocietyDetailProps) => {
  const {
    society,
    isLoading,
    isUpdating,
    updateSociety,
    toggleStatus: toggleSocietyStatus,
    addAdmin: registerAdmin,
    updateAdminStatus,
    deleteAdmin: purgeAdmin,
  } = useSociety(id);

  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [adminAction, setAdminAction] = useState<'deactivate' | 'delete' | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);
  const [addAdminFormData, setAddAdminFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);


  const handleUpdateRecords = async () => {
    const res = await updateSociety(editFormData);
    if (res.success) {
      showNotification('success', 'Institutional records synchronized successfully');
      setShowEditDialog(false);
    } else {
      showNotification('error', res.message || 'Chronicle Sync Failure: Could not persist records');
    }
  };

  const handleToggleStatus = async () => {
    const res = await toggleSocietyStatus();
    if (res.success) {
      showNotification('success', `Society node ${!society?.isActive ? 'activated' : 'deactivated'} successfully`);
      setShowStatusConfirm(false);
    } else {
      showNotification('error', res.message || 'Protocol Failure: Could not update node status');
    }
  };

  const handleAdminAction = (admin: AdminUser, action: 'deactivate' | 'delete') => {
    setSelectedAdmin(admin);
    setAdminAction(action);
  };

  const handleAdminConfirm = async () => {
    if (!selectedAdmin || !adminAction) return;

    let res;
    if (adminAction === 'delete') {
      res = await purgeAdmin(selectedAdmin.id);
      if (res.success) {
        showNotification('success', `Administrative node ${selectedAdmin.email} purged successfully`);
      }
    } else {
      const newStatus = !selectedAdmin.isActive;
      res = await updateAdminStatus(selectedAdmin.id, newStatus);
      if (res.success) {
        showNotification('success', `Administrative node ${selectedAdmin.email} ${newStatus ? 're-activated' : 'deactivated'} successfully`);
      }
    }

    if (res && res.success) {
      setSelectedAdmin(null);
      setAdminAction(null);
    } else {
      showNotification('error', res?.message || `Protocol Failure: Could not execute ${adminAction} command`);
    }
  };

  const handleAddAdmin = async () => {
    const res = await registerAdmin(addAdminFormData);
    if (res.success) {
      showNotification('success', 'Administrative node registered and linked successfully');
      setShowAddAdminDialog(false);
      setAddAdminFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: ''
      });
    } else {
      showNotification('error', res.message || 'Protocol Failure: Could not synchronize new administrative node');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-64 bg-card/30 rounded-[32px] border border-border/40" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-card/30 rounded-2xl border border-border/40" />
          <div className="h-32 bg-card/30 rounded-2xl border border-border/40" />
          <div className="h-32 bg-card/30 rounded-2xl border border-border/40" />
        </div>
        <div className="h-96 bg-card/30 rounded-[32px] border border-border/40" />
      </div>
    );
  }

  if (!society) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Activity size={48} className="text-muted-foreground opacity-20 mb-4" />
        <h2 className="text-xl font-bold">Society Not Found</h2>
        <p className="text-muted-foreground mt-2">The society you are looking for does not exist or has been removed.</p>
        <Link href="/super-admin/societies" className="mt-6">
          <Button variant="outline">Back to Registry</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Global Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className={cn(
              "fixed top-24 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 min-w-[320px] backdrop-blur-xl",
              notification.type === 'success'
                ? "bg-success/10 border-success/20 text-success"
                : "bg-danger/10 border-danger/20 text-danger"
            )}
          >
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-black uppercase tracking-widest">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-auto opacity-50 hover:opacity-100 p-1">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Link href="/super-admin/societies">
          <Button variant="ghost" className="gap-2 px-0 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span className="font-bold text-xs uppercase tracking-widest leading-none">Back to Registry</span>
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              if (society) {
                setEditFormData({
                  name: society.name,
                  address: society.address,
                  city: society.city,
                  state: society.state,
                  zipCode: society.zipCode
                });
              }
              setShowEditDialog(true);
            }}
            variant="outline"
            className="rounded-xl font-bold gap-2 text-xs h-10 border-border/40 hover:bg-secondary/50 transition-all"
          >
            <Edit size={14} className="text-primary" />
            Edit Records
          </Button>
          <Button
            onClick={() => setShowStatusConfirm(true)}
            variant={society.isActive ? "outline" : "primary"}
            className={cn(
              "rounded-xl font-bold gap-2 text-xs h-10 transition-all",
              society.isActive ? "border-danger/20 text-danger hover:bg-danger/5 hover:border-danger/40" : "shadow-lg shadow-primary/20"
            )}
          >
            {society.isActive ? (
              <>
                <ShieldCheck size={14} />
                Deactivate Node
              </>
            ) : (
              <>
                <Activity size={14} />
                Reactivate Node
              </>
            )}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showStatusConfirm}
        onClose={() => setShowStatusConfirm(false)}
        onConfirm={handleToggleStatus}
        isLoading={isUpdating}
        variant={society.isActive ? 'danger' : 'primary'}
        title={society.isActive ? 'Deactivate Society?' : 'Reactivate Society?'}
        description={
          society.isActive
            ? "Deactivating this society will restrict access for all residents and administrative personnel immediately."
            : "Reactivating this society will restore access for all authorized units and administrative nodes."
        }
        confirmLabel={society.isActive ? 'Deactivate' : 'Reactivate'}
      />

      <Dialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="Edit Society Records"
        className="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Society Name"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              className="bg-white/5 border-white/10 focus:border-primary/40"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <Input
              label="Institutional Code"
              value={society.code}
              disabled
              className="bg-white/5 border-white/10 opacity-50"
            />
          </div>
          <Input
            label="Primary Address"
            value={editFormData.address}
            onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
            className="bg-white/5 border-white/10 focus:border-primary/40"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="City"
              value={editFormData.city}
              onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
              className="bg-white/5 border-white/10 focus:border-primary/40"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <Input
              label="State"
              value={editFormData.state}
              onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
              className="bg-white/5 border-white/10 focus:border-primary/40"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <Input
              label="ZIP"
              value={editFormData.zipCode}
              onChange={(e) => setEditFormData({ ...editFormData, zipCode: e.target.value })}
              className="bg-white/5 border-white/10 focus:border-primary/40"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
            <Button variant="ghost" onClick={() => setShowEditDialog(false)} disabled={isUpdating} className="rounded-xl font-bold">Cancel</Button>
            <Button
              onClick={handleUpdateRecords}
              isLoading={isUpdating}
              className="rounded-xl font-black shadow-lg shadow-primary/20"
            >
              Save Institutional Changes
            </Button>
          </div>
        </div>
      </Dialog>

      <ConfirmDialog
        isOpen={adminAction !== null}
        onClose={() => {
          setSelectedAdmin(null);
          setAdminAction(null);
        }}
        onConfirm={handleAdminConfirm}
        isLoading={isUpdating}
        variant="danger"
        title={adminAction === 'delete' ? 'Purge Administrative Node?' : (selectedAdmin?.isActive ? 'Deactivate Node?' : 'Reactivate Node?')}
        description={
          adminAction === 'delete'
            ? `Are you absolutely certain you wish to purge the administrative node [${selectedAdmin?.email}]? This action is irreversible and all protocol access will be terminated.`
            : `Confirm node status transition for [${selectedAdmin?.email}]. Access to administrative sub-layers will be ${selectedAdmin?.isActive ? 'restricted' : 'restored'} immediately.`
        }
        confirmLabel={adminAction === 'delete' ? 'Purge Node' : (selectedAdmin?.isActive ? 'Deactivate' : 'Reactivate')}
      />

      <Dialog
        isOpen={showAddAdminDialog}
        onClose={() => setShowAddAdminDialog(false)}
        title="Register Administrative Node"
        className="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={addAdminFormData.firstName}
              onChange={(e) => setAddAdminFormData({ ...addAdminFormData, firstName: e.target.value })}
              placeholder="e.g. John"
              className="bg-white/5 border-white/10"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <Input
              label="Last Name"
              value={addAdminFormData.lastName}
              onChange={(e) => setAddAdminFormData({ ...addAdminFormData, lastName: e.target.value })}
              placeholder="e.g. Doe"
              className="bg-white/5 border-white/10"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          <Input
            label="Email Address"
            value={addAdminFormData.email}
            onChange={(e) => setAddAdminFormData({ ...addAdminFormData, email: e.target.value })}
            placeholder="admin@society.com"
            type="email"
            className="bg-white/5 border-white/10"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              value={addAdminFormData.phoneNumber}
              onChange={(e) => {
                let val = e.target.value;
                if (!val.startsWith('+')) val = '+' + val.replace(/\D/g, '');
                // Add space after country code (+XX )
                if (val.length === 3 && !val.includes(' ')) val = val + ' ';
                // Limit length for +91 1234567890
                if (val.length <= 14) {
                  setAddAdminFormData({ ...addAdminFormData, phoneNumber: val });
                }
              }}
              placeholder="+91 9876543210"
              className="bg-white/5 border-white/10"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          <Input
            label="Access Password"
            value={addAdminFormData.password}
            onChange={(e) => setAddAdminFormData({ ...addAdminFormData, password: e.target.value })}
            placeholder="Initial security key"
            type="password"
            className="bg-white/5 border-white/10"
            autoComplete="new-password"
            autoCorrect="off"
            spellCheck={false}
          />
          <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
            <Button variant="ghost" onClick={() => setShowAddAdminDialog(false)} disabled={isUpdating} className="rounded-xl font-bold">Cancel</Button>
            <Button
              onClick={handleAddAdmin}
              isLoading={isUpdating}
              className="rounded-xl font-black shadow-lg shadow-primary/20"
            >
              Register Admin Node
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Glassmorphic Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-background/30 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 sm:p-10 shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-8">
          <div className="flex flex-col items-end gap-2">
            <span className={cn(
              "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] border",
              society.isActive
                ? "bg-success/10 text-success border-success/20"
                : "bg-danger/10 text-danger border-danger/20"
            )}>
              {society.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
            <Building2 className="text-primary" size={40} />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-black text-foreground tracking-tighter">{society.name}</h1>
                <span className="text-sm font-black text-muted-foreground/40 mt-2 px-2 py-0.5 rounded-lg border border-border/40 uppercase tracking-widest">{society.code}</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary/60" />
                  <span>{society.address}, {society.city}, {society.state} {society.zipCode}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground bg-white/5 py-2 px-4 rounded-xl border border-white/5">
                <Mail size={14} className="text-primary" />
                {society.email || 'No institutional email'}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-foreground bg-white/5 py-2 px-4 rounded-xl border border-white/5">
                <Phone size={14} className="text-primary" />
                {society.phone || 'No phone record'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: "Total Asset Load", value: `${society.totalFlats || 0} Units`, color: "text-blue-500" },
          { icon: UserCheck, label: "Active Administrators", value: `${society.admins?.length || 0} Nodes`, color: "text-emerald-500" },
          { icon: Calendar, label: "Onboard Date", value: society.createdAt ? new Date(society.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Unknown', color: "text-amber-500" },
          { icon: Building2, label: "Managed Code", value: society.code || 'N/A', color: "text-purple-500" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="bg-card/20 backdrop-blur-md border border-border/40 rounded-2xl p-6 group hover:border-primary/30 transition-all shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-xl bg-white/5 ring-1 ring-white/5 group-hover:ring-primary/20", stat.color)}>
                <stat.icon size={20} />
              </div>
              <div className="flex flex-col"                                                                                >
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{stat.label}</p>
                <p className="text-sm font-black text-foreground">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Sections */}
      <div className="space-y-8">
        <section className="bg-card/30 backdrop-blur-xl border border-border/40 rounded-[32px] overflow-hidden shadow-xl">
          <div className="px-8 py-6 border-b border-border/40 flex items-center justify-between bg-white/5">
            <h3 className="font-black text-sm uppercase tracking-widest text-foreground flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              Administrative Node Control
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg text-xs font-bold gap-1.5 border-border/40"
              onClick={() => setShowAddAdminDialog(true)}
            >
              <Plus size={14} />
              Add Admin
            </Button>
          </div>

          <div className="divide-y divide-border/20">
            {society.admins && society.admins.length > 0 ? (
              society.admins.map((admin) => (
                <div key={admin.id} className="p-8 flex items-center justify-between group hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary text-xl font-black">
                      {admin.firstName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {admin.firstName} {admin.lastName}
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</span>
                      <span className={cn(
                        "text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-md border",
                        admin.isActive ? "bg-success/10 text-success border-success/20" : "bg-danger/10 text-danger border-danger/20"
                      )}>
                        {admin.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "p-2 rounded-xl transition-all h-10 w-10",
                          admin.isActive ? "text-danger hover:bg-danger/10" : "text-success hover:bg-success/10"
                        )}
                        onClick={() => handleAdminAction(admin, 'deactivate')}
                        title={admin.isActive ? "Deactivate Node" : "Reactivate Node"}
                      >
                        {admin.isActive ? <Power size={18} /> : <RotateCcw size={18} />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 hover:bg-danger/10 text-danger/60 hover:text-danger rounded-xl transition-all h-10 w-10"
                        onClick={() => handleAdminAction(admin, 'delete')}
                        title="Purge Node"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 flex flex-col items-center justify-center opacity-40">
                <UserCheck size={32} className="mb-4 text-muted-foreground" />
                <p className="text-xs font-bold uppercase tracking-[0.2em]">No administrative nodes identified</p>
              </div>
            )}
            {society.admins && society.admins.length < 3 && (
              <div className="p-8 flex items-center justify-center opacity-40 border-t border-border/10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] italic">Secondary node expansion available</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
