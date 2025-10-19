<template>
  <div class="cart">
    <van-nav-bar title="购物清单" left-arrow fixed placeholder @click-left="router.go(-1)">
      <template #right>
        <van-icon name="calendar-o" size="20" @click="openDateSheet" />
      </template>
    </van-nav-bar>

    <div class="header">
      <div class="date">{{ selectedDayLabel }}</div>
      <van-button type="primary" size="small" round @click="clearPurchased">清除已购标记</van-button>
    </div>

    <div class="main-content">
      <van-cell-group inset>
        <van-cell v-for="item in items" :key="item.name" :title="item.name" :value="formatQty(item)" :label="item.fromDishes.join('，')">
          <template #icon>
            <van-checkbox :model-value="isPurchased(item.name)" @update:model-value="() => toggle(item.name)" />
          </template>
        </van-cell>
      </van-cell-group>

      <div v-if="items.length === 0" class="empty">
        <van-empty description="今天暂无点餐，去点餐吧" />
      </div>
    </div>

    <van-action-sheet v-model:show="showDateSheet" :actions="dayActions" cancel-text="取消" @select="onSelectDay" close-on-click-action />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMenuStore } from '../stores/menu';
import { useCartStore } from '../stores/cart';

const router = useRouter();
const menu = useMenuStore();
const cart = useCartStore();

const days = computed(() => menu.next7Days());
const selectedDay = ref(days.value[0]?.value || '');
const selectedDayLabel = computed(() => days.value.find(d => d.value === selectedDay.value)?.label || '今天');

const items = computed(() => cart.aggregate(selectedDay.value));

function formatQty(item: { quantity: number; unit?: string }){
  return item.unit ? `${item.quantity}${item.unit}` : `${item.quantity}份`;
}

function isPurchased(name: string){
  return !!cart.purchased[selectedDay.value]?.[name];
}

function toggle(name: string){ cart.togglePurchased(selectedDay.value, name); }
function clearPurchased(){ cart.clearPurchased(selectedDay.value); }

const showDateSheet = ref(false);
const dayActions = computed(() => days.value.map(d => ({ name: d.label, value: d.value })));
function openDateSheet(){ showDateSheet.value = true; }
function onSelectDay(item: { name: string; value: string }){ selectedDay.value = item.value; }
</script>

<style scoped>
.cart { min-height: calc(var(--vh, 1vh) * 100); background: var(--bg-color); }
.header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: white; border-bottom: 1px solid #f0f0f0; }
.date { font-weight: 600; color: #a06600; }
.main-content { padding: 16px; }
.empty { margin-top: 32px; }
:deep(.van-cell__title){ display: flex; align-items: center; gap: 8px; }
</style>