import './App.css';
import AppRouter from './router/AppRouter';
import NavBar from './components/NavBar';
import { UpdateAnimation } from './components/UpdateProgress/UpdateAnimation';
import { useShowAnimation, useToasts, useRemoveToast, useTriggerUpdatesRefresh, useAddToast, useAppStore } from './store';
import ToastContainer from './components/shared/ToastContainer';
import { useWebSocketContext } from './hooks/WebSocketContext';
import { Update, UpdateProgress } from './types/device';
import { useEffect } from 'react';

function App() {
  const showAnimation = useShowAnimation();
  const toasts = useToasts();
  const removeToast = useRemoveToast();
  const addToast = useAddToast();
  const { updateOrAddProgressToast } = useAppStore();
  const ws = useWebSocketContext();
  const triggerUpdatesRefresh = useTriggerUpdatesRefresh();

  const handleCloseToast = (id: string) => {
    removeToast(id);
  };

  // 웹소켓 알림 Toast 모든 페이지에서 처리 및 목록 새로고침 트리거
  useEffect(() => {
    if (!ws?.lastNotification || ws.isNotificationShown(ws.lastNotification)) return;
    const { type, data } = ws.lastNotification;
    if (type === 'new_update' && (data as Update).uid) {
      const updateData = data as Update;
      const toastId = `update-${updateData.uid}`;
      // 중복 토스트 확인
      if (!toasts.some(t => t.id === toastId)) {
        addToast({
          id: toastId,
          type: 'new',
          title: 'New Update',
          message: `새로운 업데이트 ${updateData.uid}가 있습니다.`,
          progress: 0,
          showProgress: false,
          icon: 'bell'
        });
      }
      triggerUpdatesRefresh(); // 목록 새로고침 트리거
    }
    if (type === 'update_progress' && (data as UpdateProgress).uid) {
      const progressData = data as UpdateProgress;
      const { uid, progress = 0 } = progressData;
      const toastId = `install-${uid}`;
      updateOrAddProgressToast(toastId, progress);
      // 설치 완료시 3초 후 토스트 자동 제거
      if (progress === 100) {
        setTimeout(() => {
          removeToast(toastId);
        }, 3000);
      }
    }
  }, [ws?.lastNotification]);

  return (
    <div className="App">
      <NavBar />
      <AppRouter />
      {showAnimation && <UpdateAnimation />}
      <ToastContainer toasts={toasts} onClose={handleCloseToast} />
    </div>
  );
}

export default App;
