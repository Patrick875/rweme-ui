<template>
    <div>
        <Table :data="suppliers" :title="'Suppliers'" :length="String(suppliers.length)"
            :handlePrimaryButtonClicks="handleCreateToggleVeternary" :btn-name="'Create Supplier'" :columns="columns" />
        <Modal :isOpen="isToggleCreateVeternary" @modal-close="closeCreateVeternaryModal" mainHeader="CREATE SUPPLIER"
            subHeader="Please provide the following details to create a supplier" :width="'550px'">
            <template #content>
                <create-supplier :cancelButton="closeCreateVeternaryModal"></create-supplier>
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
const suppliers = computed(() => entitiesStore.suppliers.map((item) => ({
    fullName: item.User.fullName,
    telephone: item.User.telephone,
    email: item.User.email,
    status: item.User.status,
    momoPay: item.momoPay,
    location: item.User.Village.name,
    key: item.id
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
        title: 'MOMO PAY',
        dataIndex: 'momoPay',
        key: 'momoPay'
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

entitiesStore.getSuppliers();
</script>

<style scoped lang="scss"></style>