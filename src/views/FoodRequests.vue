<template>
    <div>
        <div>
            <Table :data="foodRequests" :title="'Food Requests'" :length="String(foodRequests.length)"
                :handle-table-search="handleSearch" :handlePrimaryButtonClicks="() => isCreateFoodRequest = true"
                :btn-name="isSupplier ? '' : 'Submit food Request'" :columns="!isSupplier ? columns : supplierColums" />
            <FoodRequestModal :cancelButton="() => isCreateFoodRequest = false"
                :isToggleFoodRequestModal="isCreateFoodRequest"></FoodRequestModal>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useEntitiesStore } from '../store/entities.store';
import { useAuthStore } from '../store/auth.store';
import { userRoles } from '../utils/enums';

const entitiesStore = useEntitiesStore();
const authStore = useAuthStore();
const logedInUser = computed(() => authStore.user)
const isSupplier = computed(() => logedInUser.value?.role === userRoles.supplier)
// console.log('user-loged-in', logedInUser.value)

if (isSupplier.value) {
    entitiesStore.getRequestsBySupplier(logedInUser.value.Supplier.id)
} else {
    entitiesStore.getFoodRequests()
}



const foodRequests = computed(() => entitiesStore.foodrequests.map((el) => ({
    farmerName: el.Farmer.fullName,
    quantity: el.FoodRequestDetails[0].quantityOfFeed,
    price: el.FoodRequestDetails[0].priceOfFeed,
    supplierName: el.Supplier.User.fullName,
    submittedOn: new Date(el.createdAt).toLocaleDateString('fr-FR')
})))
const handleSearch = (q: string) => {
    if (logedInUser.value?.role === userRoles.supplier) {
        entitiesStore.getRequestsBySupplier(logedInUser.value?.Supplier.id, q)
    } else {
        entitiesStore.getFoodRequests(q)
    }
}
const isCreateFoodRequest = ref<boolean>(false)
const columns = [
    {
        title: 'Farmer',
        dataIndex: 'farmerName',
        key: 'farmerName'
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantityOfFeed'
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'priceOfFeed'
    },
    {
        title: 'Supplier',
        dataIndex: 'supplierName',
        key: 'supplierName'
    },
    {
        title: 'Submitted On',
        dataIndex: 'submittedOn',
        key: 'submittedOn'
    },
    {
        title: 'Submitted By',
        dataIndex: 'submittedBy',
        key: 'submittedBy'
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
    }
]
const supplierColums = columns.filter((el) => el.key !== 'supplierName')

</script>
<style></style>