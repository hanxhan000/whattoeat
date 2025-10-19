// 全局错误处理工具
export class AppError extends Error {
  public code?: string;
  public statusCode?: number;
  
  constructor(message: string, code?: string, statusCode?: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

// 全局错误处理器
export function setupErrorHandler(app: any) {
  // Vue 错误处理
  app.config.errorHandler = (err: unknown, _instance: unknown, info: string) => {
    console.error('Vue Error:', err, info);
    
    // 显示用户友好的错误信息
    if (err instanceof AppError) {
      showErrorToast(err.message);
    } else {
      showErrorToast('应用出现错误，请刷新页面重试');
    }
  };

  // 未捕获的Promise错误
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    showErrorToast('网络请求失败，请检查网络连接');
    event.preventDefault();
  });
}

// 显示错误提示
function showErrorToast(message: string) {
  import('vant').then(({ showToast }) => {
    showToast({
      message,
      type: 'fail',
      duration: 3000
    });
  });
}

// 网络请求错误处理
export function handleApiError(error: { response?: { status: number }; request?: unknown; message?: string }): string {
  if (error.response) {
    // 服务器响应错误
    const status = error.response.status;
    switch (status) {
      case 400:
        return '请求参数错误';
      case 401:
        return '未授权，请重新登录';
      case 403:
        return '权限不足';
      case 404:
        return '请求的资源不存在';
      case 500:
        return '服务器内部错误';
      default:
        return `请求失败 (${status})`;
    }
  } else if (error.request) {
    // 网络错误
    return '网络连接失败，请检查网络';
  } else {
    // 其他错误
    return error.message || '未知错误';
  }
}

