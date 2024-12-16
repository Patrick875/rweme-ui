<template>
    <div>
        <Table :data="farmers" :title="'Farmers'" :length="String(farmers.length)" :loading="loading"
            :handleTableSearch="handleSearch" :handlePrimaryButtonClicks="handleCreateFarmer"
            :btn-name="'Add  new farmer'" :columns="columns" :handleDeleteItem="deleteFarmer" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Table from '../components/Table.vue'
import { useEntitiesStore } from '../store/entities.store';
import { useRouter } from 'vue-router';

const loading = ref<boolean>(false);
const router = useRouter()
const entitiesStore = useEntitiesStore()
const farmers = computed(() => entitiesStore.farmers.map((item) => ({
    ...item,
    isFarmer: true,
    location: item.Village.name,
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
        title: 'Category',
        dataIndex: 'typeOfChicken',
        key: 'typeOfChicken'
    },
    {
        title: 'Number of Chicken',
        dataIndex: 'numberOfChicken',
        key: 'numberOfChicken'
    },
    {
        title: 'Veternary In Charge',
        dataIndex: 'veternaryInCharge',
        key: 'veternaryInCharge'
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'action'
    }
]

const handleCreateFarmer = () => {
    router.push('farmers/newfarmer')
}
const deleteFarmer = async (farmerId: string) => {
    loading.value = true
    try {
        await entitiesStore.deleteItem(`/farmers/${farmerId}`);
        entitiesStore.getFarmers();

    } catch (error) {
        console.log('err', error);

    } finally {
        loading.value = false

    }
}
const handleSearch = (q: string) => {
    entitiesStore.getFarmers(q);
}

entitiesStore.getFarmers();


</script>

<style scoped></style>