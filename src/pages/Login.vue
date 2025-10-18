<template>
  <div class="login-page">
    <van-nav-bar title="今天吃什么" />
    <div class="content">
      <van-cell-group>
        <van-field v-model="nickname" label="昵称" placeholder="请输入昵称" />
        <van-field v-model="remark" label="备注" placeholder="如爸爸/妈妈/儿子" />
      </van-cell-group>

      <div class="btns">
        <van-button type="primary" block @click="onWeChatLogin" :disabled="!isWeChat">
          微信一键登录
        </van-button>
        <van-button type="success" block @click="onMockLogin">
          模拟登录（开发测试）
        </van-button>
      </div>

      <p class="tips" v-if="!isWeChat">当前非微信内置浏览器，建议使用模拟登录开发。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();
const nickname = ref(auth.nickname);
const remark = ref(auth.remark);
const isWeChat = auth.isWeChat;

watchEffect(() => {
  auth.nickname = nickname.value;
  auth.remark = remark.value;
});

function onWeChatLogin() {
  auth.loginWithWeChat().then(() => router.replace('/order'));
}

function onMockLogin() {
  auth.mockLogin(nickname.value, remark.value);
  router.replace('/order');
}
</script>

<style scoped>
.login-page { padding-bottom: 24px; }
.content { padding: 12px; }
.btns { margin-top: 16px; display: grid; gap: 12px; }
.tips { color: #888; font-size: 12px; margin-top: 8px; }
</style>