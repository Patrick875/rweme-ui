<template>
    <a-space class="admin-navbar">
        <p>{{ route.name }}</p>
        <a-dropdown>
            <template #overlay>
                <a-menu>
                    <a-menu-item key="1" @click="handleMenuClick">Profile</a-menu-item>
                    <a-menu-item @click="() => openChangePassword = true" key="2">Change Password</a-menu-item>
                    <a-menu-item key="3" @click="logout">Logout</a-menu-item>
                </a-menu>
            </template>
            <a-button class="avatar-button">
                <v-icon name="hi-solid-user-circle" />
                {{ loggedInUser?.fullName ? loggedInUser?.fullName : 'Admin' }}
            </a-button>
        </a-dropdown>
    </a-space>
    <Modal :width="'550px'" :isOpen="openChangePassword" @modal-close="() => openChangePassword = false"
        main-header="Change password" subheader="Fill the form to change the password">

        <template #content>
            <a-form :model="changePasswordForm" autocomplete="off" name="basic" :label-col="{ span: 24 }"
                :wrapper-col="{ span: 24 }">
                <a-form-item label="Old password" name="oldPassword">
                    <a-input-password class="input" v-model:value="changePasswordForm.oldPassword" />
                </a-form-item>
                <a-form-item label="New password" name="newPassword">
                    <a-input-password class="input" v-model:value="changePasswordForm.newPassword" />
                </a-form-item>
                <a-form-item label="Comfirm password" name="comfirmPassword" :rules="[
                    { required: true, message: 'Please confirm your password!' },
                    { validator: validateConfirmPassword }
                ]" validate-trigger="change">
                    <a-input-password class="input" v-model:value="changePasswordForm.comfirmPassword" />
                </a-form-item>
                <a-button class="auth-btn" @click="changePassword" :loading="changePasswordLoading">Change
                    Password</a-button>
            </a-form>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAuthStore } from '../store/auth.store';
import instance from '../api';
import { notify } from '../utils/notify';
import { Form } from 'ant-design-vue';

const { loggedInUser, logoutUser } = useAuthStore();

console.log('logged-in-user', loggedInUser)

const route = useRoute()
const router = useRouter()
const openChangePassword = ref<boolean>(false)
const changePasswordLoading = ref<boolean>(false)
interface IchangePassword {
    oldPassword: string;
    newPassword: string;
    comfirmPassword: string;
}
const changePasswordForm = ref<IchangePassword>({
    oldPassword: '',
    newPassword: '',
    comfirmPassword: ''
})
const formRef = ref();

const logout = () => {
    logoutUser();
    router.replace('/auth/login')
}
const changePassword = async () => {
    changePasswordLoading.value = true
    await instance.patch('/auth/changePassword', { ...changePasswordForm.value }).then(() => {
        changePasswordLoading.value = false
        notify('success', 'Success', 'Password changed successfully!!!')
    }).catch((err) => {
        console.log('err', err);
        changePasswordLoading.value = false
        notify('error', "Error", err.response.data.message)
    })
    resetFields()
}
const validatePassword = () => {
    formRef.value.validateFields(['newPassword']);
};
const validateConfirmPassword = async (_rule: any, value: string) => {
    if (changePasswordForm.value.newPassword !== value) {
        return Promise.reject('The two passwords do not match!');
    }
    return Promise.resolve();
};

const { resetFields } = Form.useForm(changePasswordForm, {
    oldPassword: [
        { required: true, message: 'Please input your password!' },
        { pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, message: 'Password must be at least 8 characters long contain both letters,numbers and at least one special character.' }
    ],
    comfirmPassword: [
        { required: true, message: 'Please confirm your password!' },
        { validator: validateConfirmPassword }
    ]
});

const handleMenuClick = () => {
    console.log('menu clicked')
}


</script>

<style scoped lang="scss">
.admin-navbar {
    height: 3.75em;
    background-color: rgba(28, 130, 23, 0.68);
    color: white;
    padding-block: .45em;
    padding-inline: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    font-size: 0.875em;
}

.avatar-button {
    height: 2.5em;
    color: white;
    display: flex;
    align-items: center;
    gap: 1.2em;
    background-color: transparent;
    border: none;
    outline: none;

    &:hover {
        color: white;
    }
}

:deep .ant-form-item {
    margin-bottom: 4px
}

:deep .ant-form-item-label {
    font-weight: 600;
}

.auth-btn {
    margin-top: 1em;
    width: 100%;
    height: 3em;
    background-color: rgb(30, 144, 255, 0.68);
    color: white;
    outline: none;
    border: none;

    &:hover {
        background-color: rgb(30, 144, 255, 1);
        color: white;
    }
}
</style>