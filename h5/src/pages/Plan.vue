<template>
  <div class="plan">
    <!-- 顶部导航栏 -->
    <van-nav-bar 
      title="未来7天食谱" 
      left-arrow 
      fixed 
      placeholder
      @click-left="router.go(-1)"
    />

    <!-- 主要内容 -->
    <div class="main-content">
      <!-- 日期导航 -->
      <div class="date-navigation">
        <van-tabs 
          v-model:active="activeDateIndex" 
          class="date-tabs"
          color="#1989fa"
          background="#f5f5f5"
          animated
          swipeable
        >
          <van-tab 
            v-for="(day, index) in days" 
            :key="day.date"
            :title="day.label"
            :name="index"
          >
            <div class="day-content">
              <!-- 日期标题 -->
              <div class="day-header">
                <van-icon name="underway-o" />
                <span class="day-title">{{ day.fullLabel }}</span>
              </div>
              
              <!-- 餐次卡片 -->
              <div class="meals-container">
                <MealCard 
                  :date="day.date" 
                  meal="breakfast" 
                  @select-dish="onSelectDish"
                />
                <MealCard 
                  :date="day.date" 
                  meal="lunch" 
                  @select-dish="onSelectDish"
                />
                <MealCard 
                  :date="day.date" 
                  meal="dinner" 
                  @select-dish="onSelectDish"
                />
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
      
      <!-- 全部食谱概览 -->
      <div class="overview-section" v-if="showOverview">
        <div class="section-header">
          <h3 class="section-title">食谱概览</h3>
          <van-icon name="arrow-down" @click="toggleOverview" />
        </div>
        
        <div class="overview-content">
          <div 
            v-for="day in days" 
            :key="day.date"
            class="overview-day"
          >
            <div class="overview-day-header">
              <span class="day-label">{{ day.label }}</span>
            </div>
            
            <div class="overview-meals">
              <div 
                v-for="meal in ['breakfast', 'lunch', 'dinner']" 
                :key="meal"
                class="overview-meal"
              >
                <span class="meal-label">{{ getMealLabel(meal) }}</span>
                <span class="meal-content">
                  {{ getMealSummary(day.date, meal) || '未选择' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 收起的概览 -->
      <div class="collapsed-overview" v-else @click="toggleOverview">
        <van-icon name="arrow-up" />
        <span>展开食谱概览</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MealCard from './components/MealCard.vue';

const router = useRouter();

// 日期相关
interface DayInfo {
  date: string;
  label: string;
  fullLabel: string;
}

function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function genDays(n = 7): DayInfo[] {
  const res: DayInfo[] = [];
  const now = new Date();
  
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getTime() + i * 86400000);
    const weekday = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
    
    res.push({
      date: formatDate(d),
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      fullLabel: `${d.getMonth() + 1}月${d.getDate()}日 (星期${weekday})`
    });
  }
  
  return res;
}

const days = ref(genDays());
const activeDateIndex = ref(0);

// 概览控制
const showOverview = ref(false);

function toggleOverview() {
  showOverview.value = !showOverview.value;
}

// 餐次标签
function getMealLabel(meal: string) {
  const labels: Record<string, string> = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐'
  };
  return labels[meal] || meal;
}

// 获取餐次摘要
function getMealSummary(_date: string, _meal: string) {
  // 这里应该从store获取实际数据
  // 暂时返回模拟数据
  return '';
}

// 选择菜品事件
function onSelectDish(date: string, meal: string) {
  router.push({
    path: '/order',
    query: { date, meal }
  });
}
</script>

<style scoped>
.plan {
  /* 使用安全视口高度变量修复移动端 100vh 问题 */
  min-height: calc(var(--vh, 1vh) * 100);
  background: #f5f5f5;
}

.main-content {
  padding: 16px;
  padding-bottom: 24px;
}

/* 日期导航 */
.date-navigation {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

:deep(.date-tabs .van-tabs__wrap) {
  height: auto;
}

:deep(.date-tabs .van-tab) {
  flex: none;
  padding: 0 16px;
  font-size: 14px;
}

/* 日期内容 */
.day-content {
  padding: 20px 16px;
}

.day-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #e6f2ff;
  border-radius: 12px;
  color: #1989fa;
}

.day-title {
  font-size: 16px;
  font-weight: 600;
}

/* 餐次容器 */
.meals-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 概览部分 */
.overview-section {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.overview-content {
  max-height: 300px;
  overflow-y: auto;
}

.overview-day {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.overview-day:last-child {
  border-bottom: none;
}

.overview-day-header {
  margin-bottom: 12px;
}

.day-label {
  font-weight: 600;
  color: #333;
}

.overview-meals {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.overview-meal {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.meal-label {
  color: #999;
  min-width: 40px;
}

.meal-content {
  flex: 1;
  text-align: right;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.collapsed-overview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  color: #1989fa;
  cursor: pointer;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .main-content {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .meals-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  .overview-content {
    max-height: 400px;
  }
  
  .overview-meals {
    flex-direction: row;
    gap: 20px;
  }
  
  .overview-meal {
    flex: 1;
  }
}
</style>