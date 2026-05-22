import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router';
import { useApp } from '../context/AppContext';

// WeChat-style avatar: rounded square with gradient + initials
export function UserAvatar({
  color,
  initials,
  size = 32,
  className = '',
}: {
  color: string;
  initials: string;
  size?: number;
  className?: string;
}) {
  const radius = Math.round(size * 0.22);
  return (
    <div
      className={`flex items-center justify-center flex-shrink-0 select-none ${className}`}
      style={{
        background: color,
        width: size,
        height: size,
        borderRadius: radius,
        color: '#fff',
        fontSize: Math.round(size * 0.36),
        fontWeight: 600,
        letterSpacing: '-0.5px',
      }}
    >
      {initials.slice(0, 1)}
    </div>
  );
}

// ─── Sidebar Icons ────────────────────────────────────────────────

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

function CodeIcon({ active }: { active: boolean }) {
  const c = active ? '#07C160' : '#666';
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <polyline points="16 18 22 12 16 6" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="8 6 2 12 8 18" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="16 17 21 12 16 7" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" stroke="#888" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, currentUser, sessions, friendRequests, logout, toggleApiAnnotations, showApiAnnotations } = useApp();

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

  const totalUnread = sessions.reduce((sum, s) => sum + s.unread_count, 0);

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
      badge: friendRequests.length,
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

  if (!isLoggedIn) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden select-none" style={{ background: '#EDEDED', fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif' }}>
      {/* Icon Sidebar */}
      <div
        className="flex flex-col items-center pt-4 pb-3 flex-shrink-0"
        style={{ width: 58, background: '#2C2C2C' }}
      >
        {/* Current user avatar */}
        <button
          onClick={() => navigate('/profile')}
          className="mb-5 transition-opacity hover:opacity-80"
          title={currentUser.nickname}
        >
          <UserAvatar
            color={currentUser.avatar_color}
            initials={currentUser.avatar_initials}
            size={36}
          />
        </button>

        {/* Main nav items */}
        <div className="flex flex-col items-center gap-0.5 flex-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex items-center justify-center rounded-lg transition-colors"
                style={{
                  width: 42,
                  height: 42,
                  background: active ? 'rgba(7,193,96,0.18)' : 'transparent',
                }}
                title={item.label}
              >
                <item.Icon active={active} />
                {item.badge > 0 && (
                  <span
                    className="absolute flex items-center justify-center text-white"
                    style={{
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

        {/* Bottom actions */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            onClick={toggleApiAnnotations}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{
              width: 42,
              height: 42,
              background: showApiAnnotations ? 'rgba(7,193,96,0.18)' : 'transparent',
            }}
            title={showApiAnnotations ? '隐藏API标注' : '显示API标注'}
          >
            <CodeIcon active={showApiAnnotations} />
          </button>

          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center justify-center rounded-lg transition-colors hover:bg-white/10"
            style={{ width: 42, height: 42 }}
            title="退出登录"
          >
            <LogOutIcon />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
