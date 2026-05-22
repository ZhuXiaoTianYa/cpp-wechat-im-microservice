import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  CURRENT_USER,
  MOCK_SESSIONS,
  MOCK_MESSAGES,
  MOCK_FRIENDS,
  MOCK_FRIEND_REQUESTS,
  UserInfo,
  ChatSession,
  Message,
  FriendRequest,
  MessageContent,
} from '../data/mockData';

interface AppState {
  isLoggedIn: boolean;
  currentUser: UserInfo;
  sessions: ChatSession[];
  messages: Record<string, Message[]>;
  friends: UserInfo[];
  friendRequests: FriendRequest[];
  activeSessionId: string | null;
  showApiAnnotations: boolean;
  isLoading: boolean;

  // Actions
  login: (nickname: string, sessionId: string) => void;
  logout: () => void;
  setActiveSession: (sessionId: string | null) => void;
  sendMessage: (sessionId: string, content: MessageContent) => void;
  acceptFriendRequest: (eventId: string) => void;
  rejectFriendRequest: (eventId: string) => void;
  removeFriend: (userId: string) => void;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
  createGroupSession: (name: string, memberIds: string[]) => ChatSession;
  toggleApiAnnotations: () => void;
  setIsLoading: (v: boolean) => void;
  markSessionRead: (sessionId: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserInfo>(CURRENT_USER);
  const [sessions, setSessions] = useState<ChatSession[]>(MOCK_SESSIONS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [friends, setFriends] = useState<UserInfo[]>(MOCK_FRIENDS);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(MOCK_FRIEND_REQUESTS);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showApiAnnotations, setShowApiAnnotations] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback((nickname: string, _sessionId: string) => {
    setCurrentUser((prev) => ({ ...prev, nickname }));
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setActiveSessionId(null);
  }, []);

  const setActiveSession = useCallback((sessionId: string | null) => {
    setActiveSessionId(sessionId);
    if (sessionId) {
      setSessions((prev) =>
        prev.map((s) => (s.session_id === sessionId ? { ...s, unread_count: 0 } : s))
      );
    }
  }, []);

  const sendMessage = useCallback(
    (sessionId: string, content: MessageContent) => {
      const newMsg: Message = {
        message_id: `msg_${Date.now()}`,
        session_id: sessionId,
        sender_id: currentUser.user_id,
        sender: currentUser,
        content,
        timestamp: Date.now(),
      };
      setMessages((prev) => ({
        ...prev,
        [sessionId]: [...(prev[sessionId] || []), newMsg],
      }));
      setSessions((prev) =>
        prev.map((s) =>
          s.session_id === sessionId ? { ...s, last_message: newMsg } : s
        )
      );
    },
    [currentUser]
  );

  const acceptFriendRequest = useCallback((eventId: string) => {
    const req = friendRequests.find((r) => r.event_id === eventId);
    if (req) {
      setFriends((prev) => [...prev, req.sender]);
      // Auto-create single chat session
      const newSession: ChatSession = {
        session_id: `session_${Date.now()}`,
        session_name: req.sender.nickname,
        session_type: 0,
        avatar_color: req.sender.avatar_color,
        avatar_initials: req.sender.avatar_initials,
        member_ids: [CURRENT_USER.user_id, req.sender.user_id],
        unread_count: 0,
        pinned: false,
      };
      setSessions((prev) => [newSession, ...prev]);
    }
    setFriendRequests((prev) => prev.filter((r) => r.event_id !== eventId));
  }, [friendRequests]);

  const rejectFriendRequest = useCallback((eventId: string) => {
    setFriendRequests((prev) => prev.filter((r) => r.event_id !== eventId));
  }, []);

  const removeFriend = useCallback((userId: string) => {
    setFriends((prev) => prev.filter((f) => f.user_id !== userId));
    setSessions((prev) =>
      prev.filter(
        (s) => !(s.session_type === 0 && s.member_ids.includes(userId))
      )
    );
  }, []);

  const updateUserInfo = useCallback((updates: Partial<UserInfo>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  }, []);

  const createGroupSession = useCallback(
    (name: string, memberIds: string[]): ChatSession => {
      const newSession: ChatSession = {
        session_id: `session_group_${Date.now()}`,
        session_name: name,
        session_type: 1,
        avatar_color: '#0984E3',
        avatar_initials: name.charAt(0),
        member_ids: [currentUser.user_id, ...memberIds],
        unread_count: 0,
        pinned: false,
      };
      setSessions((prev) => [newSession, ...prev]);
      return newSession;
    },
    [currentUser]
  );

  const toggleApiAnnotations = useCallback(() => {
    setShowApiAnnotations((prev) => !prev);
  }, []);

  const markSessionRead = useCallback((sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.session_id === sessionId ? { ...s, unread_count: 0 } : s))
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        sessions,
        messages,
        friends,
        friendRequests,
        activeSessionId,
        showApiAnnotations,
        isLoading,
        login,
        logout,
        setActiveSession,
        sendMessage,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend,
        updateUserInfo,
        createGroupSession,
        toggleApiAnnotations,
        setIsLoading,
        markSessionRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
