import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { usernameRegister, phoneRegister, getPhoneVerifyCode } from '@/api/user';
import { handleAPIError } from '@/utils/error-handler';
import { MessageSquare, RefreshCw } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [registerType, setRegisterType] = useState<'username' | 'phone'>('username');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      toast.error('请输入正确的图形验证码');
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

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 6 || pwd.length > 15) {
      return '密码长度需为6-15位';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(pwd)) {
      return '密码只能包含字母、数字、下划线、短横线';
    }
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 仅在手机注册时验证图形验证码
    if (registerType === 'phone') {
      if (!captchaCode || captchaCode.toUpperCase() !== captchaAnswer) {
        toast.error('图形验证码错误');
        generateCaptcha();
        setCaptchaCode('');
        return;
      }
    }

    if (registerType === 'username') {
      if (!nickname || !password || !confirmPassword) {
        toast.error('请填写完整信息');
        return;
      }
      if (nickname.length >= 22) {
        toast.error('用户名长度不能超过22字符');
        return;
      }
      const pwdError = validatePassword(password);
      if (pwdError) {
        toast.error(pwdError);
        return;
      }
      if (password !== confirmPassword) {
        toast.error('两次输入的密码不一致');
        return;
      }
    } else {
      if (!phoneNumber || !verifyCode) {
        toast.error('请填写完整信息');
        return;
      }
    }

    setLoading(true);
    try {
      if (registerType === 'username') {
        await usernameRegister(nickname, password);
        toast.success('注册成功，请登录');
        navigate('/login');
      } else {
        await phoneRegister(phoneNumber, verifyCodeId, verifyCode);
        toast.success('注册成功，请登录');
        navigate('/login');
      }
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
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '8px', textAlign: 'center' }}>欢迎注册</h2>
        <p style={{ fontSize: '14px', color: '#666666', marginBottom: '30px', textAlign: 'center' }}>创建账号后即可开始聊天</p>

        {/* 注册方式切换 */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{
            display: 'flex',
            background: '#F8F9FA',
            borderRadius: '10px',
            padding: '3px'
          }}>
            <button
              type="button"
              onClick={() => setRegisterType('username')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                backgroundColor: registerType === 'username' ? '#ffffff' : 'transparent',
                color: registerType === 'username' ? '#07C160' : '#666666',
                boxShadow: registerType === 'username' ? '0 2px 6px rgba(0, 0, 0, 0.06)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              账号注册
            </button>
            <button
              type="button"
              onClick={() => setRegisterType('phone')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                backgroundColor: registerType === 'phone' ? '#ffffff' : 'transparent',
                color: registerType === 'phone' ? '#07C160' : '#666666',
                boxShadow: registerType === 'phone' ? '0 2px 6px rgba(0, 0, 0, 0.06)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              手机注册
            </button>
          </div>
        </div>

        {/* 表单区域 */}
        <form onSubmit={handleRegister}>
          {/* 用户名注册 */}
          {registerType === 'username' && (
            <>
              <div style={{ marginBottom: '18px' }}>
                <label htmlFor="register-username" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#333333',
                  marginBottom: '8px'
                }}>用户名</label>
                <input
                  id="register-username"
                  name="username"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="请输入用户名（最多22字符）"
                  maxLength={22}
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
                <label htmlFor="register-password" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#333333',
                  marginBottom: '8px'
                }}>密码</label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码（6-15位）"
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
                <label htmlFor="register-confirm-password" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#333333',
                  marginBottom: '8px'
                }}>确认密码</label>
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
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

          {/* 手机号注册 */}
          {registerType === 'phone' && (
            <>
              <div style={{ marginBottom: '18px' }}>
                <label htmlFor="register-phone" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#333333',
                  marginBottom: '8px'
                }}>手机号</label>
                <input
                  id="register-phone"
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
                <label htmlFor="register-verify-code" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#333333',
                  marginBottom: '8px'
                }}>短信验证码</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    id="register-verify-code"
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

          {/* 图形验证码（手机注册需要） */}
          {registerType === 'phone' && (
            <div style={{ marginBottom: '18px' }}>
              <label htmlFor="register-captcha" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: '#333333',
                marginBottom: '8px'
              }}>图形验证码</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  id="register-captcha"
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
          )}

          {/* 注册按钮 */}
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
                注册中...
              </span>
            ) : '注 册'}
          </button>
        </form>

        {/* 登录链接 */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #F0F0F0'
        }}>
          <span style={{ fontSize: '14px', color: '#666666' }}>已有账号？</span>
          <button
            type="button"
            onClick={() => navigate('/login')}
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
            立即登录
          </button>
        </div>
      </div>
    </div>
  );
}
