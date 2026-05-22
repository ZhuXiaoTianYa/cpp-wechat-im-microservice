import { useEffect, useRef } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onConvertToText: () => void;
}

export default function ContextMenu({ x, y, onClose, onConvertToText }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        background: '#fff',
        borderRadius: 6,
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        border: '1px solid #eee',
        padding: 4,
        minWidth: 140,
        zIndex: 1000,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onConvertToText();
          onClose();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '8px 12px',
          border: 'none',
          background: 'transparent',
          color: '#333',
          fontSize: 13,
          cursor: 'pointer',
          textAlign: 'left',
          borderRadius: 4,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F5F5'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
      >
        <span style={{ fontSize: 14 }}>📝</span>
        转文字
      </button>
    </div>
  );
}
