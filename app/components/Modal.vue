<script setup lang="ts">
defineProps<{
  isActive?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function escapeListener(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close');
  }
}

onMounted(() => {
  document.addEventListener('keydown', escapeListener);
});

onUnmounted(() => {
  document.removeEventListener('keydown', escapeListener);
});
</script>

<template>
  <Transition name="fade">
    <div v-if="isActive">
      <div class="fixed inset-0 bg-black/80 z-1" @click="emit('close')" />
      <div class="fixed top-1/2 left-1/2 w-full sm:max-w-lg px-3 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-2">
        <div class="bg-white rounded-sm w-full">
          <slot name="header" />
          <slot name="content" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
