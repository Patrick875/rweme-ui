<template>
    <div>
        <Table :data="veternaries" :title="'Veternaries'" :length="String(veternaries.length)"
            :handlePrimaryButtonClicks="handleCreateToggleVeternary" :btn-name="'Create veternary'"
            :columns="columns" />
        <Modal :isOpen="isToggleCreateVeternary" @modal-close="closeCreateVeternaryModal" mainHeader="CREATE VETERNARY"
            subHeader="Please provide the following details to create a veternary" :width="'550px'">
            <template #content>
                <create-veternary :cancelButton="closeCreateVeternaryModal"></create-veternary>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Table from '../components/Table.vue'
import Modal from "../components/Modal.vue"
import { useEntitiesStore } from '../store/entities.store';

const entitiesStore = useEntitiesStore()

const isToggleCreateVeternary = ref<boolean>(false)
const handleCreateToggleVeternary = () => {
    isToggleCreateVeternary.value = !isToggleCreateVeternary.value
}
const closeCreateVeternaryModal = () => {
    isToggleCreateVeternary.value = false
}
const veternaries = computed(() => entitiesStore.veternaries.map((item) => ({
    fullName: item.User.fullName,
    telephone: item.User.telephone,
    email: item.User.email,
    specializations: item.specializations,
    status: item.User.status,
    key: item.id,
    location: item.User.Village.name,
})))
const columns = [
    {
        title: 'Name',
        dataIndex: 'fullName',
        key: 'fullName'
    },
    {
        title: 'Location',
        dataIndex: 'location',
        key: 'location'
    },
    {
        title: 'Telephone',
        dataIndex: 'telephone',
        key: 'telephone'
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
    },
    {
        title: 'Specializations',
        dataIndex: 'specializations',
        key: 'specializations'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action'
    },

]

entitiesStore.getVeternaries();
</script>

<style scoped lang="scss"></style>