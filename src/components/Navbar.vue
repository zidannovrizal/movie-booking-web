<template>
  <div class="navbar-wrapper">
    <v-app-bar
      flat
      class="navbar"
      :class="{
        'navbar--scrolled': isScrolled,
        'navbar--dark': theme.global.current.value.dark,
      }"
    >
      <v-container class="px-4">
        <div class="d-flex align-center justify-space-between h-100">
          <!-- Logo -->
          <div class="logo-section d-flex align-center">
            <v-btn variant="text" class="logo-btn" to="/">
              <div class="d-flex align-center">
                <div class="logo-icon-wrapper mr-2">
                  <v-icon size="32" color="primary" class="logo-icon">
                    mdi-movie-open
                  </v-icon>
                </div>
                <div class="logo-text-wrapper">
                  <span class="text-h5 font-weight-black logo-text">Movie</span>
                  <span class="text-h5 font-weight-light logo-text-light"
                    >Time</span
                  >
                </div>
              </div>
            </v-btn>
          </div>

          <!-- Center Navigation -->
          <div class="nav-center d-none d-md-flex align-center">
            <v-btn
              v-for="item in navItems"
              :key="item.path"
              variant="text"
              :to="item.path"
              :class="[
                'nav-btn',
                route.path === item.path ? 'nav-btn-active' : '',
              ]"
              class="mx-2"
            >
              <v-icon :icon="item.icon" size="20" class="nav-icon"></v-icon>
              <span class="nav-text">{{ item.title }}</span>
            </v-btn>
          </div>

          <!-- Right Section -->
          <div class="nav-right d-flex align-center">
            <!-- Search Button -->
            <v-btn
              icon="mdi-magnify"
              variant="text"
              class="action-btn search-btn"
              @click="showSearch = true"
            ></v-btn>

            <!-- Auth Section -->
            <template v-if="authStore.isAuthenticated">
              <v-menu
                v-model="userMenu"
                :close-on-content-click="false"
                location="bottom end"
                transition="slide-y-transition"
                :offset="8"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    class="user-profile-btn ml-2"
                    v-bind="props"
                    :loading="authStore.loading"
                  >
                    <v-avatar size="32" class="user-avatar mr-2">
                      <span class="text-subtitle-2 font-weight-medium">
                        {{ getUserInitials(authStore.user?.name) }}
                      </span>
                    </v-avatar>
                    <span class="d-none d-sm-block user-name">
                      {{ authStore.user?.name }}
                    </span>
                    <v-icon size="20" class="ml-1">
                      {{ userMenu ? "mdi-chevron-up" : "mdi-chevron-down" }}
                    </v-icon>
                  </v-btn>
                </template>

                <v-card class="user-menu" elevation="3">
                  <v-list>
                    <v-list-item
                      v-for="item in userMenuItems"
                      :key="item.title"
                      :to="item.path"
                      :prepend-icon="item.icon"
                      :active="route.path === item.path"
                      class="user-menu-item"
                      @click="userMenu = false"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                    <v-divider class="my-2"></v-divider>
                    <v-list-item
                      v-if="authStore.isAuthenticated"
                      to="/my-tickets"
                    >
                      <template v-slot:prepend>
                        <v-icon>mdi-ticket</v-icon>
                      </template>
                      <v-list-item-title>My Tickets</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-if="!authStore.isAuthenticated"
                      to="/auth/login"
                    >
                      <template v-slot:prepend>
                        <v-icon>mdi-login</v-icon>
                      </template>
                      <v-list-item-title>Sign In</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-if="!authStore.isAuthenticated"
                      to="/auth/signup"
                    >
                      <template v-slot:prepend>
                        <v-icon>mdi-account-plus</v-icon>
                      </template>
                      <v-list-item-title>Sign Up</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-if="authStore.isAuthenticated"
                      @click="handleLogout"
                    >
                      <template v-slot:prepend>
                        <v-icon>mdi-logout</v-icon>
                      </template>
                      <v-list-item-title>Sign Out</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </template>
            <template v-else>
              <div class="auth-buttons">
                <v-btn
                  variant="text"
                  to="/auth/login"
                  class="auth-btn login-btn"
                >
                  Login
                </v-btn>
                <v-btn to="/auth/signup" class="auth-btn signup-btn ml-2">
                  Sign Up
                </v-btn>
              </div>
            </template>

            <!-- Theme Toggle -->
            <v-btn
              :icon="
                theme.global.current.value.dark
                  ? 'mdi-weather-sunny'
                  : 'mdi-weather-night'
              "
              variant="text"
              class="action-btn theme-btn ml-2"
              @click="toggleTheme"
            ></v-btn>

            <!-- Mobile Menu Button -->
            <v-btn
              icon="mdi-menu"
              variant="text"
              class="action-btn mobile-menu-btn d-md-none ml-2"
              @click="mobileMenu = true"
            ></v-btn>
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="mobileMenu"
      location="right"
      temporary
      class="mobile-drawer"
      width="300"
    >
      <v-list class="mobile-list pa-4">
        <v-list-item class="mb-6">
          <template v-if="authStore.isAuthenticated">
            <div class="d-flex align-center mb-4">
              <v-avatar size="56" class="mobile-avatar mr-3">
                <span class="text-h6">{{
                  getUserInitials(authStore.user?.name)
                }}</span>
              </v-avatar>
              <div>
                <div class="text-h6 font-weight-medium">
                  {{ authStore.user?.name }}
                </div>
                <div class="text-subtitle-2 text-medium-emphasis">
                  {{ authStore.user?.email }}
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="mb-4">
              <v-btn
                block
                color="primary"
                size="large"
                to="/auth/login"
                class="mobile-auth-btn mb-3"
                @click="mobileMenu = false"
              >
                Login
              </v-btn>
              <v-btn
                block
                variant="outlined"
                size="large"
                to="/auth/signup"
                class="mobile-auth-btn"
                @click="mobileMenu = false"
              >
                Sign Up
              </v-btn>
            </div>
          </template>
        </v-list-item>

        <v-list-item
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :prepend-icon="item.icon"
          :active="route.path === item.path"
          rounded="lg"
          class="mobile-nav-item mb-2"
          @click="mobileMenu = false"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>

        <v-divider class="my-4"></v-divider>

        <template v-if="authStore.isAuthenticated">
          <v-list-item
            v-for="item in userMenuItems"
            :key="item.title"
            :to="item.path"
            :prepend-icon="item.icon"
            rounded="lg"
            class="mobile-nav-item mb-2"
            @click="mobileMenu = false"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="authStore.isAuthenticated" to="/my-tickets">
            <template v-slot:prepend>
              <v-icon>mdi-ticket</v-icon>
            </template>
            <v-list-item-title>My Tickets</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="!authStore.isAuthenticated" to="/auth/login">
            <template v-slot:prepend>
              <v-icon>mdi-login</v-icon>
            </template>
            <v-list-item-title>Sign In</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="!authStore.isAuthenticated" to="/auth/signup">
            <template v-slot:prepend>
              <v-icon>mdi-account-plus</v-icon>
            </template>
            <v-list-item-title>Sign Up</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="authStore.isAuthenticated" @click="handleLogout">
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>Sign Out</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- Search Dialog -->
    <v-dialog
      v-model="showSearch"
      max-width="550"
      transition="dialog-bottom-transition"
      class="search-dialog"
    >
      <v-card class="search-card">
        <v-card-text class="pa-4">
          <v-text-field
            v-model="searchQuery"
            placeholder="Search movies..."
            variant="outlined"
            density="comfortable"
            hide-details
            autofocus
            class="search-input"
            prepend-inner-icon="mdi-magnify"
            @keyup.enter="handleSearch"
          >
            <template v-slot:append>
              <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                @click="showSearch = false"
              ></v-btn>
            </template>
          </v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useTheme } from "vuetify";
import { useAuthStore } from "@/store/auth";
import { useRouter, useRoute } from "vue-router";

const theme = useTheme();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const mobileMenu = ref(false);
const userMenu = ref(false);
const showSearch = ref(false);
const searchQuery = ref("");
const isScrolled = ref(false);

const navItems = [
  { title: "Movies", path: "/movies", icon: "mdi-movie-open" },
  { title: "Theaters", path: "/theaters", icon: "mdi-theater" },
  { title: "About", path: "/about", icon: "mdi-information" },
];

const userMenuItems = [
  { title: "Profile", path: "/profile", icon: "mdi-account" },
  { title: "My Bookings", path: "/my-bookings", icon: "mdi-ticket" },
  { title: "Settings", path: "/settings", icon: "mdi-cog" },
];

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
};

const handleLogout = async () => {
  userMenu.value = false;
  mobileMenu.value = false;
  await authStore.logout();
  await router.push("/auth/login");
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    showSearch.value = false;
    router.push({
      path: "/movies",
      query: { search: searchQuery.value.trim() },
    });
    searchQuery.value = "";
  }
};

const getUserInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.navbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar {
  background: rgba(var(--v-theme-surface), 0.7) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(var(--v-border-color), 0.05);
  height: 72px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar--scrolled {
  height: 64px !important;
  background: rgba(var(--v-theme-surface), 0.85) !important;
}

.navbar--dark {
  background: rgba(18, 18, 18, 0.7) !important;
}

.navbar--dark.navbar--scrolled {
  background: rgba(18, 18, 18, 0.85) !important;
}

/* Logo Styles */
.logo-btn {
  height: auto !important;
  text-transform: none;
  letter-spacing: 0;
  transition: transform 0.3s ease;
}

.logo-btn:hover {
  transform: scale(1.02);
}

.logo-icon-wrapper {
  background: rgba(var(--v-theme-primary), 0.1);
  padding: 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.logo-btn:hover .logo-icon-wrapper {
  background: rgba(var(--v-theme-primary), 0.15);
  transform: rotate(-10deg);
}

.logo-text {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-secondary))
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-text-light {
  opacity: 0.9;
}

/* Navigation Buttons */
.nav-btn {
  height: 40px;
  border-radius: 20px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  padding: 0 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 20px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.nav-btn:hover::before {
  transform: translateY(0);
}

.nav-btn-active {
  background: rgba(var(--v-theme-primary), 0.1);
}

.nav-icon {
  position: relative;
  z-index: 1;
}

.nav-text {
  position: relative;
  z-index: 1;
  margin-left: 8px;
}

/* Action Buttons */
.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(var(--v-theme-surface-variant), 0.1);
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(var(--v-theme-surface-variant), 0.2);
  transform: translateY(-1px);
}

/* User Profile */
.user-profile-btn {
  height: 40px;
  border-radius: 20px;
  text-transform: none;
  letter-spacing: 0;
  padding: 0 8px 0 4px;
  background: rgba(var(--v-theme-surface-variant), 0.1);
  transition: all 0.3s ease;
}

.user-profile-btn:hover {
  background: rgba(var(--v-theme-surface-variant), 0.2);
  transform: translateY(-1px);
}

.user-avatar {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-secondary))
  );
}

.user-name {
  font-weight: 500;
  margin: 0 4px;
}

/* Auth Buttons */
.auth-btn {
  height: 40px;
  border-radius: 20px;
  text-transform: none;
  letter-spacing: 0;
  padding: 0 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-btn {
  color: rgb(var(--v-theme-primary));
}

.login-btn:hover {
  background: rgba(var(--v-theme-primary), 0.1);
}

.signup-btn {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-secondary))
  );
  color: white;
}

.signup-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
}

/* User Menu */
.user-menu {
  border-radius: 16px;
  overflow: hidden;
  background: rgba(var(--v-theme-surface), 0.9);
  backdrop-filter: blur(20px);
}

.user-menu-item {
  border-radius: 8px;
  margin: 4px 8px;
  transition: all 0.2s ease;
}

.user-menu-item:hover {
  background: rgba(var(--v-theme-primary), 0.1);
}

/* Mobile Drawer */
.mobile-drawer {
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(20px);
}

.mobile-avatar {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-secondary))
  );
}

.mobile-nav-item {
  transition: all 0.2s ease;
}

.mobile-nav-item:hover {
  background: rgba(var(--v-theme-primary), 0.1);
}

/* Search Dialog */
.search-dialog {
  backdrop-filter: blur(30px);
}

.search-card {
  border-radius: 20px;
  background: rgba(var(--v-theme-surface), 0.9);
  backdrop-filter: blur(20px);
}

.search-input {
  font-size: 1.1rem;
}

.search-input :deep(.v-field__outline) {
  --v-field-border-opacity: 0.1;
}

:deep(.v-list-item--active) {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
}

:deep(.v-list-item--active > .v-list-item__overlay) {
  display: none;
}
</style>
