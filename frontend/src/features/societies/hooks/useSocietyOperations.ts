import { useState, useCallback, useEffect } from 'react';
import { societiesService } from '../api/societies.service';
import type { Society, AdminUser } from '@/types';

export const useSocietyOperations = (id?: string) => {
    const [society, setSociety] = useState<Society | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchSociety = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const data = await societiesService.getSocietyById(id);
            setSociety(data);
        } catch (err: unknown) {
            // Error handled by societiesService/errorService
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchSociety();
    }, [fetchSociety]);

    const updateRecords = async (data: Partial<Society>) => {
        if (!id) return { success: false, message: 'ID is required' };
        setIsUpdating(true);
        try {
            const updated = await societiesService.updateSociety(id, data);
            setSociety(updated);
            return { success: true };
        } catch (err: unknown) {
            return { success: false, message: err instanceof Error ? err.message : 'Failed to update records' };
        } finally {
            setIsUpdating(false);
        }
    };

    const toggleSocietyStatus = async () => {
        if (!society) return { success: false, message: 'Society not loaded' };
        return updateRecords({ isActive: !society.isActive });
    };

    const addAdministrativeNode = async (formData: Record<string, any>) => {
        if (!id) return { success: false, message: 'ID is required' };

        // Domain validation: Ensure phone record includes country code
        const phoneNumber = formData.phoneNumber.trim();
        const isValidFormat = phoneNumber.startsWith('+');

        if (!isValidFormat) {
            return { success: false, message: 'Validation Error: Phone record must include country code (e.g. +91)' };
        }

        setIsUpdating(true);
        try {
            await societiesService.addAdmin(id, { ...formData, phoneNumber });
            await fetchSociety();
            return { success: true };
        } catch (err: unknown) {
            return { success: false, message: err instanceof Error ? err.message : 'Failed to register admin' };
        } finally {
            setIsUpdating(false);
        }
    };

    const transitionAdminStatus = async (adminId: string, isActive: boolean) => {
        setIsUpdating(true);
        try {
            await societiesService.updateAdmin(adminId, { isActive });
            await fetchSociety();
            return { success: true };
        } catch (err: unknown) {
            return { success: false, message: err instanceof Error ? err.message : 'Failed to update admin status' };
        } finally {
            setIsUpdating(false);
        }
    };

    const purgeAdminNode = async (adminId: string) => {
        setIsUpdating(true);
        try {
            await societiesService.deleteAdmin(adminId);
            await fetchSociety();
            return { success: true };
        } catch (err: unknown) {
            return { success: false, message: err instanceof Error ? err.message : 'Failed to purge node' };
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        society,
        isLoading,
        isUpdating,
        updateRecords,
        toggleSocietyStatus,
        addAdministrativeNode,
        transitionAdminStatus,
        purgeAdminNode,
        refresh: fetchSociety
    };
};
