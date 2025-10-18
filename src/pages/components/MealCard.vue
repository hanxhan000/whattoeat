<template>
  <div class="meal-card">
    <div class="title">{{ title }}<span class="deadline">截止：{{ deadline }}</span></div>
    <div class="content">
      <div v-if="selected.length === 0" class="empty">未选择菜品</div>
      <ul v-else>
        <li v-for="(dish, idx) in selected" :key="idx">{{ dish }}</li>
      </ul>
      <van-button size="small" type="primary" block @click="goSelect">选择菜品</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '../../stores/order';
import { useMenuStore } from '../../stores/menu';

const props = defineProps<{ date: string; meal: 'breakfast'|'lunch'|'dinner' }>();
const router = useRouter();
const orderStore = useOrderStore();
const menuStore = useMenuStore();

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

// 加载该日期和餐次的订单数据
onMounted(async () => {
  await orderStore.loadOrder(props.date, props.meal);
});

function goSelect() {
  router.push({ name: 'order', query: { date: props.date, meal: props.meal } });
}
</script>

<style scoped>
.meal-card { background: #fafafa; border-radius: 8px; padding: 10px; }
.title { font-weight: 600; display: flex; justify-content: space-between; }
.deadline { color: #999; font-size: 12px; }
.empty { color: #aaa; font-size: 13px; margin-bottom: 8px; }
</style>