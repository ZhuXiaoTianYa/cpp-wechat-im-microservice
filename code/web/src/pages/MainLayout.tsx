import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router';
import { useIMStore } from '@/store/useIMStore';
import { uint8ArrayToBlobURL } from '@/utils/proto-helpers';

export function UserAvatar({
  color,
  initials,
  size = 32,
  imageData,
}: {
  color: string;
  initials: string;
  size?: number;
  imageData?: Uint8Array | null;
}) {
  const radius = Math.round(size * 0.22);
  
  if (imageData && imageData.length > 0) {
    const imageUrl = uint8ArrayToBlobURL(imageData, 'image/jpeg');
    return (
      <img
        src={imageUrl}
        alt={initials}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          objectFit: 'cover',
          display: 'block',
          flexShrink: 0,
          border: 'none',
          padding: 0,
          margin: 0,
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }
  
  return (
    <div
      style={{
        background: color,
        width: size,
        height: size,
        borderRadius: radius,
        color: '#fff',
        fontSize: Math.round(size * 0.36),
        fontWeight: 600,
        letterSpacing: '-0.5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        userSelect: 'none',
        overflow: 'hidden',
        border: 'none',
        padding: 0,
        margin: 0,
      }}
    >
      {initials.slice(0, 1)}
    </div>
  );
}

function ChatIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path
        d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"
        fill={active ? '#07C160' : 'none'}
        stroke={active ? '#07C160' : '#9E9E9E'}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="11" r="1" fill={active ? '#fff' : '#9E9E9E'} />
      <circle cx="12" cy="11" r="1" fill={active ? '#fff' : '#9E9E9E'} />
      <circle cx="15.5" cy="11" r="1" fill={active ? '#fff' : '#9E9E9E'} />
    </svg>
  );
}

function ContactsIcon({ active }: { active: boolean }) {
  const c = active ? '#07C160' : '#9E9E9E';
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <circle cx="9" cy="8" r="3" stroke={c} strokeWidth="1.8" />
      <path d="M3 20c0-4 2.7-6 6-6s6 2 6 6" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 11a3 3 0 100-6" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21 20c0-3.3-1.8-5.3-5-6" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  const c = active ? '#07C160' : '#9E9E9E';
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.8" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = useIMStore((state) => state.sessionId);
  const currentUser = useIMStore((state) => state.currentUser);
  const logout = useIMStore((state) => state.logout);
  const pendingFriendRequests = useIMStore((state) => state.pendingFriendRequests);
  const unreadCount = useIMStore((state) => state.unreadCount);

  useEffect(() => {
    if (!sessionId) navigate('/login');
  }, [sessionId, navigate]);

  const totalUnread = Array.from(unreadCount.values()).reduce((sum, count) => sum + count, 0);

  const navItems = [
    {
      label: '消息',
      path: '/chat',
      badge: totalUnread,
      Icon: ChatIcon,
    },
    {
      label: '通讯录',
      path: '/contacts',
      badge: pendingFriendRequests.length,
      Icon: ContactsIcon,
    },
    {
      label: '我',
      path: '/profile',
      badge: 0,
      Icon: ProfileIcon,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/chat') return location.pathname.startsWith('/chat');
    return location.pathname.startsWith(path);
  };

  if (!sessionId) return null;

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100%', 
      overflow: 'hidden', 
      userSelect: 'none',
      background: '#EDEDED',
      fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
    }}>
      {/* Icon Sidebar */}
      <div
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 0,
          paddingBottom: 0,
          flexShrink: 0,
          width: 58,
          background: '#E3E3E8',
          borderRight: '1px solid #D1D1D6',
        }}
      >
        {/* Top bar - matches sidebar color */}
        <div style={{
          width: '100%',
          height: 40,
          background: '#E3E3E8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: 10, color: '#8E8E93' }}></span>
        </div>
        
        {/* Current user avatar */}
        <button
          onClick={() => navigate('/profile')}
          style={{ marginTop: 8, marginBottom: 16, opacity: 1, cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.8'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
          title={currentUser?.nickname ?? undefined}
        >
          <UserAvatar
            color="#07C160"
            initials={currentUser?.nickname?.charAt(0)?.toUpperCase() || '?'}
            size={40}
            imageData={currentUser?.avatar}
          />
        </button>

        {/* Main nav items */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1 }}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  width: 42,
                  height: 42,
                  background: active ? 'rgba(7,193,96,0.18)' : 'transparent',
                }}
                title={item.label}
              >
                <item.Icon active={active} />
                {item.badge > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      top: 4,
                      right: 4,
                      minWidth: 15,
                      height: 15,
                      borderRadius: 8,
                      background: '#F5222D',
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '0 3px',
                      lineHeight: 1,
                    }}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Logout button */}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            width: 42,
            height: 42,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            marginBottom: 8,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          title="退出登录"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="16 17 21 12 16 7" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="21" y1="12" x2="9" y2="12" stroke="#888" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Outlet />
      </div>
    </div>
  );
}