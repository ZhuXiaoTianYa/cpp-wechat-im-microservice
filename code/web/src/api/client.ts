/**
 * API 客户端配置
 * 基于 Axios 封装，支持 Protobuf 二进制传输
 */
import axios, { AxiosError } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    metadata?: {
      responseType: any;
    };
  }
}

const apiClient = axios.create({
  baseURL: '',
  headers: { 
    'Content-Type': 'application/x-protobuf' 
  },
  responseType: 'arraybuffer',
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    if (config.data && typeof config.data === 'object') {
      const MessageType = config.data.constructor;
      if (MessageType.encode) {
        // 序列化 Protobuf 对象为二进制数据
        const uint8Array = MessageType.encode(config.data).finish();
        // 转换为 ArrayBuffer，确保 axios 正确发送
        config.data = uint8Array.buffer.slice(uint8Array.byteOffset, uint8Array.byteOffset + uint8Array.byteLength);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    const ResponseType = response.config.metadata?.responseType;
    if (!ResponseType) {
      throw new Error('Response type not specified in metadata');
    }
    
    const decoded = ResponseType.decode(new Uint8Array(response.data));
    
    if (!decoded.success) {
      const error = new Error(decoded.errmsg || '请求失败');
      (error as any).businessError = true;
      (error as any).errorMessage = decoded.errmsg;
      throw error;
    }
    
    return decoded;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
