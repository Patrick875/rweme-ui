<template>
    <a-space class="admin-navbar">
        <p>{{ route.name }}</p>
        <a-dropdown>
            <template #overlay>
                <a-menu>
                    <a-menu-item key="1" @click="handleMenuClick">Profile</a-menu-item>
                    <a-menu-item key="2">Change Password</a-menu-item>
                    <a-menu-item key="3" @click="logout">Logout</a-menu-item>
                </a-menu>
            </template>
            <a-button class="avatar-button">
                <v-icon name="hi-solid-user-circle" />
                {{ loggedInUser?.fullName ? loggedInUser?.fullName : 'Admin' }}
            </a-button>
        </a-dropdown>
    </a-space>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.store';

const { loggedInUser, logoutUser } = useAuthStore()

const route = useRoute()
const router = useRouter()
const logout = () => {
    logoutUser();
    router.replace('/login')
}
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
        color: rgba(28, 130, 23, 0.68);
    }
}
</style>