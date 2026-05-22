import { Users, UserPlus, Scan, Settings } from 'lucide-react';

interface PlusMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onSelect: (action: string) => void;
}

export default function PlusMenu({ x, y, onClose, onSelect }: PlusMenuProps) {
  const menuItems = [
    { id: 'createGroup', icon: Users, label: '发起群聊', color: '#07C160' },
    { id: 'addFriend', icon: UserPlus, label: '添加朋友', color: '#1890FF' },
    { id: 'scan', icon: Scan, label: '扫一扫', color: '#52C41A' },
    { id: 'settings', icon: Settings, label: '设置', color: '#666' },
  ];

  const handleClick = (action: string) => {
    onSelect(action);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          padding: 4,
          minWidth: 160,
          animation: 'fadeIn 0.15s ease-out',
        }}
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 4,
              color: '#333',
              fontSize: 14,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F5F5'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <item.icon style={{ width: 18, height: 18, color: item.color }} />
            <span>{item.label}</span>
          </button>
        ))}
        
        <div style={{ height: 1, background: '#E8E8E8', margin: '4px 0' }} />
        
        <button
          onClick={() => handleClick('cancel')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 4,
            color: '#999',
            fontSize: 14,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F5F5'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          取消
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
