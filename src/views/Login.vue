<template>
    <div class="auth-container">
        <div class="auth-backg">
            <img src="./../assets/chicken-farm-backg.jpg" alt="auth-img" />
        </div>
        <div class="auth-form-container">
            <div class="auth-form">
                <div class="auth-form-header">
                    <logo></logo>
                    <p class="auth-form-header--text">SIGN IN</p>
                </div>
                <p class="auth-text">To get started, please provide the following details.</p>

                <div>
                    <a-form :model="formState" @finish="onLogin" layout="vertical" autocomplete="off">
                        <a-form-item label="Email/Tel" name="login"
                            :rules="[{ required: true, message: 'Please enter your login details' }]">
                            <a-input v-model:value="formState.login" />
                        </a-form-item>
                        <a-form-item label="Password" name="password"
                            :rules="[{ required: true, message: 'Please enter your password' }]">
                            <a-input-password v-model:value="formState.password" />
                        </a-form-item>
                        <a href="/forgot-password" class="forgot-password-text">Forgot password</a>
                        <a-form-item>
                            <a-button :loading="loading" htmlType="submit" class="auth-btn">
                                Login
                            </a-button>
                        </a-form-item>
                    </a-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { login } from '../api/auth';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.store';
import { userRoles } from '../utils/enums';

interface FormState {
    login: string;
    password: string;
}

const router = useRouter();

const loading = ref<boolean>(false);
const logedInUser = computed(() => useAuthStore().user)
const formState = reactive<FormState>({
    login: "",
    password: ""
});

const onLogin = async (values: FormState) => {
    loading.value = true;
    try {
        await login(values);
        // router.replace('/')
        if (logedInUser.value?.role == userRoles.supplier) {
            router.replace("/supplier");
        } else if (logedInUser.value?.role == userRoles.veternary) {
            router.replace("/veternary");
        } else {
            router.replace("/");
        }
    } catch (error) {

    } finally {
        loading.value = false;
    }
};
</script>

<style lang="scss" scoped>
@import "../styles/auth";
</style>
