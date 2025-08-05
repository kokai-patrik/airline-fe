<script setup lang="ts">
import { iconMap } from '~/utils/icons';

const props = defineProps<{
  name: string;
}>();

const Icon = iconMap[props.name];
</script>

<template>
  <component :is="Icon" />
</template>
