<template>
  <router-view />
</template>

<script setup lang="ts">
// 空：路由视图容器
</script>

<style>
/* 全局适配：保证底部Tabbar不遮挡内容 */
html, body, #app { height: 100%; }
</style>
