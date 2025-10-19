<template>
  <div class="lazy-image-container" :style="{ width, height }">
    <van-image
      v-if="loaded"
      :src="src"
      :width="width"
      :height="height"
      :fit="fit"
      :radius="radius"
      :loading-icon="loadingIcon"
      :error-icon="errorIcon"
      @load="onLoad"
      @error="onError"
    />
    <div v-else class="image-placeholder" :style="{ width, height }">
      <van-icon :name="loadingIcon" size="24" color="#ccc" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  src: string;
  width?: string | number;
  height?: string | number;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  radius?: string | number;
  loadingIcon?: string;
  errorIcon?: string;
  threshold?: number;
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '120px',
  fit: 'cover',
  radius: '12',
  loadingIcon: 'photo',
  errorIcon: 'photo-fail',
  threshold: 0.1
});

const loaded = ref(false);
const error = ref(false);
const observer = ref<IntersectionObserver | null>(null);

const onLoad = () => {
  loaded.value = true;
  error.value = false;
};

const onError = () => {
  error.value = true;
  loaded.value = false;
};

onMounted(() => {
  // 创建 Intersection Observer 实现懒加载
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loaded.value = true;
          observer.value?.unobserve(entry.target);
        }
      });
    },
    { threshold: props.threshold }
  );

  // 开始观察
  const container = document.querySelector('.lazy-image-container');
  if (container) {
    observer.value.observe(container);
  }
});

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  overflow: hidden;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: v-bind(radius + 'px');
}
</style>
