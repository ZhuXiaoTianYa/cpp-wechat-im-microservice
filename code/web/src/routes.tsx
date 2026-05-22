/**
 * 路由配置
 */
import { Routes, Route, Navigate } from 'react-router';
import { useIMStore } from '@/store/useIMStore';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import MainLayout from '@/pages/MainLayout';
import ChatPage from '@/pages/ChatPage';
import ContactsPage from '@/pages/ContactsPage';
import ProfilePage from '@/pages/ProfilePage';

export default function AppRoutes() {
  const sessionId = useIMStore((state) => state.sessionId);
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* 默认首页重定向到登录页 */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      <Route
        path="/app"
        element={sessionId ? <MainLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="/app/chat" />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="chat/:id" element={<ChatPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
