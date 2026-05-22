import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApiTag } from '../components/common/ApiTag';

type LoginMode = 'username' | 'phone';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useApp();
  const [mode, setMode] = useState<LoginMode>('username');

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaText] = useState('K8mP');

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [codeSent, setCodeSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoggedIn) navigate('/chat');
  }, [isLoggedIn, navigate]);

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

  const handleLogin = async () => {
    setError('');
    if (mode === 'username') {
      if (!nickname || !password) { setError('请填写账号和密码'); return; }
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      setLoading(false);
      login(nickname, 'mock_session');
      navigate('/chat');
    } else {
      if (!phone || !code) { setError('请填写手机号和验证码'); return; }
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      setLoading(false);
      login('手机用户', 'mock_session');
      navigate('/chat');
    }
  };

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
        style={{
          maxWidth: 380,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
        }}
      >
        {/* WeChat-style header */}
        <div
          className="flex flex-col items-center pt-10 pb-8"
          style={{ background: 'linear-gradient(160deg, #07C160, #05a050)' }}
        >
          {/* WeChat logo SVG */}
          <div
            className="flex items-center justify-center mb-4"
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: 'rgba(255,255,255,0.25)',
            }}
          >
            <svg viewBox="0 0 50 50" width="44" height="44" fill="none">
              {/* Two chat bubbles */}
              <ellipse cx="18" cy="20" rx="12" ry="10" fill="white" />
              <ellipse cx="34" cy="18" rx="12" ry="10" fill="rgba(255,255,255,0.75)" />
              {/* Eyes on left bubble */}
              <circle cx="14" cy="19" r="2.2" fill="#07C160" />
              <circle cx="22" cy="19" r="2.2" fill="#07C160" />
              {/* Eyes on right bubble */}
              <circle cx="30" cy="17" r="2.2" fill="#06AD56" />
              <circle cx="38" cy="17" r="2.2" fill="#06AD56" />
            </svg>
          </div>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>
            即时通讯
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 }}>
            安全 · 快速 · 可靠
          </p>
        </div>

        {/* Mode tabs */}
        <div className="flex" style={{ borderBottom: '1px solid #f0f0f0' }}>
          {(['username', 'phone'] as LoginMode[]).map((m) => (
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
              {m === 'username' ? '账号登录' : '手机号登录'}
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
                <ApiTag endpoint="/service/user/username_login" params="nickname, password, verify_code_id, verify_code" />
              </div>

              <WxInput
                placeholder="昵称（用户名）"
                value={nickname}
                onChange={setNickname}
              />

              <div className="relative">
                <WxInput
                  placeholder="密码（6-15位字母数字）"
                  value={password}
                  onChange={setPassword}
                  type={showPwd ? 'text' : 'password'}
                  onEnter={handleLogin}
                />
                <button
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#bbb', background: 'none', padding: 0 }}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Captcha */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <WxInput
                    placeholder="图形验证码"
                    value={captcha}
                    onChange={setCaptcha}
                  />
                </div>
                <div
                  className="flex items-center justify-center rounded-lg cursor-pointer select-none flex-shrink-0"
                  style={{
                    background: '#1C1C1C',
                    color: '#95EC69',
                    fontFamily: 'monospace',
                    fontSize: 20,
                    letterSpacing: 6,
                    fontWeight: 700,
                    width: 110,
                    height: 44,
                    textDecoration: 'line-through',
                    textDecorationColor: 'rgba(149,236,105,0.5)',
                  }}
                >
                  {captchaText}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-1 flex gap-2 flex-wrap">
                <ApiTag endpoint="/service/user/get_phone_verify_code" params="phone_number" />
                <ApiTag endpoint="/service/user/phone_login" params="phone_number, verify_code_id, verify_code" />
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
                    onEnter={handleLogin}
                  />
                </div>
                <button
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                  className="rounded-lg transition-colors flex-shrink-0"
                  style={{
                    background: countdown > 0 ? '#f0f0f0' : '#07C160',
                    color: countdown > 0 ? '#aaa' : '#fff',
                    fontSize: 13,
                    padding: '0 14px',
                    height: 44,
                    whiteSpace: 'nowrap',
                    minWidth: 110,
                  }}
                >
                  {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
                </button>
              </div>
              {codeSent && (
                <p style={{ color: '#07C160', fontSize: 12 }}>
                  验证码已发送至 {phone}，请查收
                </p>
              )}
            </>
          )}

          <button
            onClick={handleLogin}
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
                <RefreshCw className="w-4 h-4 animate-spin" />
                登录中...
              </span>
            ) : '登 录'}
          </button>

          <div className="flex justify-between items-center pt-1">
            <Link to="/register" style={{ color: '#07C160', fontSize: 13 }}>
              注册新账号
            </Link>
            <span style={{ color: '#ABABAB', fontSize: 13, cursor: 'pointer' }}>
              忘记密码
            </span>
          </div>
        </div>

        <div className="text-center pb-5" style={{ color: '#BEBEBE', fontSize: 11 }}>
          登录即表示同意《用户服务协议》和《隐私政策》
        </div>
      </div>
    </div>
  );
}

function WxInput({
  placeholder,
  value,
  onChange,
  type = 'text',
  onEnter,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  onEnter?: () => void;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
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
      }}
    />
  );
}
