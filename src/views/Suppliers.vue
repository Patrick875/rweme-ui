<template>
    <div>
        <Table :data="suppliers" :title="'Suppliers'" :length="String(suppliers.length)"
            :handle-table-search="handleSearch" :handleDeleteItem="deleteSupplier" :loading="loading"
            :handleUpdateItemStatus="updateSupplierStatus" :handle-update-action="handleUpdateSupplier"
            :handlePrimaryButtonClicks="handleCreateToggleSupplier" :btn-name="'Create Supplier'" :columns="columns"
            :open-filter="openFilter" :reset-filter="resetFilter" :handle-export="exportToExcell" />
        <Modal :isOpen="isToggleUpdateVeternary" @modal-close="closeCreateSupplier" mainHeader="CREATE SUPPLIER"
            subHeader="Please provide the following details to create a supplier"
            :width="isSmallScreen ? '80%' : '550px'">
            <template #content>
                <create-supplier :cancelButton="closeCreateSupplier"></create-supplier>
            </template>
        </Modal>
        <Modal :isOpen="isToggleUpdateModal && supplier" @modal-close="() => isToggleUpdateModal = false"
            :mainHeader="'UPDATE SUPPLIER'" :subHeader="'Provide the following details to update the supplier'"
            :width="isSmallScreen ? '80%' : '550px'">
            <template #content>
                <update-supplier :vet="supplier" :cancelButton="() => isToggleUpdateModal = false"></update-supplier>
            </template>
        </Modal>
        <Modal :isOpen="isToggleFilterSuppliers" @modal-close="closeFilterSupModal" mainHeader="Filter"
            subHeader="fill the form to filter" :width="isSmallScreen ? '80%' : '550px'">
            <template #content>
                <supplier-filter :cancelButton="closeFilterSupModal"></supplier-filter>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Table from '../components/Table.vue'
import Modal from "../components/Modal.vue"
import { useEntitiesStore } from '../store/entities.store';
import { useScreenSize } from '../utils/useScreenSize';
import * as xlsx from 'xlsx'

const { isSmallScreen } = useScreenSize()
const loading = ref<boolean>(false);
const entitiesStore = useEntitiesStore()
const isToggleUpdateVeternary = ref<boolean>(false)
const isToggleUpdateModal = ref<boolean>(false)
const isToggleFilterSuppliers = ref<boolean>(false)
const handleCreateToggleSupplier = () => {
    isToggleUpdateVeternary.value = !isToggleUpdateVeternary.value
}
const closeCreateSupplier = () => {
    isToggleUpdateVeternary.value = false
}
const closeFilterSupModal = () => {
    isToggleFilterSuppliers.value = false
}
const openFilter = () => {
    isToggleFilterSuppliers.value = true

}
const resetFilter = async () => {
    await entitiesStore.getSuppliers()
}
const suppliers = computed(() => entitiesStore.suppliers.map((item) => ({
    ...item,
    fullName: item.User.fullName,
    telephone: item.User.telephone,
    email: item.User.email,
    status: item.User.status,
    typeoffeeds: item.TypeOfFeed,
    momoPay: item.momoPay,
    location: item.User.Village.name,
    key: item.id
})))
const supplier = computed(() => entitiesStore.supplier)
const handleUpdateSupplier = async (supplierId: string) => {
    await entitiesStore.getSupplier(supplierId);
    isToggleUpdateModal.value = true
}
const deleteSupplier = async (supplierId: string) => {
    loading.value = true
    try {
        await entitiesStore.deleteItem(`/suppliers/${supplierId}`);
        entitiesStore.getSuppliers();
    } catch (error) {
        console.log('err', error);
    } finally {
        loading.value = false
    }
}
const updateSupplierStatus = async (data: any) => {
    loading.value = true
    try {
        await entitiesStore.updateStatus(`/suppliers/status-update`, { ...data, supplierId: data.itemId });
        entitiesStore.getSuppliers();
    } catch (error) {
        console.log('err', error);
    } finally {
        loading.value = false
    }
}
const handleSearch = (q: string) => {
    entitiesStore.getSuppliers(q)
}
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
        title: 'Types of feed',
        dataIndex: 'typeoffeeds',
        key: 'typeoffeeds'
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
        title: 'Actions',
        dataIndex: 'action',
        key: 'action'
    },

]
const exportToExcell = (data: Array<any>, entity: string) => {
    const headers = columns.filter((el) => el.title !== 'Actions').map((el) => el.title);
    const excelData = [headers];
    data.forEach((item) => {
        const rowData = [
            item.fullName || '',
            item.location || '',
            item.telephone || '',
            item.email || '',
            item.typeoffeeds.length > 0 ? item.typeoffeeds.map((el) => el.name.toUpperCase()).join(", ") : '',
            item.momoPay || '',
            item.status || ''
        ]
        excelData.push(rowData)
    })
    const workSheet = xlsx.utils.aoa_to_sheet(excelData);
    const columnWidths = [{ wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }]

    workSheet['!cols'] = columnWidths;
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, workSheet, entity)
    xlsx.writeFile(workbook, `${entity.toLocaleLowerCase()}.xlsx`)
}

entitiesStore.getSuppliers();
</script>

<style scoped lang="scss"></style>