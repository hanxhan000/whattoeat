<template>
  <div class="home">
    <div class="hero">
      <img class="logo" :src="logoUrl" alt="family" />
      <h2>今天吃什么</h2>
      <p class="sub">默认进入今天的点餐，可切换未来7天</p>
      <van-button type="primary" block @click="router.push('/order')">进入点餐</van-button>
    </div>

    <div class="summary">
      <div class="summary-head">
        <div class="title">今天汇总（{{ todayLabel }}）</div>
        <div class="total">总计 {{ totalToday }} 份</div>
      </div>
      <van-cell-group inset>
        <van-cell
          v-for="ms in mealSummaries"
          :key="ms.meal"
          :title="ms.label"
          :label="ms.items.length ? ms.items.join('，') : '暂无菜品'"
          :value="ms.total > 0 ? (ms.total + ' 份') : ''"
          is-link
          to="/order"
        />
      </van-cell-group>
    </div>

    <van-tabbar route>
      <van-tabbar-item replace to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/order" icon="shopping-cart-o">点餐</van-tabbar-item>
      <van-tabbar-item replace to="/plan" icon="todo-list-o">食谱</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMenuStore } from '../stores/menu';
import { useOrderStore, type Meal } from '../stores/order';
import logoUrl from '../assets/logo-family.svg';

const router = useRouter();
const menu = useMenuStore();
const order = useOrderStore();

onMounted(async () => {
  // 移除登录检查，让首页可以直接访问
  // if (!auth.isLoggedIn) router.replace('/login');
  await menu.loadAll();
});

// 移除未使用的 displayName，避免构建类型提示

const days = computed(() => menu.next7Days());
const today = computed(() => days.value[0]?.value || '');
const todayLabel = computed(() => days.value[0]?.label || '今天');

const meals: Meal[] = ['breakfast','lunch','dinner'];
const mealLabelMap: Record<Meal,string> = { breakfast:'早餐', lunch:'午餐', dinner:'晚餐' };

const mealSummaries = computed(() => {
  return meals.map(meal => {
    const counts = order.getCounts(today.value, meal);
    const items = Object.entries(counts).map(([dishId, count]) => {
      const dish = menu.dishes.find(d => d.id === dishId);
      return `${dish?.name || dishId}×${count}`;
    });
    const total = Object.values(counts).reduce((a,b)=>a+(b||0),0);
    return { meal, label: mealLabelMap[meal], items, total };
  });
});

const totalToday = computed(() => mealSummaries.value.reduce((a,b)=>a+b.total,0));
</script>

<style scoped>
.home { background: #f7f7f9; min-height: 100vh; padding-bottom: 72px; }
.hero { padding: 24px 16px 16px; text-align: center; background: linear-gradient(180deg,#fff,#f7f7f9); border-bottom: 1px solid #f0f0f3; }
.logo { width: 52px; height: 52px; display: block; margin: 0 auto 8px; }
h2 { margin: 0; font-weight: 700; letter-spacing: 0.5px; }
.sub { color: #666; margin: 8px 0 12px; }
.summary { padding: 12px; }
.summary-head { display:flex; align-items:center; justify-content:space-between; padding: 0 4px 8px; color:#444; }
.title { font-weight: 600; }
.total { color:#888; font-size: 12px; }
</style>