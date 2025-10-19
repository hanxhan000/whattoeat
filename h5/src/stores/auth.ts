import { defineStore } from 'pinia';

function isWeChatUA() {
  return /MicroMessenger/i.test(navigator.userAgent);
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    nickname: '',
    remark: '',
    avatarUrl: '',
    isWeChat: isWeChatUA(),
  }),
  actions: {
    async loginWithWeChat() {
      // TODO: 接入微信 OAuth 跳转/回调；此处先模拟
      // 在微信内置浏览器中可引导至后端授权地址
      this.isLoggedIn = true;
      this.nickname = this.nickname || '微信用户';
    },
    mockLogin(nickname?: string, remark?: string) {
      this.isLoggedIn = true;
      this.nickname = nickname || '测试用户';
      this.remark = remark || '';
    },
    logout() {
      this.isLoggedIn = false;
      this.nickname = '';
      this.remark = '';
      this.avatarUrl = '';
    }
  }
});