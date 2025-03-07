<template>
  <n-space :size="0" style="padding: 0.5rem; background-color: #f1f3f3">
    <div class="menu-item">Internal</div>
    <div class="menu-item">Eksternal</div>
  </n-space>
</template>

<style scoped>
  .menu-item {
    color: #c9c9c9;
    font-weight: 600;
    padding: 0.25rem 1rem;
    border-radius: 0.5rem;
  }
  .menu-item:hover,
  .menu-item.active {
    color: black;
  }
</style>
