<template>
  <div class="plan">
    <van-nav-bar title="未来7天食谱" />
    <div class="list">
      <div v-for="day in days" :key="day.date" class="day">
        <div class="date">{{ day.label }}</div>
        <div class="meals">
          <MealCard :date="day.date" meal="breakfast" />
          <MealCard :date="day.date" meal="lunch" />
          <MealCard :date="day.date" meal="dinner" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MealCard from './components/MealCard.vue';

function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth()+1}`.padStart(2,'0');
  const dd = `${d.getDate()}`.padStart(2,'0');
  return `${y}-${m}-${dd}`;
}

function genDays(n = 7) {
  const res: { date: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getTime() + i * 86400000);
    const label = `${d.getMonth()+1}/${d.getDate()} (${['日','一','二','三','四','五','六'][d.getDay()]})`;
    res.push({ date: formatDate(d), label });
  }
  return res;
}

const days = ref(genDays());
</script>

<style scoped>
.list { padding: 12px; display: grid; gap: 12px; }
.day { background: #fff; border-radius: 12px; box-shadow: 0 1px 6px rgba(0,0,0,0.06); }
.date { padding: 10px 12px; font-weight: 600; border-bottom: 1px solid #f2f2f2; }
.meals { display: grid; grid-template-columns: 1fr; gap: 8px; padding: 10px; }
@media (min-width: 640px) { .meals { grid-template-columns: repeat(3, 1fr); } }
</style>