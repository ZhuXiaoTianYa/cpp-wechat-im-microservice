/**
 * 修改手机号弹窗组件 - 微信风格
 */
import { useState, useEffect } from 'react';
import { X, Phone, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { getPhoneVerifyCode, setUserPhoneNumber } from '@/api/user';
import { handleAPIError } from '@/utils/error-handler';

interface ChangePhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  currentPhone: string;
  onSuccess: () => void;
}

export function ChangePhoneModal({ isOpen, onClose, sessionId, currentPhone, onSuccess }: ChangePhoneModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyCodeId, setVerifyCodeId] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhoneNumber('');
      setVerifyCode('');
      setVerifyCodeId('');
      setCountdown(0);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendCode = async () => {
    if (!phoneNumber || phoneNumber.length !== 11) {
      toast.error('请输入正确的11位手机号');
      return;
    }

    setSendingCode(true);
    try {
      const rsp = await getPhoneVerifyCode(phoneNumber);
      if (rsp.success) {
        setVerifyCodeId(rsp.verifyCodeId || '');
        setCountdown(60);
        toast.success('验证码已发送');
      } else {
        toast.error(rsp.errmsg || '发送验证码失败');
      }
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async () => {
    if (!phoneNumber || phoneNumber.length !== 11) {
      toast.error('请输入正确的11位手机号');
      return;
    }

    if (!verifyCode || verifyCode.length !== 6) {
      toast.error('请输入6位验证码');
      return;
    }

    setLoading(true);
    try {
      const rsp = await setUserPhoneNumber(sessionId, phoneNumber, verifyCodeId, verifyCode);
      if (rsp.success) {
        toast.success('手机号修改成功');
        onSuccess();
        onClose();
      } else {
        toast.error(rsp.errmsg || '修改手机号失败');
      }
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 360,
          background: '#fff',
          borderRadius: 16,
          overflow: 'hidden',
          animation: 'modalFadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 16,
            paddingBottom: 16,
            borderBottom: '1px solid #F5F5F5',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              left: 16,
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
            }}
          >
            <X style={{ width: 20, height: 20, color: '#999' }} />
          </button>
          <span style={{ color: '#191919', fontSize: 16, fontWeight: 600 }}>修改手机号</span>
        </div>

        {/* Content */}
        <div style={{ padding: 24 }}>
          {/* Current phone hint */}
          {currentPhone && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: 12,
                background: '#FFFBEB',
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <Phone style={{ width: 14, height: 14, color: '#D97706' }} />
              <span style={{ color: '#92400E', fontSize: 13 }}>当前手机号：{currentPhone}</span>
            </div>
          )}

          {/* Phone input */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: '#666', fontSize: 13, marginBottom: 8 }}>
              新手机号
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                setPhoneNumber(value);
              }}
              placeholder="请输入新手机号"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 16px',
                border: '1px solid #E5E5EA',
                borderRadius: 10,
                fontSize: 14,
                color: '#191919',
                background: '#FAFAFA',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = '#07C160';
                (e.target as HTMLInputElement).style.background = '#fff';
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = '#E5E5EA';
                (e.target as HTMLInputElement).style.background = '#FAFAFA';
              }}
            />
          </div>

          {/* Verify code input */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', color: '#666', fontSize: 13, marginBottom: 8 }}>
              验证码
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              <input
                type="tel"
                value={verifyCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setVerifyCode(value);
                }}
                placeholder="请输入验证码"
                style={{
                  flex: 1,
                  boxSizing: 'border-box',
                  padding: '12px 16px',
                  border: '1px solid #E5E5EA',
                  borderRadius: 10,
                  fontSize: 14,
                  color: '#191919',
                  background: '#FAFAFA',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = '#07C160';
                  (e.target as HTMLInputElement).style.background = '#fff';
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = '#E5E5EA';
                  (e.target as HTMLInputElement).style.background = '#FAFAFA';
                }}
              />
              <button
                onClick={handleSendCode}
                disabled={countdown > 0 || sendingCode || phoneNumber.length !== 11}
                style={{
                  paddingLeft: 16,
                  paddingRight: 16,
                  borderRadius: 10,
                  fontSize: 14,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: countdown > 0 ? '#F5F5F5' : '#07C160',
                  color: countdown > 0 ? '#999' : '#fff',
                }}
              >
                {countdown > 0 ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock style={{ width: 14, height: 14 }} />
                    {countdown}s
                  </span>
                ) : (
                  '获取验证码'
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !phoneNumber || !verifyCode || !verifyCodeId}
            style={{
              width: '100%',
              paddingTop: 14,
              paddingBottom: 14,
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: loading ? '#A0E75A' : '#07C160',
              color: '#fff',
              opacity: loading || !phoneNumber || !verifyCode || !verifyCodeId ? 0.6 : 1,
            }}
          >
            {loading ? '提交中...' : '确认修改'}
          </button>
        </div>
      </div>
    </div>
  );
}
