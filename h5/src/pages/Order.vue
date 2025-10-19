<template>
  <div class="order">
    <!-- 顶部导航栏 -->
    <van-nav-bar 
      title="点餐" 
      left-arrow 
      fixed 
      placeholder
      @click-left="router.go(-1)"
    >
      <template #right>
        <van-icon name="calendar-o" size="20" @click="openDateSheet" />
      </template>
    </van-nav-bar>

    <!-- 家庭信息 -->
    <div class="family-header">
      <van-image :src="orgLogo" width="40" height="40" round />
      <div class="family-info">
        <div class="family-name">{{ orgName }}</div>
        <div class="family-date">{{ selectedDayLabel }} · {{ activeMealLabel }}</div>
      </div>
    </div>

    <!-- 餐次选择 -->
    <van-tabs 
      v-model:active="activeMeal" 
      class="meal-tabs" 
      type="card" 
      color="#1989fa"
      background="#f5f5f5"
      animated
    >
      <van-tab title="早餐" name="breakfast" />
      <van-tab title="午餐" name="lunch" />
      <van-tab title="晚餐" name="dinner" />
    </van-tabs>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 分类和菜品 -->
      <div class="menu-container">
        <!-- 分类侧边栏 -->
        <van-sidebar 
          v-model="activeSide" 
          class="category-sidebar"
        >
          <van-sidebar-item 
            v-for="category in categories" 
            :key="category.id"
            :title="category.name"
            :badge="getCategoryBadge(category.id)"
          />
        </van-sidebar>

        <!-- 菜品列表 -->
        <div class="dish-list-container">
          <van-list finished-text="没有更多了">
            <div class="dish-grid">
              <div 
                v-for="dish in filteredDishes" 
                :key="dish.id" 
                class="dish-card"
              >
                <div class="dish-image-container">
                  <van-image 
                    :src="dish.imageUrl || defaultDishImage" 
                    width="100%" 
                    height="120"
                    fit="cover"
                    radius="12"
                  >
                    <template #loading>
                      <div class="image-placeholder">
                        <van-icon name="photo" size="24" color="#ccc" />
                      </div>
                    </template>
                    <template #error>
                      <div class="image-placeholder">
                        <van-icon name="photo-fail" size="24" color="#ccc" />
                      </div>
                    </template>
                  </van-image>
                </div>
                
                <div class="dish-info">
                  <div class="dish-name">{{ dish.name }}</div>
                  <div class="dish-category">{{ dish.categoryName }}</div>
                  
                  <div class="dish-actions">
                    <van-stepper 
                      v-model="counts[dish.id]" 
                      integer 
                      min="0" 
                      max="99"
                      theme="round"
                      button-size="24"
                      @change="onChangeCount(dish.id, counts[dish.id] ?? 0)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </div>

      <!-- 汇总信息 -->
      <div class="order-summary">
        <div class="summary-item">
          <span>已选菜品</span>
          <span>{{ totalCount }} 道</span>
        </div>
        <div class="summary-item">
          <span>总计份数</span>
          <span>{{ totalQuantity }} 份</span>
        </div>
      </div>
    </div>

    <!-- 底部提交栏 -->
    <van-submit-bar 
      :price="totalQuantity * 100" 
      button-text="提交点餐" 
      @submit="onSubmit"
      safe-area-inset-bottom
    >
      <template #tip>
        <div class="submit-tip">
          <van-icon name="info-o" />
          <span>提交后可在食谱页面查看</span>
        </div>
      </template>
    </van-submit-bar>

    <!-- 日期选择器 -->
    <van-action-sheet 
      v-model:show="showDateSheet" 
      :actions="dayActions" 
      cancel-text="取消" 
      @select="onSelectDay" 
      close-on-click-action
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMenuStore } from '../stores/menu';
import { useOrderStore } from '../stores/order';

const router = useRouter();
const route = useRoute();
const menu = useMenuStore();
const order = useOrderStore();

// 家庭信息
import logoUrl from '../assets/logo-family.svg';
const orgLogo = ref(logoUrl);
const orgName = ref('温馨小家');

// 餐次选择
const activeMeal = ref<'breakfast' | 'lunch' | 'dinner'>('lunch');
const activeMealLabel = computed(() => ({
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐'
}[activeMeal.value]));

// 日期选择
const showDateSheet = ref(false);
const days = computed(() => menu.next7Days());

function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

const selectedDay = ref(
  days.value[0]?.value || formatDate(new Date())
);

const selectedDayLabel = computed(() => 
  days.value.find(d => d.value === selectedDay.value)?.label || '今天'
);

function openDateSheet() {
  showDateSheet.value = true;
}

const dayActions = computed(() => 
  days.value.map(d => ({ name: d.label, value: d.value }))
);

function onSelectDay(item: { name: string; value: string }) {
  selectedDay.value = item.value;
  showDateSheet.value = false;
  syncCounts();
}

// 分类侧边栏
const activeSide = ref(0);
const categories = computed(() => menu.categories);

// 获取分类徽章数量（该分类下已选菜品数量）
function getCategoryBadge(categoryId: string) {
  const counts = order.getCounts(selectedDay.value, activeMeal.value);
  const categoryDishes = menu.dishes.filter(dish => dish.categoryId === categoryId);
  const selectedCount = categoryDishes.reduce((count, dish) => {
    return count + (counts[dish.id] || 0);
  }, 0);
  
  return selectedCount > 0 ? selectedCount : undefined;
}

// 菜品列表（按分类过滤）
const filteredDishes = computed(() => {
  const category = categories.value[activeSide.value];
  return menu.dishes.filter(dish => dish.categoryId === category?.id);
});

// 数量控制
const counts = ref<Record<string, number>>({});

function syncCounts() {
  counts.value = order.getCounts(selectedDay.value, activeMeal.value);
}

function onChangeCount(dishId: string, count: number) {
  order.setCount(selectedDay.value, activeMeal.value, dishId, count || 0);
}

// 统计信息
const totalCount = computed(() => 
  Object.values(counts.value).filter(count => count > 0).length
);

const totalQuantity = computed(() => 
  Object.values(counts.value).reduce((sum, count) => sum + (count || 0), 0)
);

// 提交功能
async function onSubmit() {
  try {
    // 这里可以添加提交逻辑
    import('vant').then(({ showToast }) => 
      showToast({
        message: '点餐提交成功！',
        type: 'success',
        duration: 1500
      })
    );
    
    // 返回首页
    setTimeout(() => {
      router.push('/');
    }, 1500);
  } catch (error) {
    import('vant').then(({ showToast }) => 
      showToast({
        message: '提交失败，请重试',
        type: 'fail'
      })
    );
  }
}

// 根据当前时间设置默认餐次
function defaultMealByNow(): 'breakfast' | 'lunch' | 'dinner' {
  const hour = new Date().getHours();
  if (hour < 10) return 'breakfast';
  if (hour < 16) return 'lunch';
  return 'dinner';
}

// 组件挂载时初始化
onMounted(() => {
  const qDay = (route.query.date as string) || selectedDay.value;
  selectedDay.value = qDay;

  const qMeal = route.query.meal as 'breakfast' | 'lunch' | 'dinner' | undefined;
  activeMeal.value = qMeal || defaultMealByNow();

  syncCounts();
});

// 导入默认图片
import defaultDishImage from '../assets/dish-default.svg';

// 监听餐次和日期变化
watch(activeMeal, () => {
  syncCounts();
});

watch(selectedDay, () => {
  syncCounts();
});
</script>

<style scoped>
.order {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 家庭信息样式 */
.family-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.family-info {
  flex: 1;
}

.family-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.family-date {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

/* 餐次标签样式 */
.meal-tabs {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* 主要内容区域 */
.main-content {
  padding: 16px;
  padding-bottom: 100px; /* 为底部提交栏留出空间 */
}

/* 菜单容器 */
.menu-container {
  display: flex;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

/* 分类侧边栏 */
.category-sidebar {
  width: 100px;
  flex-shrink: 0;
  border-right: 1px solid #f0f0f0;
}

:deep(.van-sidebar-item) {
  text-align: center;
  padding: 20px 12px;
}

:deep(.van-sidebar-item--select) {
  background: #e6f2ff;
  border-right: 3px solid #1989fa;
}

/* 菜品列表容器 */
.dish-list-container {
  flex: 1;
  padding: 16px;
}

/* 菜品网格 */
.dish-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* 菜品卡片 */
.dish-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.dish-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dish-image-container {
  position: relative;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 120px;
  background: #f8f9fa;
}

.dish-info {
  padding: 12px;
}

.dish-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dish-category {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}

.dish-actions {
  display: flex;
  justify-content: center;
}

/* 汇总信息 */
.order-summary {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-top: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
}

.summary-item:first-child {
  border-bottom: 1px solid #f0f0f0;
}

.summary-item span:last-child {
  font-weight: 600;
  color: #1989fa;
}

/* 提交提示 */
.submit-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 360px) {
  .dish-grid {
    grid-template-columns: 1fr;
  }
  
  .category-sidebar {
    width: 80px;
  }
  
  :deep(.van-sidebar-item) {
    padding: 16px 8px;
    font-size: 13px;
  }
}

@media (min-width: 768px) {
  .dish-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .main-content {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .menu-container {
    height: calc(100vh - 280px);
  }
  
  .dish-list-container {
    height: 100%;
    overflow-y: auto;
  }
}
</style>