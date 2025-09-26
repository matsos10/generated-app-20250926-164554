import { create } from 'zustand';
import { toast } from 'sonner';
import type { Kpi, MaintenanceAlert, ProductionTask, QualityDefect } from '../../worker/types';
import useAuthStore from '@/store/authStore';
interface ProductionData {
  kpis: Kpi[];
  alerts: MaintenanceAlert[];
  tasks: ProductionTask[];
  defects: QualityDefect[];
}
interface ProductionDataState extends ProductionData {
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}
const useProductionDataStore = create<ProductionDataState>((set, get) => ({
  kpis: [],
  alerts: [],
  tasks: [],
  defects: [],
  isLoading: true,
  error: null,
  fetchData: async () => {
    if (get().isLoading) {
      return;
    }
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      set({ isLoading: false, error: "User not authenticated." });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/data/${userId}/all`);
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch production data');
      }
      set({
        kpis: result.data.kpis || [],
        alerts: result.data.alerts || [],
        tasks: result.data.tasks || [],
        defects: result.data.defects || [],
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      set({ isLoading: false, error: errorMessage });
      toast.error(errorMessage);
    }
  },
}));
export default useProductionDataStore;