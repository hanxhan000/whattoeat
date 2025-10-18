<template>
  <div class="dishes">
    <van-nav-bar title="选择菜品" />
    <van-search v-model="q" placeholder="搜索菜品" />

    <van-list>
      <van-cell v-for="dish in filtered" :key="dish.name" :title="dish.name" :label="dish.category">
        <template #right-icon>
          <van-button size="small" type="primary" @click="select(dish.name)">添加</van-button>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const q = ref('');
const catalog = [
  { name: '西红柿炒鸡蛋', category: '蔬菜-瓜果' },
  { name: '清蒸鱼', category: '蛋白质类' },
  { name: '番茄蛋汤', category: '汤羹类' },
  { name: '炒时蔬', category: '蔬菜类' },
];

const filtered = computed(() => catalog.filter(c => c.name.includes(q.value)));

function select(name: string) {
  void name; // 避免未使用参数的类型告警
  // TODO: 保存到 store 或调用后端提交选择
  // 当前仅做演示后退
  router.back();
}
</script>

<style scoped>
.dishes { padding-bottom: 12px; }
</style>