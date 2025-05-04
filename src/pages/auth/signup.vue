<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-4 rounded-lg">
          <v-card-title class="text-center pt-8 text-h5">
            Create Account
          </v-card-title>
          <v-card-subtitle class="text-center pb-4">
            Sign up to start booking movies
          </v-card-subtitle>

          <v-card-text>
            <SignupForm @success="handleSuccess" @error="handleError" />

            <div class="text-center">
              <p class="text-body-2 mb-4">
                Already have an account?
                <v-btn variant="text" class="px-2" @click="navigateToLogin">
                  Sign In
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
import SignupForm from "@/components/auth/SignupForm.vue";

const router = useRouter();
const error = ref("");

const handleSuccess = async () => {
  try {
    await router.replace("/");
  } catch (err) {
    console.error("Navigation error:", err);
    error.value =
      "Registration successful but navigation failed. Please try again.";
  }
};

const handleError = (message: string) => {
  error.value = message;
};

const navigateToLogin = () => {
  router.push("/auth/login");
};
</script>
