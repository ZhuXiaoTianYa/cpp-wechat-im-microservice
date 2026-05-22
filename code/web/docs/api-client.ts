/**
 * API 客户端配置
 * 基于 Axios 封装，支持 Protobuf 二进制传输
 */
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { im_server } from '@/proto/generated';

declare module 'axios' {
  export interface AxiosRequestConfig {
    metadata?: {
      responseType: any;
    };
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://211.159.146.107:9000',
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
        config.data = MessageType.encode(config.data).finish();
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
