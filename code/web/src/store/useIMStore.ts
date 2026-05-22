import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { im_server } from '@/proto/generated';

export interface IMStore {
  currentUser: im_server.IUserInfo | null;
  sessionId: string | null;
  sessions: Map<string, im_server.IChatSessionInfo>;
  messages: Map<string, im_server.IMessageInfo[]>;
  activeSessionId: string | null;
  friends: Map<string, im_server.IUserInfo>;
  pendingFriendRequests: im_server.IFriendEvent[];
  wsConnected: boolean;
  wsReconnecting: boolean;
  wsReconnectAttempts: number;
  unreadCount: Map<string, number>;
  
  login: (sessionId: string, user: im_server.IUserInfo) => void;
  logout: () => void;
  updateCurrentUser: (updates: Partial<im_server.IUserInfo>) => void;
  
  setSessions: (sessions: im_server.IChatSessionInfo[]) => void;
  updateSession: (session: im_server.IChatSessionInfo) => void;
  removeSession: (sessionId: string) => void;
  setActiveSession: (sessionId: string | null) => void;
  
  addMessage: (sessionId: string, msg: im_server.IMessageInfo) => void;
  setMessages: (sessionId: string, msgs: im_server.IMessageInfo[]) => void;
  prependMessages: (sessionId: string, msgs: im_server.IMessageInfo[]) => void;
  deleteMessage: (sessionId: string, messageId: string) => void;
  
  setFriends: (friends: im_server.IUserInfo[]) => void;
  addFriend: (friend: im_server.IUserInfo) => void;
  removeFriend: (userId: string) => void;
  
  setPendingRequests: (requests: im_server.IFriendEvent[]) => void;
  addPendingFriendRequest: (request: im_server.IFriendEvent) => void;
  removePendingFriendRequest: (eventId: string) => void;
  
  setWSStatus: (connected: boolean, reconnecting?: boolean) => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;
  
  incrementUnread: (sessionId: string) => void;
  clearUnread: (sessionId: string) => void;
}

export const useIMStore = create<IMStore>()(
  persist(
    immer((set) => ({
      currentUser: null,
      sessionId: null,
      sessions: new Map(),
      messages: new Map(),
      activeSessionId: null,
      friends: new Map(),
      pendingFriendRequests: [],
      wsConnected: false,
      wsReconnecting: false,
      wsReconnectAttempts: 0,
      unreadCount: new Map(),
      
      login: (sessionId, user) => set((state) => {
        state.sessionId = sessionId;
        state.currentUser = user;
      }),
      
      logout: () => set((state) => {
        state.sessionId = null;
        state.currentUser = null;
        state.sessions.clear();
        state.messages.clear();
        state.friends.clear();
        state.pendingFriendRequests = [];
        state.activeSessionId = null;
        state.unreadCount.clear();
      }),
      
      updateCurrentUser: (updates) => set((state) => {
        if (state.currentUser) {
          Object.assign(state.currentUser, updates);
        }
      }),
      
      setSessions: (sessions) => set((state) => {
        state.sessions.clear();
        sessions.forEach((session) => {
          if (session.chatSessionId) {
            state.sessions.set(session.chatSessionId, session);
          }
        });
      }),
      
      updateSession: (session) => set((state) => {
        if (session.chatSessionId) {
          state.sessions.set(session.chatSessionId, session);
        }
      }),
      
      removeSession: (sessionId) => set((state) => {
        state.sessions.delete(sessionId);
        state.messages.delete(sessionId);
        state.unreadCount.delete(sessionId);
        if (state.activeSessionId === sessionId) {
          state.activeSessionId = null;
        }
      }),
      
      setActiveSession: (sessionId) => set((state) => {
        state.activeSessionId = sessionId;
        if (sessionId) {
          state.unreadCount.set(sessionId, 0);
        }
      }),
      
      addMessage: (sessionId, msg) => set((state) => {
        if (!state.messages.has(sessionId)) {
          state.messages.set(sessionId, []);
        }
        state.messages.get(sessionId)!.push(msg);
        
        const session = state.sessions.get(sessionId);
        if (session) {
          session.prevMessage = msg;
        }
        
        if (state.activeSessionId !== sessionId) {
          const current = state.unreadCount.get(sessionId) || 0;
          state.unreadCount.set(sessionId, current + 1);
        }
      }),
      
      setMessages: (sessionId, msgs) => set((state) => {
        state.messages.set(sessionId, msgs);
      }),
      
      prependMessages: (sessionId, msgs) => set((state) => {
        if (!state.messages.has(sessionId)) {
          state.messages.set(sessionId, []);
        }
        state.messages.get(sessionId)!.unshift(...msgs);
      }),
      
      deleteMessage: (sessionId, messageId) => set((state) => {
        const msgs = state.messages.get(sessionId);
        if (msgs) {
          const index = msgs.findIndex((m) => m.messageId === messageId);
          if (index !== -1) {
            msgs.splice(index, 1);
          }
        }
      }),
      
      setFriends: (friends) => set((state) => {
        state.friends.clear();
        friends.forEach((friend) => {
          if (friend.userId) {
            state.friends.set(friend.userId, friend);
          }
        });
      }),
      
      addFriend: (friend) => set((state) => {
        if (friend.userId) {
          state.friends.set(friend.userId, friend);
        }
      }),
      
      removeFriend: (userId) => set((state) => {
        state.friends.delete(userId);
      }),
      
      setPendingRequests: (requests) => set((state) => {
        state.pendingFriendRequests = requests;
      }),
      
      addPendingFriendRequest: (request) => set((state) => {
        state.pendingFriendRequests.push(request);
      }),
      
      removePendingFriendRequest: (eventId) => set((state) => {
        state.pendingFriendRequests = state.pendingFriendRequests.filter(
          (r) => r.eventId !== eventId
        );
      }),
      
      setWSStatus: (connected, reconnecting = false) => set((state) => {
        state.wsConnected = connected;
        state.wsReconnecting = reconnecting;
      }),
      
      incrementReconnectAttempts: () => set((state) => {
        state.wsReconnectAttempts += 1;
      }),
      
      resetReconnectAttempts: () => set((state) => {
        state.wsReconnectAttempts = 0;
      }),
      
      incrementUnread: (sessionId) => set((state) => {
        const current = state.unreadCount.get(sessionId) || 0;
        state.unreadCount.set(sessionId, current + 1);
      }),
      
      clearUnread: (sessionId) => set((state) => {
        state.unreadCount.set(sessionId, 0);
      }),
    })),
    {
      name: 'im-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        sessionId: state.sessionId,
      }),
    }
  )
);
