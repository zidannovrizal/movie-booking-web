<template>
  <div class="profile-page">
    <Navbar />
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <h1 class="text-h4 font-weight-bold mb-6">Profile Settings</h1>

          <v-card class="mb-6">
            <v-card-text class="pa-6">
              <!-- Profile Picture -->
              <div class="d-flex flex-column align-center mb-6">
                <v-avatar size="120" class="mb-4">
                  <v-img v-if="profilePicture" :src="profilePicture" />
                  <span v-else class="text-h4">{{ userInitials }}</span>
                </v-avatar>
                <v-file-input
                  v-model="newProfilePicture"
                  accept="image/*"
                  hide-details
                  density="compact"
                  variant="outlined"
                  prepend-icon=""
                  class="profile-picture-input"
                  @change="handleProfilePictureChange"
                >
                  <template v-slot:selection="{ fileNames }">
                    <span class="text-caption">{{ fileNames[0] }}</span>
                  </template>
                </v-file-input>
              </div>

              <!-- Name -->
              <v-text-field
                v-model="name"
                label="Name"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                :rules="[rules.required]"
              ></v-text-field>

              <!-- Email -->
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                :rules="[rules.required, rules.email]"
              ></v-text-field>

              <!-- Phone Number -->
              <v-text-field
                v-model="phoneNumber"
                label="Phone Number"
                variant="outlined"
                density="comfortable"
                class="mb-4"
              ></v-text-field>

              <v-btn
                color="primary"
                block
                :loading="loading"
                @click="updateProfile"
                class="mt-4"
              >
                Save Changes
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- Change Password -->
          <v-card>
            <v-card-text class="pa-6">
              <h2 class="text-h6 font-weight-medium mb-4">Change Password</h2>

              <v-text-field
                v-model="currentPassword"
                label="Current Password"
                type="password"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                :rules="[rules.required]"
              ></v-text-field>

              <v-text-field
                v-model="newPassword"
                label="New Password"
                type="password"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                :rules="[rules.required, rules.min]"
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                label="Confirm New Password"
                type="password"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                :rules="[rules.required, rules.passwordMatch]"
              ></v-text-field>

              <v-btn
                color="primary"
                block
                :loading="passwordLoading"
                @click="changePassword"
                :disabled="!canChangePassword"
              >
                Update Password
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Success/Error Alert -->
    <v-snackbar
      v-model="showAlert"
      :color="alertType"
      :timeout="3000"
      location="top"
    >
      {{ alertMessage }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "@/store/auth";
import Navbar from "@/components/Navbar.vue";

const authStore = useAuthStore();

// Profile Form
const name = ref(authStore.user?.name || "");
const email = ref(authStore.user?.email || "");
const phoneNumber = ref(authStore.user?.phoneNumber || "");
const profilePicture = ref(authStore.user?.profilePicture || "");
const newProfilePicture = ref<File | null>(null);
const loading = ref(false);

// Password Form
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const passwordLoading = ref(false);

// Alert
const showAlert = ref(false);
const alertMessage = ref("");
const alertType = ref("success");

// Computed
const userInitials = computed(() => {
  if (!name.value) return "U";
  return name.value
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const canChangePassword = computed(() => {
  return (
    currentPassword.value &&
    newPassword.value &&
    confirmPassword.value &&
    newPassword.value === confirmPassword.value
  );
});

// Validation Rules
const rules = {
  required: (v: string) => !!v || "This field is required",
  email: (v: string) => /.+@.+\..+/.test(v) || "Please enter a valid email",
  min: (v: string) => v.length >= 6 || "Password must be at least 6 characters",
  passwordMatch: (v: string) =>
    v === newPassword.value || "Passwords do not match",
};

// Methods
const showSuccessAlert = (message: string) => {
  alertType.value = "success";
  alertMessage.value = message;
  showAlert.value = true;
};

const showErrorAlert = (message: string) => {
  alertType.value = "error";
  alertMessage.value = message;
  showAlert.value = true;
};

const handleProfilePictureChange = (file: File | null) => {
  if (!file) {
    newProfilePicture.value = null;
    profilePicture.value = authStore.user?.profilePicture || "";
    return;
  }

  // Create a preview URL for the new image
  profilePicture.value = URL.createObjectURL(file);
  newProfilePicture.value = file;
};

const updateProfile = async () => {
  loading.value = true;
  try {
    const updatedUser = await authStore.updateProfile({
      name: name.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      profilePicture: newProfilePicture.value,
    });

    // Update local form data with the response
    name.value = updatedUser.name;
    email.value = updatedUser.email;
    phoneNumber.value = updatedUser.phoneNumber || "";

    // Only update profile picture if we got a new one from the server
    if (updatedUser.profilePicture) {
      profilePicture.value = updatedUser.profilePicture;
    }
    newProfilePicture.value = null;

    // Refresh the user data in the store
    await authStore.fetchCurrentUser();

    showSuccessAlert("Profile updated successfully");
  } catch (error: any) {
    showErrorAlert(error?.response?.data?.error || "Failed to update profile");
  } finally {
    loading.value = false;
  }
};

const changePassword = async () => {
  if (!canChangePassword.value) return;

  passwordLoading.value = true;
  try {
    await authStore.changePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    });
    showSuccessAlert("Password changed successfully");

    // Clear password fields
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (error: any) {
    showErrorAlert(error?.response?.data?.error || "Failed to change password");
  } finally {
    passwordLoading.value = false;
  }
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
}

.profile-picture-input {
  max-width: 200px;
}

.v-avatar {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-secondary))
  );
  color: white;
}
</style>
