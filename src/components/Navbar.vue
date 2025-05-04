<template>
  <v-app-bar flat>
    <v-container class="d-flex align-center justify-space-between">
      <!-- Logo -->
      <div class="d-flex align-center">
        <v-btn variant="text" class="text-h6 font-weight-bold" to="/">
          MovieTime
        </v-btn>
      </div>

      <!-- Navigation Links -->
      <div class="d-none d-md-flex align-center">
        <v-btn variant="text" to="/movies">Movies</v-btn>
        <v-btn variant="text" to="/theaters">Theaters</v-btn>
        <v-btn variant="text" to="/about">About</v-btn>
      </div>

      <!-- Auth Buttons -->
      <div class="d-flex align-center">
        <template v-if="authStore.isAuthenticated">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn variant="text" v-bind="props" :loading="authStore.loading">
                {{ authStore.user?.name }}
                <v-icon class="ml-1">mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item to="/profile">
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>
              <v-list-item to="/my-bookings">
                <v-list-item-title>My Bookings</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="handleLogout">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-else>
          <v-btn variant="text" to="/auth/login">Login</v-btn>
          <v-btn color="primary" class="ml-2" to="/auth/signup">
            Sign Up
          </v-btn>
        </template>

        <!-- Theme Toggle -->
        <v-btn icon variant="text" class="ml-2" @click="toggleTheme">
          <v-icon>
            {{
              theme.global.current.value.dark
                ? "mdi-weather-sunny"
                : "mdi-weather-night"
            }}
          </v-icon>
        </v-btn>

        <!-- Mobile Menu -->
        <v-btn
          icon
          variant="text"
          class="d-md-none ml-2"
          @click="mobileMenu = true"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </div>
    </v-container>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-model="mobileMenu" location="right" temporary>
      <v-list>
        <v-list-item to="/" @click="mobileMenu = false">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item to="/movies" @click="mobileMenu = false">
          <v-list-item-title>Movies</v-list-item-title>
        </v-list-item>
        <v-list-item to="/theaters" @click="mobileMenu = false">
          <v-list-item-title>Theaters</v-list-item-title>
        </v-list-item>
        <v-list-item to="/about" @click="mobileMenu = false">
          <v-list-item-title>About</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTheme } from "vuetify";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";

const theme = useTheme();
const router = useRouter();
const authStore = useAuthStore();
const mobileMenu = ref(false);

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
};

const handleLogout = async () => {
  authStore.logout();
  await router.push("/login");
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
