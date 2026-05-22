/**
 * 错误处理工具
 */
export function handleAPIError(error: any): string {
  if (error.businessError) {
    return error.errorMessage || '操作失败';
  }
  
  if (error.code === 'ECONNABORTED') {
    return '请求超时，请检查网络连接';
  }
  
  if (error.response) {
    switch (error.response.status) {
      case 401:
        return '登录已过期，请重新登录';
      case 403:
        return '没有权限执行此操作';
      case 404:
        return '请求的资源不存在';
      case 500:
        return '服务器错误，请稍后重试';
      default:
        return `请求失败 (${error.response.status})`;
    }
  }
  
  if (error.request) {
    return '网络连接失败，请检查网络';
  }
  
  return error.message || '未知错误';
}
