<template>
  <div class="meal-card" :class="{ 'has-selection': selected.length > 0 }">
    <!-- 卡片头部 -->
    <div class="card-header">
      <div class="header-left">
        <h3 class="meal-title">{{ title }}</h3>
        <div class="deadline-tag">
          <van-icon name="clock-o" size="14" />
          <span>截止：{{ deadline }}</span>
        </div>
      </div>
      <div class="header-right">
        <div class="selection-count" v-if="selected.length > 0">
          已选 {{ selected.length }} 道
        </div>
      </div>
    </div>
    
    <!-- 卡片内容 -->
    <div class="card-content">
      <!-- 无选择时显示 -->
      <div v-if="selected.length === 0" class="empty-state">
        <van-icon name="food-o" size="32" />
        <p class="empty-text">还没有选择菜品</p>
      </div>
      
      <!-- 有选择时显示 -->
      <div v-else class="selection-list">
        <div 
          v-for="(dish, idx) in selected" 
          :key="idx"
          class="selected-item"
        >
          <van-icon name="checked" color="#1989fa" />
          <span class="dish-name">{{ dish }}</span>
        </div>
      </div>
    </div>
    
    <!-- 卡片底部 -->
    <div class="card-footer">
      <van-button 
        type="primary" 
        size="small" 
        block 
        round
        @click="goSelect"
      >
        {{ selected.length > 0 ? '修改菜品' : '选择菜品' }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useOrderStore } from '../../stores/order';
import { useMenuStore } from '../../stores/menu';

// 定义props
const props = defineProps<{
  date: string;
  meal: 'breakfast' | 'lunch' | 'dinner';
}>();

// 定义emits
const emit = defineEmits<{
  (e: 'select-dish', date: string, meal: string): void;
}>();

const orderStore = useOrderStore();
const menuStore = useMenuStore();

// 计算属性
const title = computed(() => ({
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐'
})[props.meal]);

const deadline = computed(() => ({
  breakfast: '07:00',
  lunch: '11:00',
  dinner: '17:00'
})[props.meal]);

const selected = computed(() => {
  const counts = orderStore.getCounts(props.date, props.meal);
  return Object.entries(counts)
    .filter(([_, count]) => count > 0)
    .map(([dishId, count]) => {
      const dish = menuStore.dishes.find(d => d.id === dishId);
      return dish ? `${dish.name}×${count}` : `未知菜品(${dishId})×${count}`;
    });
});

// 方法
function goSelect() {
  emit('select-dish', props.date, props.meal);
}
</script>

<style scoped>
.meal-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  border: 2px solid transparent;
}

.meal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.meal-card.has-selection {
  border-color: #1989fa;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.header-left {
  flex: 1;
}

.meal-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.deadline-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

.header-right {
  flex-shrink: 0;
}

.selection-count {
  font-size: 12px;
  color: #1989fa;
  background: #e6f2ff;
  padding: 2px 8px;
  border-radius: 12px;
}

/* 卡片内容 */
.card-content {
  padding: 20px 16px;
  min-height: 120px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: #ccc;
}

.empty-text {
  margin-top: 8px;
  font-size: 14px;
}

.selection-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selected-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 12px;
}

.dish-name {
  font-size: 14px;
  color: #666;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 卡片底部 */
.card-footer {
  padding: 0 16px 16px;
}

:deep(.van-button) {
  font-size: 14px;
  height: 36px;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .meal-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .card-content {
    flex: 1;
    display: flex;
    align-items: center;
  }
  
  .empty-state {
    flex: 1;
  }
}
</style>