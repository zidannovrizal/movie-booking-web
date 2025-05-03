<template>
  <v-app-bar color="surface" elevation="1" class="px-4">
    <v-app-bar-title class="font-weight-bold">
      <span class="text-primary">Movie</span>Box
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <div class="d-none d-md-flex align-center">
      <v-btn
        v-for="item in menuItems"
        :key="item.title"
        :to="item.to"
        variant="text"
        class="text-none mx-2"
        :class="{ 'text-primary': isActiveRoute(item.to) }"
      >
        {{ item.title }}
      </v-btn>
    </div>

    <v-btn class="ml-4" color="primary" rounded="pill" variant="flat">
      Sign In
      <v-icon class="ml-2">mdi-account</v-icon>
    </v-btn>

    <!-- Mobile Menu -->
    <v-btn class="d-md-none ml-4" icon @click="mobileMenu = true">
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <v-navigation-drawer v-model="mobileMenu" location="right" temporary>
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :active="isActiveRoute(item.to)"
          color="primary"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider class="my-2"></v-divider>

      <v-list>
        <v-list-item>
          <v-btn block color="primary" variant="flat" rounded="pill">
            Sign In
            <v-icon class="ml-2">mdi-account</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const mobileMenu = ref(false);

const menuItems = [
  { title: "Home", to: "/" },
  { title: "Movies", to: "/movies" },
  { title: "Coming Soon", to: "/coming-soon" },
  { title: "About", to: "/about" },
];

const isActiveRoute = (path) => {
  return route.path === path;
};
</script>

<style scoped>
.v-btn {
  text-transform: none;
  letter-spacing: normal;
}
</style>
