import React, { useState, useRef } from 'react';
import {
  ChevronRight, X, Camera, Smartphone, RefreshCw, User, FileText, Shield, Edit2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from './MainLayout';
import { ApiTag } from '../components/common/ApiTag';

type EditField = 'nickname' | 'description' | 'phone' | null;

// ─── Edit Modal ───────────────────────────────────────────────────
function EditModal({
  field,
  currentValue,
  onSave,
  onClose,
  showApiAnnotations,
}: {
  field: EditField;
  currentValue: string;
  onSave: (value: string) => void;
  onClose: () => void;
  showApiAnnotations: boolean;
}) {
  const [value, setValue] = useState(currentValue);
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const configs: Record<string, { label: string; endpoint: string; params: string; placeholder: string; maxLength?: number }> = {
    nickname: { label: '修改昵称', endpoint: '/service/user/set_nickname', params: 'session_id, nickname', placeholder: '输入新昵称', maxLength: 22 },
    description: { label: '修改个性签名', endpoint: '/service/user/set_description', params: 'session_id, description', placeholder: '输入个性签名', maxLength: 100 },
    phone: { label: '修改手机号', endpoint: '/service/user/set_phone', params: 'session_id, phone_number, phone_verify_code_id, phone_verify_code', placeholder: '输入新手机号' },
  };

  if (!field) return null;
  const config = configs[field];

  const handleSendCode = () => {
    if (!value || value.length !== 11) { setError('请输入正确的手机号'); return; }
    setError('');
    setCountdown(60);
    setCodeSent(true);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleSave = async () => {
    if (!value.trim()) { setError('请填写内容'); return; }
    if (field === 'phone' && !code) { setError('请输入验证码'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    onSave(value.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}
    >
      <div
        className="overflow-hidden"
        style={{ background: '#fff', width: 400, borderRadius: 12, boxShadow: '0 12px 48px rgba(0,0,0,0.18)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #f0f0f0' }}
        >
          <h3 style={{ color: '#191919', fontSize: 15, fontWeight: 600 }}>{config.label}</h3>
          <button onClick={onClose} style={{ color: '#999', background: 'none', padding: 0 }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {showApiAnnotations && (
            <ApiTag endpoint={config.endpoint} params={config.params} />
          )}
          {error && (
            <div
              className="rounded-lg px-3 py-2"
              style={{ background: '#fff2f0', color: '#d4183d', border: '1px solid #ffccc7', fontSize: 13 }}
            >
              {error}
            </div>
          )}

          <div className="relative">
            <input
              type={field === 'phone' ? 'tel' : 'text'}
              value={value}
              onChange={(e) => {
                const v = field === 'phone'
                  ? e.target.value.replace(/\D/g, '').slice(0, 11)
                  : e.target.value.slice(0, config.maxLength || 200);
                setValue(v);
                setError('');
              }}
              placeholder={config.placeholder}
              className="w-full outline-none"
              style={{
                background: '#F7F7F7',
                border: '1px solid #EBEBEB',
                borderRadius: 8,
                padding: '12px 14px',
                fontSize: 14,
                color: '#333',
                paddingRight: config.maxLength ? 56 : 14,
              }}
              autoFocus
            />
            {config.maxLength && (
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: value.length >= (config.maxLength - 5) ? '#F5222D' : '#ccc', fontSize: 11 }}
              >
                {value.length}/{config.maxLength}
              </span>
            )}
          </div>

          {field === 'phone' && (
            <>
              {showApiAnnotations && (
                <ApiTag endpoint="/service/user/get_phone_verify_code" params="phone_number" />
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="短信验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="flex-1 outline-none"
                  style={{ background: '#F7F7F7', border: '1px solid #EBEBEB', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: '#333' }}
                />
                <button
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                  className="rounded-lg"
                  style={{
                    background: countdown > 0 ? '#f0f0f0' : '#07C160',
                    color: countdown > 0 ? '#aaa' : '#fff',
                    fontSize: 13,
                    padding: '0 14px',
                    minWidth: 110,
                    height: 46,
                  }}
                >
                  {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
                </button>
              </div>
              {codeSent && (
                <p style={{ color: '#07C160', fontSize: 12 }}>验证码已发送至 {value}</p>
              )}
            </>
          )}
        </div>

        <div className="px-5 py-4 flex gap-3" style={{ borderTop: '1px solid #f0f0f0' }}>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg"
            style={{ background: '#f0f0f0', color: '#666', height: 40, fontSize: 14 }}
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 rounded-lg"
            style={{ background: '#07C160', color: '#fff', height: 40, fontSize: 14, fontWeight: 500 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> 保存中
              </span>
            ) : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Row ──────────────────────────────────────────────────
function ProfileRow({
  icon: Icon,
  iconBg,
  label,
  value,
  onClick,
  showApiAnnotations,
  endpoint,
  params,
  last = false,
}: {
  icon: (p: { className?: string; style?: React.CSSProperties }) => JSX.Element;
  iconBg: string;
  label: string;
  value: string;
  onClick?: () => void;
  showApiAnnotations?: boolean;
  endpoint?: string;
  params?: string;
  last?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-5 py-3.5 transition-colors"
      style={{
        borderBottom: last ? 'none' : '1px solid #F5F5F5',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => {
        if (onClick) (e.currentTarget as HTMLDivElement).style.background = '#FAFAFA';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = '#fff';
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 32, height: 32, borderRadius: 8, background: iconBg }}
        >
          <Icon className="w-4 h-4" style={{ color: '#fff' }} />
        </div>
        <span style={{ color: '#333', fontSize: 14 }}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {showApiAnnotations && endpoint && (
          <ApiTag endpoint={endpoint} params={params || ''} />
        )}
        <span className="truncate" style={{ color: '#ABABAB', fontSize: 13, maxWidth: 200 }}>{value}</span>
        {onClick && <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: '#D9D9D9' }} />}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { currentUser, updateUserInfo, showApiAnnotations } = useApp();
  const [editField, setEditField] = useState<EditField>(null);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = (field: EditField) => (value: string) => {
    if (field === 'nickname') updateUserInfo({ nickname: value, avatar_initials: value.charAt(0) });
    if (field === 'description') updateUserInfo({ description: value });
    if (field === 'phone') updateUserInfo({ phone: value });
    setEditField(null);
  };

  const handleAvatarChange = async () => {
    setAvatarSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setAvatarSaving(false);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left sidebar */}
      <div
        className="flex flex-col flex-shrink-0"
        style={{ width: 280, background: '#EBE9E9', borderRight: '1px solid #D9D9D9' }}
      >
        {/* Title */}
        <div
          className="flex items-center px-4 pt-4 pb-2"
          style={{ minHeight: 54 }}
        >
          <span style={{ color: '#191919', fontSize: 16, fontWeight: 600 }}>我</span>
        </div>

        {/* Avatar + info */}
        <div className="flex flex-col items-center py-8 px-6">
          <div className="relative mb-4">
            <UserAvatar
              color={currentUser.avatar_color}
              initials={currentUser.avatar_initials}
              size={80}
            />
            <button
              onClick={() => { fileRef.current?.click(); handleAvatarChange(); }}
              className="absolute -bottom-1 -right-1 flex items-center justify-center border-2 border-white rounded-full transition-opacity hover:opacity-90"
              style={{ width: 28, height: 28, background: '#07C160' }}
              title="修改头像"
            >
              {avatarSaving
                ? <RefreshCw className="w-3 h-3 animate-spin" style={{ color: '#fff' }} />
                : <Camera className="w-3 h-3" style={{ color: '#fff' }} />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" />
          </div>

          {showApiAnnotations && (
            <div className="mb-2">
              <ApiTag endpoint="/service/user/set_avatar" params="session_id, avatar(bytes)" />
            </div>
          )}

          <h2 style={{ color: '#191919', fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
            {currentUser.nickname}
          </h2>
          <p style={{ color: '#ABABAB', fontSize: 12, textAlign: 'center' }}>
            {currentUser.description || '暂未设置个性签名'}
          </p>
        </div>

        {/* Stats */}
        <div
          className="mx-4 rounded-xl p-4 grid grid-cols-3 mb-4"
          style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          {[
            { label: '好友', value: '6' },
            { label: '群聊', value: '2' },
            { label: '消息', value: '128' },
          ].map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center" style={{ borderRight: i < 2 ? '1px solid #F0F0F0' : 'none' }}>
              <span style={{ color: '#191919', fontSize: 18, fontWeight: 600 }}>{stat.value}</span>
              <span style={{ color: '#ABABAB', fontSize: 11 }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {showApiAnnotations && (
          <div className="px-4 mb-2">
            <ApiTag endpoint="/service/user/get_user_info" params="session_id" />
          </div>
        )}

        <div className="px-4 space-y-1">
          <p style={{ color: '#BEBEBE', fontSize: 11 }}>ID: {currentUser.user_id}</p>
          <p style={{ color: '#BEBEBE', fontSize: 11 }}>手机: {currentUser.phone}</p>
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 overflow-y-auto" style={{ background: '#F7F7F7' }}>
        <div className="max-w-2xl mx-auto py-6 px-6">
          <h2 style={{ color: '#191919', fontSize: 15, fontWeight: 600, marginBottom: 12 }}>个人资料</h2>

          <div
            className="rounded-xl overflow-hidden mb-5"
            style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <ProfileRow
              icon={User}
              iconBg="#07C160"
              label="昵称"
              value={currentUser.nickname}
              onClick={() => setEditField('nickname')}
              showApiAnnotations={showApiAnnotations}
              endpoint="/service/user/set_nickname"
              params="session_id, nickname"
            />
            <ProfileRow
              icon={FileText}
              iconBg="#74B9FF"
              label="个性签名"
              value={currentUser.description || '暂未设置'}
              onClick={() => setEditField('description')}
              showApiAnnotations={showApiAnnotations}
              endpoint="/service/user/set_description"
              params="session_id, description"
            />
            <ProfileRow
              icon={Smartphone}
              iconBg="#FDCB6E"
              label="手机号"
              value={currentUser.phone}
              onClick={() => setEditField('phone')}
              showApiAnnotations={showApiAnnotations}
              endpoint="/service/user/set_phone"
              params="session_id, phone_number, phone_verify_code_id, phone_verify_code"
              last
            />
          </div>

          <h2 style={{ color: '#191919', fontSize: 15, fontWeight: 600, marginBottom: 12 }}>账号安全</h2>

          <div
            className="rounded-xl overflow-hidden mb-5"
            style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <div
              className="flex items-center justify-between px-5 py-3.5"
              style={{ borderBottom: '1px solid #F5F5F5' }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 8, background: '#FF7675' }}>
                  <Shield className="w-4 h-4" style={{ color: '#fff' }} />
                </div>
                <span style={{ color: '#333', fontSize: 14 }}>账号保护</span>
              </div>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{ background: '#F6FFED', color: '#52C41A', border: '1px solid #B7EB8F', fontSize: 11 }}
              >
                已开启
              </span>
            </div>

            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 8, background: '#6C5CE7' }}>
                  <Edit2 className="w-4 h-4" style={{ color: '#fff' }} />
                </div>
                <span style={{ color: '#333', fontSize: 14 }}>登录密码</span>
              </div>
              <div className="flex items-center gap-1">
                <span style={{ color: '#ABABAB', fontSize: 13 }}>已设置</span>
                <ChevronRight className="w-4 h-4" style={{ color: '#D9D9D9' }} />
              </div>
            </div>
          </div>

          {/* System info */}
          <div
            className="rounded-xl p-4 space-y-1"
            style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <p style={{ color: '#ABABAB', fontSize: 12 }}>即时通讯系统 v1.0.0</p>
            <p style={{ color: '#ABABAB', fontSize: 12 }}>API：http://211.159.146.107:9000</p>
            <p style={{ color: '#ABABAB', fontSize: 12 }}>WebSocket：ws://211.159.146.107:9001</p>
            <p style={{ color: '#ABABAB', fontSize: 12 }}>协议：HTTP + Protobuf / WebSocket + Protobuf</p>
          </div>
        </div>
      </div>

      {editField && (
        <EditModal
          field={editField}
          currentValue={
            editField === 'nickname' ? currentUser.nickname :
            editField === 'description' ? currentUser.description :
            currentUser.phone
          }
          onSave={handleSave(editField)}
          onClose={() => setEditField(null)}
          showApiAnnotations={showApiAnnotations}
        />
      )}
    </div>
  );
}
