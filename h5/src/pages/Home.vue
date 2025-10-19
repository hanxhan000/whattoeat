<template>
  <div class="home">
    <!-- 顶部标题栏 -->
    <van-nav-bar title="今天吃什么" fixed placeholder>
      <template #right>
        <van-icon name="user-o" size="20" @click="goToProfile" />
      </template>
    </van-nav-bar>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 英雄区域 -->
      <div class="hero-section">
        <div class="hero-content">
          <img class="logo" :src="logoUrl" alt="家庭logo" />
          <h1 class="title">今天吃什么</h1>
          <p class="subtitle">为您的家庭提供美味食谱推荐</p>
          <van-button 
            type="primary" 
            size="large" 
            round 
            @click="router.push('/order')"
            class="start-button"
          >
            开始点餐
          </van-button>
        </div>
      </div>

      <!-- 今日汇总 -->
      <div class="summary-section">
        <div class="section-header">
          <h2 class="section-title">今日汇总</h2>
          <span class="section-subtitle">{{ todayLabel }}</span>
        </div>
        
        <van-cell-group inset class="summary-list">
          <van-cell
            v-for="ms in mealSummaries"
            :key="ms.meal"
            :title="ms.label"
            :label="ms.items.length ? ms.items.join('，') : '暂无菜品'"
            :value="ms.total > 0 ? (ms.total + ' 份') : ''"
            is-link
            @click="goToOrder(ms.meal)"
            class="summary-item"
          />
        </van-cell-group>
        
        <div class="summary-total">
          <span>总计</span>
          <span class="total-count">{{ totalToday }} 份</span>
        </div>
      </div>

      <!-- 快捷功能 -->
      <div class="quick-actions">
        <div class="action-item" @click="router.push('/plan')">
          <van-icon name="orders-o" size="24" />
          <span>未来食谱</span>
        </div>
        <div class="action-item" @click="router.push('/order')">
          <van-icon name="shopping-cart-o" size="24" />
          <span>立即点餐</span>
        </div>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <van-tabbar v-model="activeTab" route fixed placeholder safe-area-inset-bottom>
      <van-tabbar-item replace to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/order" icon="shopping-cart-o">点餐</van-tabbar-item>
      <van-tabbar-item replace to="/plan" icon="orders-o">食谱</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMenuStore } from '../stores/menu';
import { useOrderStore, type Meal } from '../stores/order';
import logoUrl from '../assets/logo-family.svg';

const router = useRouter();
const menu = useMenuStore();
const order = useOrderStore();

// 底部导航栏激活项
const activeTab = ref(0);

onMounted(() => {
  // 应用初始化
});

// 日期相关计算
const days = computed(() => menu.next7Days());
const today = computed(() => days.value[0]?.value || '');
const todayLabel = computed(() => days.value[0]?.label || '今天');

// 餐次相关
const meals: Meal[] = ['breakfast', 'lunch', 'dinner'];
const mealLabelMap: Record<Meal, string> = { 
  breakfast: '早餐', 
  lunch: '午餐', 
  dinner: '晚餐' 
};

// 汇总数据计算
const mealSummaries = computed(() => {
  return meals.map(meal => {
    const counts = order.getCounts(today.value, meal);
    const items = Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([dishId, count]) => {
        const dish = menu.dishes.find(d => d.id === dishId);
        return `${dish?.name || dishId}×${count}`;
      });
    const total = Object.values(counts).reduce((a, b) => a + (b || 0), 0);
    return { meal, label: mealLabelMap[meal], items, total };
  });
});

const totalToday = computed(() => 
  mealSummaries.value.reduce((a, b) => a + b.total, 0)
);

// 跳转到点餐页面
function goToOrder(meal: Meal) {
  router.push({
    path: '/order',
    query: { 
      date: today.value,
      meal: meal
    }
  });
}

// 跳转到个人页面
function goToProfile() {
  // 可以跳转到个人设置页面
  console.log('跳转到个人页面');
}
</script>

<style scoped>
.home {
  /* 使用安全视口高度变量修复移动端 100vh 问题 */
  min-height: calc(var(--vh, 1vh) * 100);
  background: linear-gradient(180deg, #fff 0%, #f8f8f8 100%);
  width: 100%;
  display: block;
  position: relative;
}

.main-content {
  padding: 16px;
  padding-bottom: 72px; /* 为底部导航栏留出空间 */
}

/* 英雄区域样式 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px 20px;
  margin-bottom: 24px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
  border-radius: 50%;
  background: white;
  padding: 8px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 14px;
  margin-bottom: 24px;
  opacity: 0.9;
}

.start-button {
  width: 100%;
  max-width: 240px;
}

/* 汇总区域样式 */
.summary-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.section-subtitle {
  font-size: 14px;
  color: #999;
}

.summary-list {
  margin-bottom: 16px;
}

.summary-item {
  border-radius: 12px;
  margin-bottom: 8px;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 12px;
  font-weight: 600;
}

.total-count {
  color: #1989fa;
  font-size: 16px;
}

/* 快捷功能样式 */
.quick-actions {
  display: flex;
  justify-content: space-around;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-item:hover {
  background: #f8f9fa;
}

.action-item span {
  font-size: 14px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 360px) {
  .hero-section {
    padding: 24px 16px;
  }
  
  .title {
    font-size: 20px;
  }
  
  .main-content {
    padding: 12px;
  }
}

@media (min-width: 768px) {
  .main-content {
    max-width: 768px;
    margin: 0 auto;
  }
  
  .hero-section {
    padding: 48px 32px;
  }
  
  .title {
    font-size: 32px;
  }
}
</style>