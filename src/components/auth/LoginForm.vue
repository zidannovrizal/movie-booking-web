<template>
  <v-form @submit.prevent="handleSubmit" ref="form">
    <v-text-field
      v-model="email"
      label="Email"
      type="email"
      :rules="[rules.required, rules.email]"
      variant="outlined"
      prepend-inner-icon="mdi-email"
      class="mb-4"
    ></v-text-field>

    <v-text-field
      v-model="password"
      label="Password"
      :type="showPassword ? 'text' : 'password'"
      :rules="[rules.required, rules.min]"
      variant="outlined"
      prepend-inner-icon="mdi-lock"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="showPassword = !showPassword"
      class="mb-6"
    ></v-text-field>

    <v-btn
      type="submit"
      color="primary"
      size="large"
      block
      :loading="loading"
      class="mb-4"
    >
      Sign In
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";

const emit = defineEmits<{
  (e: "success"): void;
  (e: "error", error: string): void;
}>();

const authStore = useAuthStore();

const form = ref<any>(null);
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);

const rules = {
  required: (v: string) => !!v || "This field is required",
  email: (v: string) => /.+@.+\..+/.test(v) || "Please enter a valid email",
  min: (v: string) => v.length >= 6 || "Password must be at least 6 characters",
};

const handleSubmit = async () => {
  if (!form.value?.validate()) return;

  loading.value = true;

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    emit("success");
  } catch (err: any) {
    emit("error", err?.response?.data?.error || "Failed to login");
  } finally {
    loading.value = false;
  }
};
</script>
