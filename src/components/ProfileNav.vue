<template>
    <aside class="profile-nav">
        <div class='profile-nav-top'>
            <div class="profile-header">
                <v-icon class="profile-icon" name="hi-solid-user-circle" />
                <div>
                    <p>
                        {{ loggedInUser?.fullName ? loggedInUser?.fullName : 'Admin' }}
                    </p>
                </div>
            </div>
            <a-menu>
                <a-menu-item key="1" @click="closeNav" class="">
                    <v-icon name="hi-solid-user-circle" />
                    Profile
                </a-menu-item>
                <a-menu-item @click="openChangePasswordModel" key="2">
                    <v-icon name="bi-lock" />
                    Change Password
                </a-menu-item>
                <a-menu-item key="3" @click="logout">
                    <v-icon name="ri-logout-box-line" />
                    Logout
                </a-menu-item>
            </a-menu>
        </div>
        <div class='profile-nav-footer'>
            <p class="profile-nav-footer-text">Rweme Platform</p>
            <p class="profile-nav-footer-text">&copy; copyright {{ new Date().getFullYear() }}</p>
        </div>

    </aside>
</template>

<script setup lang="ts">
const props = defineProps({
    closeNav: {
        type: Function,
        default: () => { }
    },
    openChangePasswordModel: {
        type: Function,
        default: () => { }
    },
    logout: {
        type: Function,
        default: () => { }
    },
    loggedInUser: {
        type: Object,
        default: {}
    }
})
</script>

<style scoped lang="scss">
.profile-header {
    padding-block: 2em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.profile-icon {
    height: 3em;
    width: 3em;
}

.profile-nav {
    width: 100%;
    height: 100%;
    background-color: rgba(28, 130, 23);
    color: white;
    display: flex;
    flex-direction: column;
}

.profile-nav-top {
    flex: 1;
}

:deep .ant-menu-light {
    background-color: transparent;
    color: white
}

.profile-nav-footer {
    height: 20%;
}

.profile-nav-footer-text {
    text-align: center;
}

.sidelogo-container {
    width: 100%;
    display: flex;
    justify-content: center;
}

.sidelogo {
    margin-block: 0;

    img {
        height: 100px;
    }
}
</style>