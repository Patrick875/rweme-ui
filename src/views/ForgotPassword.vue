<template>
    <div class='auth-container'>
        <div class="auth-backg">
            <img src="./../assets/chicken-farm-backg.jpg" alt="auth-img" />
        </div>
        <div class="auth-form-container">
            <div class="auth-form">
                <div class='auth-form-header'>
                    <logo></logo>
                    <p class="auth-form-header--text">FORGOT PASSWORD</p>
                </div>
                <p class="auth-text">Please Enter your Email or Telephone </p>

                <div>
                    <a-form :model="formState" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" autocomplete="off">
                        <a-form-item label="Email/Tel" name="auth"
                            :rules="[{ required: true, message: 'Please input your email/telephone!' }]">
                            <a-input type="text" :v-model:value="formState.login" />
                        </a-form-item>


                        <a-button class='auth-btn'>SUBMIT</a-button>
                    </a-form>
                </div>

            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
interface formState {
    login: string;
}

const formState = reactive<formState>({
    login: "",

})


</script>

<style lang="scss" scoped>
@import "../styles/auth"
</style>