import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/pages/index.vue"),
    },
    {
      path: "/movies",
      children: [
        {
          path: "",
          component: () => import("@/pages/movies/index.vue"),
        },
        {
          path: ":id",
          component: () => import("@/pages/movies/[id].vue"),
        },
      ],
    },
    {
      path: "/auth",
      children: [
        {
          path: "login",
          component: () => import("@/pages/auth/login.vue"),
          meta: { requiresGuest: true },
        },
        {
          path: "signup",
          component: () => import("@/pages/auth/signup.vue"),
          meta: { requiresGuest: true },
        },
      ],
    },
    {
      path: "/my-tickets",
      component: () => import("@/pages/my-tickets.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);

  // If we have a token but no user, try to fetch the user
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchCurrentUser();
    } catch (error) {
      authStore.logout();
      next("/auth/login");
      return;
    }
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    next("/auth/login");
  } else if (requiresGuest && authStore.isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
