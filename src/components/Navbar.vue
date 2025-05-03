<template>
  <v-app-bar
    :color="theme.global.current.value.dark ? 'surface' : 'white'"
    elevation="0"
    class="px-4"
    height="70"
  >
    <v-app-bar-title class="font-weight-bold d-flex align-center">
      <v-icon color="primary" size="32" class="mr-2">mdi-film</v-icon>
      <span class="text-primary">Cine</span>
      <span>Flix</span>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <div class="d-none d-md-flex align-center">
      <v-btn
        v-for="item in menuItems"
        :key="item.title"
        :to="item.to"
        variant="text"
        class="text-none mx-2 nav-btn"
        :class="{ 'nav-btn-active': isActiveRoute(item.to) }"
      >
        <v-icon start :icon="getMenuIcon(item.title)" size="small"></v-icon>
        {{ item.title }}
      </v-btn>
    </div>

    <v-divider vertical class="mx-4 d-none d-md-block"></v-divider>

    <v-btn icon variant="text" @click="toggleTheme" class="mr-4">
      <v-icon>{{
        theme.global.current.value.dark
          ? "mdi-weather-sunny"
          : "mdi-weather-night"
      }}</v-icon>
    </v-btn>

    <div class="d-none d-md-flex align-center">
      <v-btn variant="text" class="text-none mr-2">Log in</v-btn>
      <v-btn color="primary" class="text-none px-4" rounded="pill">
        Sign up
      </v-btn>
    </div>

    <!-- Mobile Menu -->
    <v-btn class="d-md-none" icon @click="mobileMenu = true">
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <v-navigation-drawer
      v-model="mobileMenu"
      location="right"
      temporary
      width="300"
    >
      <v-list class="pa-4">
        <v-list-item class="mb-6">
          <div class="d-flex align-center">
            <v-icon color="primary" size="32" class="mr-2">mdi-film</v-icon>
            <span class="text-primary font-weight-bold">Cine</span>
            <span class="font-weight-bold">Flix</span>
          </div>
        </v-list-item>

        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :active="isActiveRoute(item.to)"
          color="primary"
          class="mb-2 rounded-lg"
          active-class="mobile-nav-active"
        >
          <template v-slot:prepend>
            <v-icon :icon="getMenuIcon(item.title)"></v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>

        <v-list-item @click="toggleTheme" class="mb-2 rounded-lg">
          <template v-slot:prepend>
            <v-icon>{{
              theme.global.current.value.dark
                ? "mdi-weather-sunny"
                : "mdi-weather-night"
            }}</v-icon>
          </template>
          <v-list-item-title>
            {{ theme.global.current.value.dark ? "Light Mode" : "Dark Mode" }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider class="mb-4"></v-divider>

      <div class="px-4">
        <v-btn block variant="text" class="mb-3 text-none">Log in</v-btn>
        <v-btn block color="primary" class="text-none" rounded="pill">
          Sign up
        </v-btn>
      </div>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useTheme } from "vuetify";

const route = useRoute();
const theme = useTheme();
const mobileMenu = ref(false);

const menuItems = [
  { title: "Home", to: "/" },
  { title: "Movies", to: "/movies" },
  { title: "Theaters", to: "/theaters" },
  { title: "My Tickets", to: "/tickets" },
];

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
};

const isActiveRoute = (path) => {
  return route.path === path;
};

const getMenuIcon = (title) => {
  const icons = {
    Home: "mdi-home",
    Movies: "mdi-movie",
    Theaters: "mdi-theater",
    "My Tickets": "mdi-ticket",
  };
  return icons[title] || "mdi-circle";
};
</script>

<style scoped>
.nav-btn {
  position: relative;
  font-weight: 500;
  height: 70px;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.nav-btn::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: rgb(var(--v-theme-primary));
  transition: all 0.2s ease;
}

.nav-btn:hover {
  opacity: 1;
}

.nav-btn:hover::after {
  width: 24px;
}

.nav-btn-active {
  opacity: 1;
}

.nav-btn-active::after {
  width: 24px;
}

.mobile-nav-active {
  background-color: rgb(var(--v-theme-primary));
  color: white;
}

.mobile-nav-active .v-icon {
  color: white;
}

:deep(.v-list-item--active > .v-list-item__overlay) {
  opacity: 0;
}
</style>
