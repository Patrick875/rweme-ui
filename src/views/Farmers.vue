<template>
    <div>
        <Table :data="farmers" :title="'Farmers'" :length="String(farmers.length)"
            :handlePrimaryButtonClicks="handleCreateFarmer" :btn-name="'Add  new farmer'" :columns="columns" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Table from '../components/Table.vue'
import { useEntitiesStore } from '../store/entities.store';
import { useRouter } from 'vue-router';

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


entitiesStore.getFarmers();


</script>

<style scoped></style>