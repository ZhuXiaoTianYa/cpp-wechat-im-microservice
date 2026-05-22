/**
 * WebSocket Hook
 * 管理 WebSocket 连接生命周期
 */
import { useEffect, useRef } from 'react';
import { imWebSocket } from '@/services/websocket';
import { useIMStore } from '@/store/useIMStore';

export function useWebSocket() {
  const sessionId = useIMStore((state) => state.sessionId);
  const wsConnected = useIMStore((state) => state.wsConnected);
  const wsReconnecting = useIMStore((state) => state.wsReconnecting);
  const hasInitialized = useRef(false);
  
  useEffect(() => {
    if (sessionId && !hasInitialized.current) {
      imWebSocket.connect(sessionId);
      hasInitialized.current = true;
    }
    
    return () => {
      if (hasInitialized.current) {
        imWebSocket.disconnect();
        hasInitialized.current = false;
      }
    };
  }, [sessionId]);
  
  return {
    connected: wsConnected,
    reconnecting: wsReconnecting,
    isConnected: imWebSocket.isConnected(),
  };
}
