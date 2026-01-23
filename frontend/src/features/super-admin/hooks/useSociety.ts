import { useState, useCallback, useEffect } from 'react';
import { systemService } from '../services/system.service';
import type { Society } from '../types';

export const useSociety = (id?: string) => {
  const [society, setSociety] = useState<Society | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await systemService.getSocietyById(id);
      if (res.success) {
        setSociety(res.data);
      } else {
        setError(res.message || 'Failed to fetch society records');
      }
    } catch (err) {
      console.error('Failed to fetch society detail:', err);
      setError('Network Error: Failed to synchronize society records');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateSociety = async (data: Partial<Society>) => {
    if (!id) return { success: false, message: 'ID is required' };
    setIsUpdating(true);
    setError(null);
    try {
      const res = await systemService.updateSociety(id, data);
      if (res.success) {
        setSociety(res.data);
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message || 'Failed to update records' };
    } catch (err) {
      console.error('Update Failure:', err);
      return { success: false, message: 'Protocol Failure: Could not persist records' };
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleStatus = async () => {
    if (!society || !id) return { success: false, message: 'Invalid state' };
    return updateSociety({ isActive: !society.isActive });
  };

  const addAdmin = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password?: string;
  }) => {
    if (!id) return { success: false, message: 'ID is required' };

    // Move phone formatting logic here from component
    let formattedPhone = formData.phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      return { success: false, message: 'Validation Error: Phone record must include country code (e.g. +91)' };
    }

    if (formattedPhone.length >= 4 && formattedPhone[3] !== ' ') {
      formattedPhone = formattedPhone.slice(0, 3) + ' ' + formattedPhone.slice(3);
    }

    setIsUpdating(true);
    try {
      const res = await systemService.addAdmin(id, { ...formData, phoneNumber: formattedPhone });
      if (res.success) {
        await fetchData();
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message || 'Failed to register admin' };
    } catch (err) {
      console.error('Admin Registration Failure:', err);
      return { success: false, message: 'Protocol Failure: Could not synchronize new administrative node' };
    } finally {
      setIsUpdating(false);
    }
  };

  const updateAdminStatus = async (adminId: string, isActive: boolean) => {
    setIsUpdating(true);
    try {
      const res = await systemService.updateAdmin(adminId, { isActive });
      if (res.success) {
        await fetchData();
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message || 'Failed to update admin status' };
    } catch (err) {
      console.error('Admin Update Failure:', err);
      return { success: false, message: 'Protocol Failure: Could not execute transition command' };
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteAdmin = async (adminId: string) => {
    setIsUpdating(true);
    try {
      const res = await systemService.deleteAdmin(adminId);
      if (res.success) {
        await fetchData();
        return { success: true };
      }
      return { success: false, message: res.message || 'Failed to delete admin' };
    } catch (err) {
      console.error('Admin Delete Failure:', err);
      return { success: false, message: 'Protocol Failure: Could not execute purge command' };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    society,
    isLoading,
    isUpdating,
    error,
    fetchData,
    updateSociety,
    toggleStatus,
    addAdmin,
    updateAdminStatus,
    deleteAdmin
  };
};
