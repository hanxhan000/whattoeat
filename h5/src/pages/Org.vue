<template>
  <div class="org">
    <van-nav-bar title="家庭/组织" left-arrow fixed placeholder @click-left="router.go(-1)" />

    <div class="main-content">
      <div class="current" v-if="current">
        <div class="cover" />
        <div class="info">
          <van-image :src="current.logoUrl || logoUrl" width="48" height="48" round />
          <div>
            <div class="name">{{ current.name }}</div>
            <div class="code">加入码：{{ current.code }}</div>
          </div>
        </div>
        <div class="members" v-if="current.members?.length">
          <div class="members-title">成员</div>
          <div class="members-list">
            <div v-for="m in current.members" :key="m.id" class="member">{{ m.nickname }}</div>
          </div>
        </div>
      </div>

      <van-cell-group inset>
        <van-cell title="创建家庭/组织" label="输入名称，生成加入码" />
        <div class="form">
          <van-field v-model="orgName" placeholder="例如：温馨小家" />
          <van-button type="primary" round block @click="onCreate" :loading="loading">创建</van-button>
        </div>
      </van-cell-group>

      <van-cell-group inset>
        <van-cell title="加入组织" label="输入加入码与昵称" />
        <div class="form">
          <van-field v-model="joinCode" placeholder="加入码" />
          <van-field v-model="nickname" placeholder="昵称" />
          <van-button type="success" round block @click="onJoin" :loading="loading">加入</van-button>
        </div>
      </van-cell-group>

      <div class="tip">说明：当前为本地模拟云端，方便先行体验与共享。</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOrgStore } from '../stores/org';
import logoUrl from '../assets/logo-family-warm.svg';

const router = useRouter();
const org = useOrgStore();
const loading = computed(() => org.loading);
const current = computed(() => org.current);

const orgName = ref('');
const joinCode = ref('');
const nickname = ref('');

onMounted(() => { org.init(); });

async function onCreate(){
  if (!orgName.value.trim()) return;
  await org.create(orgName.value.trim());
}

async function onJoin(){
  if (!joinCode.value.trim() || !nickname.value.trim()) return;
  await org.join(joinCode.value.trim(), nickname.value.trim());
}
</script>

<style scoped>
.org { min-height: calc(var(--vh, 1vh) * 100); background: var(--bg-color); }
.main-content { padding: 16px; }
.current { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.05); margin-bottom: 16px; }
.cover { height: 80px; background: linear-gradient(135deg, #ffedd5, #fde68a); }
.info { display: flex; align-items: center; gap: 12px; padding: 12px 16px; }
.name { font-weight: 600; color: #8a4b16; }
.code { font-size: 12px; color: #999; }
.members { padding: 0 16px 12px; }
.members-title { font-size: 14px; color: #666; margin-bottom: 8px; }
.members-list { display: flex; gap: 8px; flex-wrap: wrap; }
.member { background: #fff7ed; color: #a16207; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
.form { display: flex; gap: 8px; align-items: center; padding: 8px 16px 16px; }
.tip { text-align: center; color: #999; font-size: 12px; margin-top: 8px; }
</style>