import { create } from 'zustand';
import { DeviceInfo, Update } from '../types/device';
import { ToastData } from '../components/shared/ToastContainer';

// 전체 스토어의 상태 타입 정의
interface AppState {
  // Device state
  deviceInfo: DeviceInfo | null;
  setDeviceInfo: (deviceInfo: DeviceInfo | null) => void;
  
  // Updates state
  updates: Update[];
  setUpdates: (updates: Update[]) => void;
  
  // Connection state
  isConnected: boolean;
  setConnectionState: (isConnected: boolean) => void;
  
  // Animation state
  showAnimation: boolean;
  setShowAnimation: (showAnimation: boolean) => void;
  
  // Toasts state
  toasts: ToastData[];
  setToasts: (toasts: ToastData[]) => void;
  addToast: (toast: ToastData) => void;
  removeToast: (id: string) => void;
  updateToastProgress: (id: string, progress: number) => void;
  updateOrAddProgressToast: (id: string, progress: number) => void;
  
  // Refresh triggers
  updatesRefreshTrigger: number;
  triggerUpdatesRefresh: () => void;
  
  installSuccessTrigger: number;
  triggerInstallSuccess: () => void;
}

// Zustand 스토어 생성
export const useAppStore = create<AppState>((set) => ({
  // Initial state
  deviceInfo: null,
  updates: [],
  isConnected: false,
  showAnimation: false,
  toasts: [],
  updatesRefreshTrigger: 0,
  installSuccessTrigger: 0,
  
  // Actions
  setDeviceInfo: (deviceInfo) => set({ deviceInfo }),
  
  setUpdates: (updates) => set({ updates }),
  
  setConnectionState: (isConnected) => set({ isConnected }),
  
  setShowAnimation: (showAnimation) => set({ showAnimation }),
  
  setToasts: (toasts) => set({ toasts }),
  
  addToast: (toast) => set((state) => ({ 
    toasts: [...state.toasts, toast] 
  })),
  
  removeToast: (id) => set((state) => ({ 
    toasts: state.toasts.filter(toast => toast.id !== id) 
  })),
  
  updateToastProgress: (id, progress) => set((state) => ({
    toasts: state.toasts.map(toast => 
      toast.id === id ? { ...toast, progress } : toast
    )
  })),
  
  updateOrAddProgressToast: (id, progress) => set((state) => {
    const existing = state.toasts.find(t => t.id === id);
    if (existing) {
      return {
        toasts: state.toasts.map(t =>
          t.id === id
            ? {
                ...t,
                type: progress === 100 ? 'success' : 'default',
                title: progress === 100 ? '업데이트 설치 완료!' : '업데이트 설치 중',
                message: `${Math.round(progress)}% 완료`,
                progress
              }
            : t
        )
      };
    }
    return {
      toasts: [
        ...state.toasts,
        {
          id,
          type: 'default',
          title: '업데이트 설치 중',
          message: `${Math.round(progress)}% 완료`,
          progress,
          showProgress: true,
          icon: 'info'
        }
      ]
    };
  }),
  
  triggerUpdatesRefresh: () => set((state) => ({ 
    updatesRefreshTrigger: state.updatesRefreshTrigger + 1 
  })),
  
  triggerInstallSuccess: () => set((state) => ({ 
    installSuccessTrigger: state.installSuccessTrigger + 1 
  })),
}));

// 개별 상태를 위한 커스텀 훅들 (Recoil hooks와 유사한 인터페이스 제공)
export const useDeviceInfo = () => useAppStore((state) => state.deviceInfo);
export const useSetDeviceInfo = () => useAppStore((state) => state.setDeviceInfo);

export const useUpdates = () => useAppStore((state) => state.updates);
export const useSetUpdates = () => useAppStore((state) => state.setUpdates);

export const useConnectionState = () => useAppStore((state) => state.isConnected);
export const useSetConnectionState = () => useAppStore((state) => state.setConnectionState);

export const useShowAnimation = () => useAppStore((state) => state.showAnimation);
export const useSetShowAnimation = () => useAppStore((state) => state.setShowAnimation);

export const useToasts = () => useAppStore((state) => state.toasts);
export const useSetToasts = () => useAppStore((state) => state.setToasts);
export const useAddToast = () => useAppStore((state) => state.addToast);
export const useRemoveToast = () => useAppStore((state) => state.removeToast);

export const useUpdatesRefreshTrigger = () => useAppStore((state) => state.updatesRefreshTrigger);
export const useTriggerUpdatesRefresh = () => useAppStore((state) => state.triggerUpdatesRefresh);

export const useInstallSuccessTrigger = () => useAppStore((state) => state.installSuccessTrigger);
export const useTriggerInstallSuccess = () => useAppStore((state) => state.triggerInstallSuccess);

// 여러 상태를 함께 사용하는 복합 훅들
export const useDeviceState = () => useAppStore((state) => ({
  deviceInfo: state.deviceInfo,
  setDeviceInfo: state.setDeviceInfo,
  isConnected: state.isConnected,
  setConnectionState: state.setConnectionState,
}));

export const useUpdateState = () => useAppStore((state) => ({
  updates: state.updates,
  setUpdates: state.setUpdates,
  updatesRefreshTrigger: state.updatesRefreshTrigger,
  triggerUpdatesRefresh: state.triggerUpdatesRefresh,
  installSuccessTrigger: state.installSuccessTrigger,
  triggerInstallSuccess: state.triggerInstallSuccess,
}));