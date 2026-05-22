import { createBrowserRouter, Navigate } from 'react-router';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainLayout from './pages/MainLayout';
import ChatPage from './pages/ChatPage';
import ContactsPage from './pages/ContactsPage';
import ProfilePage from './pages/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/register',
    Component: RegisterPage,
  },
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/chat" replace />,
      },
      {
        path: 'chat',
        Component: ChatPage,
      },
      {
        path: 'chat/:id',
        Component: ChatPage,
      },
      {
        path: 'contacts',
        Component: ContactsPage,
      },
      {
        path: 'profile',
        Component: ProfilePage,
      },
    ],
  },
]);
