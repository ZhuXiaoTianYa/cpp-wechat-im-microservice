/**
 * 微信风格确认对话框组件 - WeUI Kit 风格
 */

interface ConfirmDialogProps {
  title: string;
  avatar?: React.ReactNode;
  subtitle?: string;
  showCleanMessage?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  avatar,
  subtitle,
  showCleanMessage = true,
  confirmText = '删除',
  cancelText = '取消',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)',
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        style={{
          borderRadius: 12,
          background: '#FFFFFF',
          width: 320,
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}
      >
        {/* 内容区域 */}
        <div style={{ padding: '24px 24px 20px', textAlign: 'center' }}>
          {/* 标题 */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ color: '#191919', fontSize: 17, fontWeight: 500 }}>
              {title}
            </span>
          </div>

          {/* 头像 */}
          {avatar && (
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
              {avatar}
            </div>
          )}

          {/* 副标题（昵称） */}
          {subtitle && (
            <div style={{ marginBottom: 20 }}>
              <span style={{ color: '#999', fontSize: 14 }}>
                {subtitle}
              </span>
            </div>
          )}

          {/* 清空聊天记录提示 */}
          {showCleanMessage && (
            <div style={{
              textAlign: 'center',
              color: '#999',
              fontSize: 12,
            }}>
              <span>删除聊天后，聊天记录也将被清空。</span>
            </div>
          )}
        </div>

        {/* 按钮区域 */}
        <div style={{
          display: 'flex',
          borderTop: '1px solid #EEEEEE',
        }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              height: 56,
              borderRadius: 0,
              background: '#F7F7F7',
              color: '#191919',
              fontSize: 16,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EFEFEF'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F7F7F7'; }}
          >
            {cancelText}
          </button>
          <div style={{ width: '1px', background: '#EEEEEE' }} />
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              height: 56,
              borderRadius: 0,
              background: '#FFFFFF',
              color: '#FF4D4F',
              fontSize: 16,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF5F5'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF'; }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}