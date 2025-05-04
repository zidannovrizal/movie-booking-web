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
  ],
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);

  if (requiresGuest && authStore.isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
