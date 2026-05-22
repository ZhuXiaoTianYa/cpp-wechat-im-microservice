import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { usernameLogin, phoneLogin, getPhoneVerifyCode, getUserInfo } from '@/api/user';
import { useIMStore } from '@/store/useIMStore';
import { imWebSocket } from '@/services/websocket';
import { handleAPIError } from '@/utils/error-handler';
import { MessageSquare, RefreshCw } from 'lucide-react';
import { im_server } from '@/proto/generated';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'username' | 'phone'>('username');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyCodeId, setVerifyCodeId] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaImage, setCaptchaImage] = useState<string | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 40;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#f7f7f7';
    ctx.fillRect(0, 0, 120, 40);
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#333';
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.translate(20 + i * 25, 25);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.3)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 120, Math.random() * 40);
      ctx.lineTo(Math.random() * 120, Math.random() * 40);
      ctx.stroke();
    }
    setCaptchaAnswer(code);
    setCaptchaImage(canvas.toDataURL());
  };

  const handleGetVerifyCode = async () => {
    if (!phoneNumber || !/^1[3-9]\d{9}$/.test(phoneNumber)) {
      toast.error('请输入正确的手机号');
      return;
    }
    if (!captchaCode || captchaCode.toUpperCase() !== captchaAnswer) {
      toast.error('图形验证码错误');
      return;
    }
    try {
      const rsp = await getPhoneVerifyCode(phoneNumber);
      if (rsp.verifyCodeId) {
        setVerifyCodeId(rsp.verifyCodeId);
      }
      toast.success('验证码已发送');
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(handleAPIError(error));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaCode || captchaCode.toUpperCase() !== captchaAnswer) {
      toast.error('图形验证码错误');
      generateCaptcha();
      setCaptchaCode('');
      return;
    }
    if (loginType === 'username' && (!nickname || !password)) {
      toast.error('请填写完整信息');
      return;
    }
    if (loginType === 'phone' && (!phoneNumber || !verifyCode)) {
      toast.error('请填写完整信息');
      return;
    }
    setLoading(true);
    try {
      const response = loginType === 'username' 
        ? await usernameLogin(nickname, password, '', captchaCode)
        : await phoneLogin(phoneNumber, verifyCodeId, verifyCode);
      const sessionId = response.loginSessionId;
      const userInfoResponse = await getUserInfo(sessionId);
      useIMStore.getState().login(sessionId, userInfoResponse.userInfo || {} as im_server.IUserInfo);
      imWebSocket.connect(sessionId);
      toast.success('登录成功');
      navigate('/app/chat');
    } catch (error) {
      toast.error(handleAPIError(error));
      generateCaptcha();
      setCaptchaCode('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      {/* 顶部 Logo */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #07C160 0%, #06AD56 100%)',
          boxShadow: '0 4px 12px rgba(7, 193, 96, 0.3)'
        }}>
          <MessageSquare style={{ width: '22px', height: '22px', color: '#ffffff' }} />
        </div>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1A1A1A' }}>IM</span>
      </div>

      {/* 主卡片 */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        padding: '35px'
      }}>
        {/* 标题 */}
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '8px', textAlign: 'center' }}>欢迎登录</h2>
        <p style={{ fontSize: '14px', color: '#666666', marginBottom: '30px', textAlign: 'center' }}>登录后可开始聊天</p>

        {/* 登录方式切换 */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{
            display: 'flex',
            background: '#F8F9FA',
            borderRadius: '10px',
            padding: '3px'
          }}>
            <button
              type="button"
              onClick={() => setLoginType('username')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                backgroundColor: loginType === 'username' ? '#ffffff' : 'transparent',
                color: loginType === 'username' ? '#07C160' : '#666666',
                boxShadow: loginType === 'username' ? '0 2px 6px rgba(0, 0, 0, 0.06)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              账号登录
            </button>
            <button
              type="button"
              onClick={() => setLoginType('phone')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                backgroundColor: loginType === 'phone' ? '#ffffff' : 'transparent',
                color: loginType === 'phone' ? '#07C160' : '#666666',
                boxShadow: loginType === 'phone' ? '0 2px 6px rgba(0, 0, 0, 0.06)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              手机登录
            </button>
          </div>
        </div>

        {/* 表单区域 */}
        <form onSubmit={handleLogin}>
          {/* 用户名输入框 */}
          {loginType === 'username' && (
            <>
              <div style={{ marginBottom: '18px' }}>
                <label htmlFor="login-username" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#333333',
                  marginBottom: '8px'
                }}>用户名</label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="请输入用户名"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #E5E5E5',
                    backgroundColor: '#FAFAFA',
                    fontSize: '14px',
                    color: '#333333',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#07C160';
                    e.target.style.boxShadow = '0 0 0 3px rgba(7, 193, 96, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E5E5';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label htmlFor="login-password" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#333333',
                  marginBottom: '8px'
                }}>密码</label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #E5E5E5',
                    backgroundColor: '#FAFAFA',
                    fontSize: '14px',
                    color: '#333333',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#07C160';
                    e.target.style.boxShadow = '0 0 0 3px rgba(7, 193, 96, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E5E5';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </>
          )}

          {/* 手机号登录 */}
          {loginType === 'phone' && (
            <>
              <div style={{ marginBottom: '18px' }}>
                <label htmlFor="login-phone" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#333333',
                  marginBottom: '8px'
                }}>手机号</label>
                <input
                  id="login-phone"
                  name="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="请输入11位手机号"
                  maxLength={11}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #E5E5E5',
                    backgroundColor: '#FAFAFA',
                    fontSize: '14px',
                    color: '#333333',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#07C160';
                    e.target.style.boxShadow = '0 0 0 3px rgba(7, 193, 96, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E5E5';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label htmlFor="login-verify-code" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#333333',
                  marginBottom: '8px'
                }}>短信验证码</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    id="login-verify-code"
                    name="verifyCode"
                    type="text"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    placeholder="请输入验证码"
                    maxLength={6}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #E5E5E5',
                      backgroundColor: '#FAFAFA',
                      fontSize: '14px',
                      color: '#333333',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#07C160';
                      e.target.style.boxShadow = '0 0 0 3px rgba(7, 193, 96, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E5E5E5';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleGetVerifyCode}
                    disabled={countdown > 0}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                      background: countdown > 0 ? '#F0F0F0' : 'linear-gradient(135deg, #07C160 0%, #06AD56 100%)',
                      color: countdown > 0 ? '#999999' : '#ffffff',
                      boxShadow: countdown > 0 ? 'none' : '0 4px 12px rgba(7, 193, 96, 0.3)',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {countdown > 0 ? `${countdown}秒` : '获取验证码'}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* 图形验证码 */}
          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="login-captcha" style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              color: '#333333',
              marginBottom: '8px'
            }}>图形验证码</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                id="login-captcha"
                name="captcha"
                type="text"
                value={captchaCode}
                onChange={(e) => setCaptchaCode(e.target.value)}
                placeholder="请输入验证码"
                maxLength={4}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #E5E5E5',
                  backgroundColor: '#FAFAFA',
                  fontSize: '14px',
                  color: '#333333',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#07C160';
                  e.target.style.boxShadow = '0 0 0 3px rgba(7, 193, 96, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E5E5';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={{ position: 'relative' }}>
                {captchaImage && (
                  <img
                    src={captchaImage}
                    alt="验证码"
                    onClick={generateCaptcha}
                    style={{
                      height: '46px',
                      width: '110px',
                      borderRadius: '10px',
                      border: '1px solid #E5E5E5',
                      cursor: 'pointer'
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={generateCaptcha}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'linear-gradient(135deg, #07C160 0%, #06AD56 100%)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(7, 193, 96, 0.3)'
                  }}
                >
                  <RefreshCw style={{ width: '12px', height: '12px' }} />
                </button>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#999999', marginTop: '6px' }}>点击图片刷新</p>
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? '#E5E5E5' : 'linear-gradient(135deg, #07C160 0%, #06AD56 100%)',
              color: '#ffffff',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(7, 193, 96, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}></span>
                登录中...
              </span>
            ) : '登 录'}
          </button>
        </form>

        {/* 注册链接 */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #F0F0F0'
        }}>
          <span style={{ fontSize: '14px', color: '#666666' }}>还没有账号？</span>
          <button
            type="button"
            onClick={() => navigate('/register')}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '14px',
              fontWeight: 500,
              color: '#07C160',
              cursor: 'pointer',
              marginLeft: '4px'
            }}
          >
            立即注册
          </button>
        </div>
      </div>
    </div>
  );
}
