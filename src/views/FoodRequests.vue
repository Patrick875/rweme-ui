<template>
    <div>
        <div>
            <Table :data="foodRequests" :title="'Farmers'" :length="String(foodRequests.length)"
                :handlePrimaryButtonClicks="() => isCreateFoodRequest = true" :btn-name="'Submit food Request'"
                :columns="columns" />
            <FoodRequestModal :cancelButton="() => isCreateFoodRequest = false"
                :isToggleFoodRequestModal="isCreateFoodRequest"></FoodRequestModal>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useEntitiesStore } from '../store/entities.store';

const entitiesStore = useEntitiesStore();
entitiesStore.getFoodRequests()

const foodRequests = computed(() => entitiesStore.foodrequests.map((el) => ({
    farmerName: el.Farmer.fullName,
    quantity: el.FoodRequestDetails[0].quantityOfFeed,
    price: el.FoodRequestDetails[0].priceOfFeed,
    supplierName: el.Supplier.User.fullName,
    submittedOn: new Date(el.createdAt).toLocaleDateString('fr-FR')
})))
console.log('food-requests', foodRequests)
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
    }
]

</script>
<style></style>