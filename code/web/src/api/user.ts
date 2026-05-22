/**
 * 用户 API 模块
 * 包含用户注册、登录、信息管理等接口
 */
import apiClient from './client';
import { im_server } from '@/proto/generated';
import { makeRequestId } from '@/utils/id-generator';

/**
 * 获取手机验证码
 * @param phoneNumber 手机号（11位，13-19开头）
 * @returns 验证码ID
 */
export async function getPhoneVerifyCode(
  phoneNumber: string
): Promise<im_server.PhoneVerifyCodeRsp> {
  const req = im_server.PhoneVerifyCodeReq.create({
    requestId: makeRequestId(),
    phoneNumber: phoneNumber,
  });

  return apiClient.post('/service/user/get_phone_verify_code', req, {
    metadata: { responseType: im_server.PhoneVerifyCodeRsp },
  });
}

/**
 * 用户名密码注册
 * @param nickname 昵称（< 22字符）
 * @param password 密码（6-15位，字母数字下划线短横线）
 * @param verifyCodeId 验证码ID（可选）
 * @param verifyCode 验证码（可选）
 */
export async function usernameRegister(
  nickname: string,
  password: string,
  verifyCodeId?: string,
  verifyCode?: string
): Promise<im_server.UserRegisterRsp> {
  const reqData: im_server.IUserRegisterReq = {
    requestId: makeRequestId(),
    nickname,
    password,
  };

  if (verifyCodeId) {
    reqData.verifyCodeId = verifyCodeId;
  }
  if (verifyCode) {
    reqData.verifyCode = verifyCode;
  }

  const req = im_server.UserRegisterReq.create(reqData);

  return apiClient.post('/service/user/username_register', req, {
    metadata: { responseType: im_server.UserRegisterRsp },
  });
}

/**
 * 用户名密码登录
 * @param nickname 昵称
 * @param password 密码
 * @param verifyCodeId 验证码ID（可选）
 * @param verifyCode 验证码（可选）
 * @returns 登录会话ID
 */
export async function usernameLogin(
  nickname: string,
  password: string,
  verifyCodeId?: string,
  verifyCode?: string
): Promise<im_server.UserLoginRsp> {
  const reqData: im_server.IUserLoginReq = {
    requestId: makeRequestId(),
    nickname,
    password,
  };

  if (verifyCodeId) {
    reqData.verifyCodeId = verifyCodeId;
  }
  if (verifyCode) {
    reqData.verifyCode = verifyCode;
  }

  const req = im_server.UserLoginReq.create(reqData);

  return apiClient.post('/service/user/username_login', req, {
    metadata: { responseType: im_server.UserLoginRsp },
  });
}

/**
 * 手机号注册
 * @param phoneNumber 手机号
 * @param verifyCodeId 验证码ID
 * @param verifyCode 验证码
 */
export async function phoneRegister(
  phoneNumber: string,
  verifyCodeId: string,
  verifyCode: string
): Promise<im_server.PhoneRegisterRsp> {
  const req = im_server.PhoneRegisterReq.create({
    requestId: makeRequestId(),
    phoneNumber,
    verifyCodeId,
    verifyCode,
  });

  return apiClient.post('/service/user/phone_register', req, {
    metadata: { responseType: im_server.PhoneRegisterRsp },
  });
}

/**
 * 手机号登录
 * @param phoneNumber 手机号
 * @param verifyCodeId 验证码ID
 * @param verifyCode 验证码
 * @returns 登录会话ID
 */
export async function phoneLogin(
  phoneNumber: string,
  verifyCodeId: string,
  verifyCode: string
): Promise<im_server.PhoneLoginRsp> {
  const req = im_server.PhoneLoginReq.create({
    requestId: makeRequestId(),
    phoneNumber,
    verifyCodeId,
    verifyCode,
  });

  return apiClient.post('/service/user/phone_login', req, {
    metadata: { responseType: im_server.PhoneLoginRsp },
  });
}

/**
 * 获取当前用户信息
 * @param sessionId 登录会话ID
 */
export async function getUserInfo(
  sessionId: string
): Promise<im_server.GetUserInfoRsp> {
  const req = im_server.GetUserInfoReq.create({
    requestId: makeRequestId(),
    sessionId,
  });

  return apiClient.post('/service/user/get_user_info', req, {
    metadata: { responseType: im_server.GetUserInfoRsp },
  });
}

/**
 * 修改用户头像
 * @param sessionId 登录会话ID
 * @param avatar 头像图片二进制数据
 */
export async function setUserAvatar(
  sessionId: string,
  avatar: Uint8Array
): Promise<im_server.SetUserAvatarRsp> {
  const req = im_server.SetUserAvatarReq.create({
    requestId: makeRequestId(),
    sessionId,
    avatar,
  });

  return apiClient.post('/service/user/set_avatar', req, {
    metadata: { responseType: im_server.SetUserAvatarRsp },
  });
}

/**
 * 修改用户昵称
 * @param sessionId 登录会话ID
 * @param nickname 新昵称
 */
export async function setUserNickname(
  sessionId: string,
  nickname: string
): Promise<im_server.SetUserNicknameRsp> {
  const req = im_server.SetUserNicknameReq.create({
    requestId: makeRequestId(),
    sessionId,
    nickname,
  });

  return apiClient.post('/service/user/set_nickname', req, {
    metadata: { responseType: im_server.SetUserNicknameRsp },
  });
}

/**
 * 修改个性签名
 * @param sessionId 登录会话ID
 * @param description 新个性签名
 */
export async function setUserDescription(
  sessionId: string,
  description: string
): Promise<im_server.SetUserDescriptionRsp> {
  const req = im_server.SetUserDescriptionReq.create({
    requestId: makeRequestId(),
    sessionId,
    description,
  });

  return apiClient.post('/service/user/set_description', req, {
    metadata: { responseType: im_server.SetUserDescriptionRsp },
  });
}

/**
 * 修改绑定手机号
 * @param sessionId 登录会话ID
 * @param phoneNumber 新手机号
 * @param phoneVerifyCodeId 验证码ID
 * @param phoneVerifyCode 验证码
 */
export async function setUserPhoneNumber(
  sessionId: string,
  phoneNumber: string,
  phoneVerifyCodeId: string,
  phoneVerifyCode: string
): Promise<im_server.SetUserPhoneNumberRsp> {
  const req = im_server.SetUserPhoneNumberReq.create({
    requestId: makeRequestId(),
    sessionId,
    phoneNumber,
    phoneVerifyCodeId,
    phoneVerifyCode,
  });

  return apiClient.post('/service/user/set_phone', req, {
    metadata: { responseType: im_server.SetUserPhoneNumberRsp },
  });
}
