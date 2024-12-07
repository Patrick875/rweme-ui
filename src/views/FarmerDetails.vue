<template>
    <back-button></back-button>
    <div>
        <p class="page-header">FARMER DETAILS</p>
        <div class='farmer'>
            <div>
                <p class='details-header'>Contact details</p>
                <div class='details-group'>
                    <p v-if="farmer">Names: {{ farmer.fullName }}</p>
                    <p v-if="farmer">Telephone: {{ farmer.telephone }}</p>
                    <p v-if="farmer && farmer.email">Email : {{ farmer.email }}</p>
                </div>
            </div>
            <div>
                <p class='details-header'>Farm details</p>
                <div class='details-group'>
                    <p v-if="farmer">Current Number of Chicken : {{ farmer.numberOfChicken }}</p>
                    <p v-if="farmer">Joined At :{{ new Date(farmer.createdAt).toLocaleDateString('fr-FR') }}</p>
                </div>
            </div>
            <div>
                <p class='details-header'>Address</p>
                <div class='details-group'>
                    <p v-if="farmer">Address : {{ farmer.Village.name }}</p>
                    <p v-if="farmer">Cell:{{ farmer.Village.Cell.name }} </p>
                    <p v-if="farmer">Sector: {{ farmer.Village.sector.name }}</p>
                    <p v-if="farmer">District: {{ farmer.Village.District.name }}</p>
                    <p v-if="farmer">Province : {{ farmer.Village.Province.name }} </p>
                </div>
            </div>
        </div>
        <div class="actions-cont">
            <div>
                <p class="actions-label">Actions</p>
            </div>
            <div class="actions">
                <a-button>Update Details</a-button>
                <a-button>Deactivate</a-button>
                <a-button>Delete</a-button>
            </div>
        </div>
    </div>
    <div class='farmstatuses'>
        <div class="farm-status-header">
            <p class="actions-label">Food Requests</p>
            <a-button class='add-record' @click="() => isToggleAddStatusModal = true">
                <v-icon name="io-add-circle-outline"></v-icon>
                Request Food</a-button>
        </div>
        <div>
            <Table :title="'Farm records'" :length="String(farmRecords.length)" :data="farmRecords"
                :columns="columns" />
        </div>
        <AddFarmStatusModel :isToggleAddStatusModal="isToggleAddStatusModal" :cancelButton="closeModal"
            :farmerId="farmerId" :chickenTypeId="'843ec677-9195-496e-a7d5-f2baf70efd90'" />

    </div>
</template>
<script setup lang='ts'>
import { onMounted, watch, ref, computed } from 'vue'
import { useRoute } from 'vue-router';
import { useEntitiesStore } from '../store/entities.store';
import Table from '../components/Table.vue';
const entitiesStore = useEntitiesStore()
const farmer = computed(() => entitiesStore.farmer)
const farmRecords = computed(() => entitiesStore.farmer ? entitiesStore.farmer.FarmStatuses.map((el) => ({
    chickenType: el.TypeOfChicken?.name.toUpperCase(),
    numberOfChicken: el.numberOfChicken,
    chickenHealthCondition: el.chickenHealthCondition,
    hasInsurance: el.hasInsurance ? 'YES' : 'NO',
    recordedBy: el.collectedBy ? el.collectedBy.fullName : 'N/A',
    recordedOn: new Date(el.recordedOn).toLocaleDateString('fr-FR')
})) : [])
const route = useRoute()
const farmerId = route.params.farmerId as string;
const isToggleAddStatusModal = ref<boolean>(false)
const closeModal = () => {
    isToggleAddStatusModal.value = false
}
const columns = [
    {
        title: 'Type Of Chicken',
        dataIndex: 'chickenType',
        key: 'chickenType'
    },
    {
        title: 'Number Of Chicken',
        dataIndex: 'numberOfChicken',
        key: 'numberOfChicken'
    },
    {
        title: 'Chicken health condition',
        dataIndex: 'chickenHealthCondition',
        key: 'chickenHealthCondition'
    },
    {
        title: 'Has Insurance',
        dataIndex: 'hasInsurance',
        key: 'hasInsurance'
    },
    {
        title: 'Recorded By',
        dataIndex: 'recordedBy',
        key: 'recordedBy'
    },
    {
        title: 'Recorded on',
        dataIndex: 'recordedOn',
        key: 'recordedOn'
    }

]

watch([farmerId], () => {
    entitiesStore.getFarmer(farmerId)
})
onMounted(() => {
    entitiesStore.getFarmer(farmerId)
})

</script>
<style scoped lang='scss'>
.page-header {
    padding-block: 1em;
    font-weight: bold;
    text-align: center;
}

.farmer {
    display: flex;
    justify-content: space-between;
    padding-block: 1em;
    background-color: white;
}

.actions-label {
    font-weight: bold;
    padding-left: 1em;
}

.actions-cont,
.actions {
    margin-block: 1em;
    //padding-block: 1em;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.actions {
    justify-content: normal;
    gap: 1em;
}

.details-group {
    padding: 1em;
    padding-block: 0.5em;
    border-radius: 0.75em;
}

.details-header {
    padding: 1em;
    font-weight: bold;
    background-color: rgb(253, 253, 253);

}

.farm-status-header {
    margin-block: 0.5em;
    padding-block: 0.5em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;


}

.add-record {
    display: flex;
    align-items: center;
    gap: 1em;
    font-weight: 600
}

p {
    margin-block: 0.15em;
}
</style>