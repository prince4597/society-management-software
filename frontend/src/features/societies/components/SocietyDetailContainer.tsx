'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Edit, ShieldCheck, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button, ConfirmDialog, Dialog, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { AdminUser } from '@/types';

import { useSocietyOperations } from '../hooks/useSocietyOperations';
import { SocietyHeader } from './SocietyHeader';
import { SocietyStats } from './SocietyStats';
import { AdminNodeList } from './AdminNodeList';

interface SocietyDetailContainerProps {
  id: string;
}

export const SocietyDetailContainer = ({ id }: SocietyDetailContainerProps) => {
  const {
    society,
    isLoading,
    isUpdating,
    updateRecords,
    toggleSocietyStatus,
    addAdministrativeNode,
    transitionAdminStatus,
    purgeAdminNode,
  } = useSocietyOperations(id);

  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [adminAction, setAdminAction] = useState<'deactivate' | 'delete' | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);

  const [editFormData, setEditFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [addAdminFormData, setAddAdminFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleUpdate = async () => {
    const res = await updateRecords(editFormData);
    if (res.success) {
      showNotify('success', 'Institutional records synchronized successfully');
      setShowEditDialog(false);
    } else {
      showNotify('error', res.message || 'Chronicle Sync Failure');
    }
  };

  const handleToggle = async () => {
    const res = await toggleSocietyStatus();
    if (res.success) {
      showNotify(
        'success',
        `Society node ${!society?.isActive ? 'activated' : 'deactivated'} successfully`
      );
      setShowStatusConfirm(false);
    } else {
      showNotify('error', res.message || 'Protocol Failure');
    }
  };

  const handleAdminConfirm = async () => {
    if (!selectedAdmin || !adminAction) return;

    let res;
    if (adminAction === 'delete') {
      res = await purgeAdminNode(selectedAdmin.id);
    } else {
      res = await transitionAdminStatus(selectedAdmin.id, !selectedAdmin.isActive);
    }

    if (res.success) {
      showNotify('success', 'Administrative node action executed successfully');
      setSelectedAdmin(null);
      setAdminAction(null);
    } else {
      showNotify('error', res.message || 'Protocol Failure');
    }
  };

  const handleAddAdmin = async () => {
    const res = await addAdministrativeNode(addAdminFormData);
    if (res.success) {
      showNotify('success', 'Administrative node registered successfully');
      setShowAddAdminDialog(false);
      setAddAdminFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
      });
    } else {
      showNotify('error', res.message || 'Protocol Failure');
    }
  };

  if (isLoading)
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-64 bg-card/30 rounded-[32px]" />
        <div className="h-32 bg-card/30 rounded-2xl" />
      </div>
    );
  if (!society)
    return (
      <div className="text-center py-20 text-muted-foreground font-black">
        SOCIETY NODE NOT IDENTIFIED
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              'fixed top-24 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 backdrop-blur-xl',
              notification.type === 'success'
                ? 'bg-success/10 border-success/20 text-success'
                : 'bg-danger/10 border-danger/20 text-danger'
            )}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span className="text-sm font-black uppercase tracking-widest">
              {notification.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <Link href="/super-admin/societies">
          <Button
            variant="ghost"
            className="gap-2 px-0 hover:bg-transparent text-muted-foreground hover:text-foreground group"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span className="font-bold text-xs uppercase tracking-widest">Back to Registry</span>
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setEditFormData({
                name: society.name,
                address: society.address,
                city: society.city,
                state: society.state,
                zipCode: society.zipCode,
              });
              setShowEditDialog(true);
            }}
            variant="outline"
            className="rounded-xl font-bold gap-2 text-xs h-10 border-border/40"
          >
            <Edit size={14} className="text-primary" />
            Edit Records
          </Button>
          <Button
            onClick={() => setShowStatusConfirm(true)}
            variant={society.isActive ? 'outline' : 'primary'}
            className={cn(
              'rounded-xl font-bold gap-2 text-xs h-10',
              society.isActive ? 'border-danger/20 text-danger hover:bg-danger/5' : ''
            )}
          >
            {society.isActive ? <ShieldCheck size={14} /> : <Activity size={14} />}
            {society.isActive ? 'Deactivate Node' : 'Reactivate Node'}
          </Button>
        </div>
      </div>

      <SocietyHeader society={society} />
      <SocietyStats society={society} />
      <AdminNodeList
        admins={society.admins}
        onAddClick={() => setShowAddAdminDialog(true)}
        onAction={(admin, action) => {
          setSelectedAdmin(admin);
          setAdminAction(action);
        }}
      />

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={showStatusConfirm}
        onClose={() => setShowStatusConfirm(false)}
        onConfirm={handleToggle}
        isLoading={isUpdating}
        variant={society.isActive ? 'danger' : 'primary'}
        title={society.isActive ? 'Deactivate Society?' : 'Reactivate Society?'}
        description={`Confirm status transition for ${society.name}. Node connectivity will be ${society.isActive ? 'restricted' : 'restored'} immediately.`}
      />

      <ConfirmDialog
        isOpen={adminAction !== null}
        onClose={() => {
          setSelectedAdmin(null);
          setAdminAction(null);
        }}
        onConfirm={handleAdminConfirm}
        isLoading={isUpdating}
        variant="danger"
        title={adminAction === 'delete' ? 'Purge Node?' : 'Toggle Status?'}
        description={`Are you certain you wish to ${adminAction} administrative node [${selectedAdmin?.email}]?`}
      />

      <Dialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="Edit Institutional Records"
      >
        <div className="space-y-6">
          <Input
            label="Society Name"
            value={editFormData.name}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
          />
          <Input
            label="Primary Address"
            value={editFormData.address}
            onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="City"
              value={editFormData.city}
              onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
            />
            <Input
              label="State"
              value={editFormData.state}
              onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
            />
            <Input
              label="ZIP"
              value={editFormData.zipCode}
              onChange={(e) => setEditFormData({ ...editFormData, zipCode: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
            <Button variant="ghost" onClick={() => setShowEditDialog(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleUpdate} isLoading={isUpdating} className="rounded-xl font-black">
              Save Changes
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        isOpen={showAddAdminDialog}
        onClose={() => setShowAddAdminDialog(false)}
        title="Register Administrative Node"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={addAdminFormData.firstName}
              onChange={(e) =>
                setAddAdminFormData({ ...addAdminFormData, firstName: e.target.value })
              }
            />
            <Input
              label="Last Name"
              value={addAdminFormData.lastName}
              onChange={(e) =>
                setAddAdminFormData({ ...addAdminFormData, lastName: e.target.value })
              }
            />
          </div>
          <Input
            label="Email Address"
            type="email"
            value={addAdminFormData.email}
            onChange={(e) => setAddAdminFormData({ ...addAdminFormData, email: e.target.value })}
          />
          <Input
            label="Phone Number"
            placeholder="+91 9876543210"
            value={addAdminFormData.phoneNumber}
            onChange={(e) =>
              setAddAdminFormData({ ...addAdminFormData, phoneNumber: e.target.value })
            }
          />
          <Input
            label="Access Password"
            type="password"
            value={addAdminFormData.password}
            onChange={(e) => setAddAdminFormData({ ...addAdminFormData, password: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
            <Button
              variant="ghost"
              onClick={() => setShowAddAdminDialog(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddAdmin}
              isLoading={isUpdating}
              className="rounded-xl font-black"
            >
              Register Node
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
