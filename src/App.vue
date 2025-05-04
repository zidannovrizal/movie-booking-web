<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.initialize();
});
</script>
