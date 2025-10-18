<template>
  <div class="order">
    <van-nav-bar title="今天吃什么">
      <template #right>
        <van-button size="small" type="primary" plain @click="openDateSheet">{{ selectedDayLabel }}</van-button>
      </template>
    </van-nav-bar>

    <div class="header">
      <van-image :src="orgLogo" width="36" height="36" round />
      <div class="org">{{ orgName }}</div>
    </div>

    <van-tabs v-model:active="activeMeal" class="meal-tabs" type="line">
      <van-tab title="早餐" name="breakfast" />
      <van-tab title="午餐" name="lunch" />
      <van-tab title="晚餐" name="dinner" />
    </van-tabs>

    <div class="content">
      <div class="left">
        <van-sidebar v-model="activeSide">
          <van-sidebar-item v-for="c in categories" :key="c.id" :title="c.name" />
        </van-sidebar>
      </div>
      <div class="right">
        <div class="dish-list">
          <div v-for="dish in filteredDishes" :key="dish.id" class="dish-item">
            <van-image :src="dish.imageUrl || defaultDishImage" width="84" height="84" fit="cover" radius="10">
              <template #loading>
                <div class="img-skeleton" />
              </template>
              <template #error>
                <img :src="defaultDishImage" class="img-fallback" />
              </template>
            </van-image>
            <div class="meta">
              <div class="name">{{ dish.name }}</div>
              <div class="desc">{{ dish.categoryName }}</div>
              <van-stepper v-model="counts[dish.id]" integer min="0" @change="onChangeCount(dish.id, counts[dish.id] ?? 0)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-submit-bar button-text="提交" @submit="onSubmit">
      <template #tip>
        已选 {{ totalCount }} 道菜 · {{ activeMealLabel }} · {{ selectedDayLabel }}
      </template>
    </van-submit-bar>

    <van-action-sheet v-model:show="showDateSheet" :actions="dayActions" cancel-text="取消" @select="onSelectDay" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '../stores/menu';
import { useOrderStore } from '../stores/order';

const route = useRoute();
const menu = useMenuStore();
const order = useOrderStore();

import logoUrl from '../assets/logo-family.svg';
const orgLogo = ref(logoUrl);
const orgName = ref('温馨小家');

// 默认今天与午餐
const activeMeal = ref<'breakfast'|'lunch'|'dinner'>('lunch');
const activeMealLabel = computed(() => ({ breakfast:'早餐', lunch:'午餐', dinner:'晚餐' }[activeMeal.value]));

// 日期选择
const showDateSheet = ref(false);
const days = computed(() => menu.next7Days());
function formatDate(d: Date){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${dd}`;
}
const selectedDay = ref(days.value[0]?.value || formatDate(new Date()));
const selectedDayLabel = computed(() => days.value.find(d => d.value === selectedDay.value)?.label || '今天');
function openDateSheet(){ showDateSheet.value = true; }
const dayActions = computed(() => days.value.map(d => ({ name: d.label, value: d.value })));
function onSelectDay(item: any){ selectedDay.value = item.value; showDateSheet.value = false; syncCounts(); }

// 左侧分类
const activeSide = ref(0);
const categories = computed(() => menu.categories);

// 右侧菜品列表（按分类过滤）
const filteredDishes = computed(() => {
  const cate = categories.value[activeSide.value];
  return menu.dishes.filter(d => d.categoryId === cate?.id);
});

// 数量与购物车联动
const counts = ref<Record<string, number>>({});
function syncCounts(){
  counts.value = order.getCounts(selectedDay.value, activeMeal.value);
}
function onChangeCount(dishId: string, count: number){
  order.setCount(selectedDay.value, activeMeal.value, dishId, count || 0);
}
const totalCount = computed(() => Object.values(counts.value).reduce((a,b)=>a+(b||0),0));

function onSubmit(){
  // 简化版本，直接提示
  import('vant').then(({ showToast }) => showToast('已提交今天的点餐'));
}

function defaultMealByNow(): 'breakfast'|'lunch'|'dinner' {
  const hour = new Date().getHours();
  if (hour < 10) return 'breakfast';
  if (hour < 16) return 'lunch';
  return 'dinner';
}

onMounted(() => {
  const qDay = (route.query.date as string) || selectedDay.value;
  selectedDay.value = qDay;

  const qMeal = route.query.meal as 'breakfast'|'lunch'|'dinner' | undefined;
  activeMeal.value = qMeal || defaultMealByNow();

  syncCounts();
});

import defaultDishImage from '../assets/dish-default.svg';

watch(activeMeal, () => { syncCounts(); });
</script>

<style scoped>
.order { padding-bottom: 72px; background: #f7f7f9; min-height: 100vh; }
.header { display: flex; align-items: center; gap: 8px; padding: 10px 12px; }
.org { font-weight: 600; letter-spacing: 0.5px; }
.meal-tabs { position: sticky; top: 0; z-index: 2; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.content { display: grid; grid-template-columns: 100px 1fr; gap: 8px; }
.left { background: #fff; }
.right { background: #fff; }
.dish-list { padding: 8px; display: grid; gap: 10px; }
.dish-item { display: grid; grid-template-columns: 84px 1fr; gap: 12px; border: 1px solid #f0f0f3; border-radius: 12px; padding: 10px; background: #fff; box-shadow: 0 1px 6px rgba(0,0,0,0.04); }
.name { font-weight: 600; font-size: 15px; }
.desc { color: #888; font-size: 12px; margin: 2px 0 6px; }
.img-skeleton { width: 84px; height: 84px; border-radius: 10px; background: linear-gradient(90deg,#eee,#f5f5f5,#eee); background-size: 200% 100%; animation: shimmer 1.6s infinite; }
.img-fallback { width: 84px; height: 84px; border-radius: 10px; object-fit: cover; }
@keyframes shimmer { 0%{ background-position: 200% 0 } 100%{ background-position: -200% 0 } }
.van-submit-bar { bottom: 0; }
@media (max-width: 360px) { .content { grid-template-columns: 88px 1fr; } }
</style>