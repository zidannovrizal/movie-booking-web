<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-4 rounded-lg">
          <v-card-title class="text-center pt-8 text-h5">
            Welcome Back
          </v-card-title>
          <v-card-subtitle class="text-center pb-4">
            Sign in to your account to continue
          </v-card-subtitle>

          <v-card-text>
            <LoginForm @success="handleSuccess" @error="handleError" />

            <div class="text-center">
              <p class="text-body-2 mb-4">
                Don't have an account?
                <v-btn variant="text" class="px-2" @click="navigateToSignup">
                  Sign Up
                </v-btn>
              </p>
            </div>
          </v-card-text>
        </v-card>

        <!-- Error Alert -->
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          closable
          class="mt-4"
          @click:close="error = ''"
        >
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import LoginForm from "@/components/auth/LoginForm.vue";

const router = useRouter();
const error = ref("");

const handleSuccess = () => {
  router.push("/");
};

const handleError = (message: string) => {
  error.value = message;
};

const navigateToSignup = () => {
  router.push("/auth/signup");
};
</script>
