/**
 * 应用入口组件
 */
import { BrowserRouter } from 'react-router';
import { Toaster } from 'sonner';
import AppRoutes from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}
