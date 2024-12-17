<!-- MainLayout.vue -->
<template>
    <div class="layout">
        <aside class="sidebar">
            <div class='sidelogo-container'>
                <img src="./../assets/Rweme Logo.svg" class="logo" alt="rweme-platform-logo" />
            </div>
            <a-menu mode="inline" :selectedKeys="[selectedKey]" @click="handleMenuClick">
                <a-menu-item key="admin-dashbord">
                    <template #icon>
                        <v-icon name="md-dashboard-outlined" />
                    </template>
                    <router-link to="/"><span>Dashboard</span></router-link>
                </a-menu-item>
                <a-menu-item key="Food Requests" v-if="!isVeternary">
                    <template #icon>
                        <v-icon name="gi-stabbed-note" />
                    </template>
                    <router-link to="/foodrequests"><span>Feed Requests</span></router-link>
                </a-menu-item>
                <a-menu-item key="Farmers" v-if="!isSupplier">
                    <template #icon>
                        <v-icon name="gi-farm-tractor" />
                    </template>
                    <router-link to="/farmers"><span>All Farmers</span></router-link>
                </a-menu-item>
                <a-menu-item key="Veterinaries" v-if="!isVeternary && !isSupplier">
                    <template #icon>
                        <v-icon name="fa-user-md" />
                    </template>
                    <router-link to="/veterinaries">All Veterinaries</router-link>
                </a-menu-item>
                <a-menu-item key="Suppliers" v-if="!isSupplier && !isVeternary">
                    <template #icon>
                        <v-icon name="fa-user-tie" />
                    </template>
                    <router-link to="/suppliers">All Suppliers</router-link>
                </a-menu-item>
                <a-menu-item key="Transactions" v-if="!isVeternary && !isSupplier">
                    <template #icon>
                        <v-icon name="si-cashapp" />
                    </template>
                    <router-link to="/transactions">Transactions</router-link>
                </a-menu-item>
                <a-menu-item key="Settings" v-if="!isVeternary && !isSupplier">
                    <template #icon>
                        <v-icon name="ri-settings-5-line" />
                    </template>
                    <router-link to="/settings">Settings</router-link>
                </a-menu-item>
            </a-menu>
        </aside>
        <main class="main-content">
            <AdminNavbar />
            <div class='page-container'>
                <router-view />
            </div>
        </main>
    </div>
</template>
<script setup lang='ts'>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AdminNavbar from './AdminNavbar.vue';
import { useAuthStore } from '../store/auth.store';
import { userRoles } from '../utils/enums';

const route = useRoute();
const authStore = useAuthStore()
const logedInUser = computed(() => authStore.user)
const selectedKey = ref("Dashboard");
const isSupplier = logedInUser.value?.role === userRoles.supplier;
const isVeternary = logedInUser.value?.role === userRoles.veternary

console.log('user', logedInUser)

// Function to determine the selected key based on the current route
const updateSelectedKey = () => {
    const path = route.path;
    if (path.startsWith('/farmers')) {
        selectedKey.value = "Farmers";
    } else if (path.startsWith('/fooodrequests')) {
        selectedKey.value = "Food Requests";
    }
    else if (path.startsWith('/veterinaries')) {
        selectedKey.value = "Veterinaries";
    } else if (path.startsWith('/suppliers')) {
        selectedKey.value = "Suppliers";
    } else if (path.startsWith('/transactions')) {
        selectedKey.value = "Transactions";
    } else if (path.startsWith('/settings')) {
        selectedKey.value = "Settings";
    } else {
        selectedKey.value = "Dashboard";
    }
};

// Watch for changes in the route and update the selected key
watch(
    () => route.path,
    () => {
        updateSelectedKey();
    }
);

// Initialize on mount
updateSelectedKey();

const handleMenuClick = (e) => {
    selectedKey.value = e.key;
};
</script>

<style scoped lang="scss">
@import "./../styles/layout"
</style>
