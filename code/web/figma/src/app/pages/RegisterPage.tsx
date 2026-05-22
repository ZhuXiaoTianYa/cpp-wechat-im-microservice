import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, RefreshCw, ChevronLeft } from 'lucide-react';
import { ApiTag } from '../components/common/ApiTag';

type RegisterMode = 'username' | 'phone';

function WxInput({
  placeholder,
  value,
  onChange,
  type = 'text',
  maxLength,
  onEnter,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  maxLength?: number;
  onEnter?: () => void;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
        className="w-full outline-none"
        style={{
          background: '#F7F7F7',
          border: '1px solid #EBEBEB',
          borderRadius: 8,
          padding: '12px 14px',
          fontSize: 14,
          color: '#333',
          height: 44,
          paddingRight: maxLength ? 52 : 14,
        }}
      />
      {maxLength && (
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: '#ccc', fontSize: 11 }}
        >
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<RegisterMode>('username');

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [codeSent, setCodeSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleSendCode = () => {
    if (!phone || phone.length !== 11) { setError('请输入正确的11位手机号'); return; }
    setError('');
    setCountdown(60);
    setCodeSent(true);
  };

  const handleRegister = async () => {
    setError('');
    if (mode === 'username') {
      if (!nickname || !password) { setError('请填写昵称和密码'); return; }
      if (nickname.length >= 22) { setError('昵称不能超过22个字符'); return; }
      if (!/^[a-zA-Z0-9_-]{6,15}$/.test(password)) { setError('密码需为6-15位字母、数字、下划线或短横线'); return; }
      if (password !== confirmPwd) { setError('两次输入的密码不一致'); return; }
    } else {
      if (!phone || !code) { setError('请填写手机号和验证码'); return; }
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #f0fff4 0%, #e6f7ff 50%, #f0f0f0 100%)' }}
      >
        <div
          className="text-center overflow-hidden"
          style={{ background: '#fff', width: 360, borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.12)', padding: '48px 32px' }}
        >
          <div
            className="flex items-center justify-center mx-auto mb-5"
            style={{ width: 64, height: 64, borderRadius: 32, background: '#07C160' }}
          >
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 style={{ color: '#191919', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>注册成功</h2>
          <p style={{ color: '#ABABAB', fontSize: 14, marginBottom: 24 }}>账号已创建，请返回登录</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full rounded-lg"
            style={{ background: '#07C160', color: '#fff', height: 46, fontSize: 15, fontWeight: 600 }}
          >
            前往登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(160deg, #f0fff4 0%, #e6f7ff 50%, #f0f0f0 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      <div
        className="w-full overflow-hidden"
        style={{ maxWidth: 380, background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-6 pt-6 pb-5"
          style={{ background: 'linear-gradient(160deg, #07C160, #05a050)' }}
        >
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center rounded-lg transition-opacity hover:opacity-80"
            style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }}
          >
            <ChevronLeft className="w-5 h-5" style={{ color: '#fff' }} />
          </button>
          <div>
            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>创建账号</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>加入即时通讯平台</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: '1px solid #f0f0f0' }}>
          {(['username', 'phone'] as RegisterMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className="flex-1 py-3.5 transition-colors"
              style={{
                color: mode === m ? '#07C160' : '#999',
                borderBottom: mode === m ? '2px solid #07C160' : '2px solid transparent',
                fontWeight: mode === m ? 600 : 400,
                background: 'none',
                fontSize: 14,
              }}
            >
              {m === 'username' ? '账号注册' : '手机号注册'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="px-8 py-6 space-y-3">
          {error && (
            <div
              className="rounded-lg px-3 py-2.5"
              style={{ background: '#fff2f0', color: '#d4183d', border: '1px solid #ffccc7', fontSize: 13 }}
            >
              {error}
            </div>
          )}

          {mode === 'username' ? (
            <>
              <div className="mb-1">
                <ApiTag endpoint="/service/user/username_register" params="nickname, password" />
              </div>

              <WxInput placeholder="昵称（最多22个字符）" value={nickname} onChange={setNickname} maxLength={22} />

              <div className="relative">
                <WxInput
                  placeholder="密码（6-15位字母数字）"
                  value={password}
                  onChange={setPassword}
                  type={showPwd ? 'text' : 'password'}
                />
                <button
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#bbb', background: 'none', padding: 0 }}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <WxInput
                placeholder="确认密码"
                value={confirmPwd}
                onChange={setConfirmPwd}
                type="password"
                onEnter={handleRegister}
              />

              {password && (
                <div>
                  <div className="flex gap-1 mb-1">
                    {[password.length >= 6, /[a-zA-Z]/.test(password), /[0-9]/.test(password)].map((ok, i) => (
                      <div key={i} className="h-1 flex-1 rounded-full" style={{ background: ok ? '#07C160' : '#EBEBEB' }} />
                    ))}
                  </div>
                  <p style={{ color: '#ABABAB', fontSize: 11 }}>
                    密码强度：{
                      [password.length >= 6, /[a-zA-Z]/.test(password), /[0-9]/.test(password)].filter(Boolean).length < 2 ? '弱' :
                      [password.length >= 6, /[a-zA-Z]/.test(password), /[0-9]/.test(password)].filter(Boolean).length === 2 ? '中' : '强'
                    }
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-1 flex gap-2 flex-wrap">
                <ApiTag endpoint="/service/user/get_phone_verify_code" params="phone_number" />
                <ApiTag endpoint="/service/user/phone_register" params="phone_number, verify_code_id, verify_code" />
              </div>

              <WxInput
                placeholder="手机号（11位）"
                value={phone}
                onChange={(v) => setPhone(v.replace(/\D/g, '').slice(0, 11))}
                type="tel"
              />

              <div className="flex gap-2">
                <div className="flex-1">
                  <WxInput
                    placeholder="短信验证码"
                    value={code}
                    onChange={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
                    onEnter={handleRegister}
                  />
                </div>
                <button
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                  className="rounded-lg flex-shrink-0"
                  style={{
                    background: countdown > 0 ? '#f0f0f0' : '#07C160',
                    color: countdown > 0 ? '#aaa' : '#fff',
                    fontSize: 13,
                    padding: '0 14px',
                    height: 44,
                    minWidth: 110,
                  }}
                >
                  {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
                </button>
              </div>

              {codeSent && (
                <p style={{ color: '#07C160', fontSize: 12 }}>✓ 验证码已发送至 {phone}</p>
              )}
            </>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full rounded-lg transition-opacity"
            style={{
              background: '#07C160',
              color: '#fff',
              height: 46,
              fontSize: 15,
              fontWeight: 600,
              opacity: loading ? 0.75 : 1,
              marginTop: 4,
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> 注册中...
              </span>
            ) : '注 册'}
          </button>

          <div className="text-center">
            <span style={{ color: '#888', fontSize: 13 }}>已有账号？</span>
            <Link to="/login" style={{ color: '#07C160', fontSize: 13, marginLeft: 4 }}>
              立即登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
