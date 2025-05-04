<template>
  <v-form @submit.prevent="handleSubmit" ref="form">
    <v-text-field
      v-model="name"
      label="Full Name"
      :rules="[rules.required]"
      variant="outlined"
      prepend-inner-icon="mdi-account"
      class="mb-4"
    ></v-text-field>

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
      class="mb-4"
    ></v-text-field>

    <v-text-field
      v-model="phoneNumber"
      label="Phone Number"
      variant="outlined"
      prepend-inner-icon="mdi-phone"
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
      Sign Up
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
const name = ref("");
const email = ref("");
const password = ref("");
const phoneNumber = ref("");
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
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      phoneNumber: phoneNumber.value,
    });
    emit("success");
  } catch (err: any) {
    emit("error", err?.response?.data?.error || "Failed to create account");
  } finally {
    loading.value = false;
  }
};
</script>
