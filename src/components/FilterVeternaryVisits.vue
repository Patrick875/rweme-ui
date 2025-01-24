<template>
    <div v-if="loadingInitData" class="loading-state">
        <a-spin size="large" />
    </div>
    <div v-else>
        <a-form :model="feedReqFilterForm" name="basic" :label-col="{ span: 24 }">
            <a-row :gutter="[16, 16]">
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Farmer" name="farmer">
                        <a-select v-model:value="feedReqFilterForm.farmer" :size="'middle'"
                            placeholder="Please select !!">
                            <a-select-option value="">---</a-select-option>
                            <a-select-option v-for="farm in farmers" :key="farm.id" :value="farm.key">
                                {{ farm.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Recorded by" name="recordedBy">
                        <a-select v-model:value="feedReqFilterForm.recordedBy" :size="'middle'"
                            placeholder="Please select !!">
                            <a-select-option value="">---</a-select-option>
                            <a-select-option v-for="supl in users" :key="supl.id" :value="supl.key">
                                {{ supl.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <div class="double-form-btn g-flex">
                <a-button class="cancel-form-btn" danger html-type="button"
                    @click="props.cancelButton">CANCEL</a-button>
                <a-button :loading="loading" class="btn-auth" @click="filter">FILTER</a-button>
            </div>
        </a-form>
    </div>
</template>

<script setup lang="ts">
import { objectToQueryString } from './../utils/helperFunctions'
import { computed, onMounted, ref } from "vue";
import { useScreenSize } from "../utils/useScreenSize";
import { useEntitiesStore } from "../store/entities.store";
import { notify } from '../utils/notify';
const { isSmallScreen } = useScreenSize()

const props = defineProps({
    cancelButton: {
        type: Function,
        default: () => { },
    }
})

const entitiesStore = useEntitiesStore()
const loadingInitData = ref<boolean>(false);

const loading = ref<boolean>(false)

interface filterFormI {
    farmer: string | null,
    recordedBy: string | null,
}
const feedReqFilterForm = ref<filterFormI>({
    farmer: null,
    recordedBy: null,
})

const farmers = computed(() => entitiesStore.farmers?.map((farmer) => ({
    id: farmer.id,
    label: farmer.fullName,
    key: farmer.id,
})))

const users = computed(() => entitiesStore.users.map((el) => ({
    label: el.fullName,
    key: el.id,
    telephone: el.telephone,
    ...el,
})))


const typesOfFeed = computed(() => entitiesStore.typeoffeeds?.map((el) => ({
    label: el.name,
    value: el.id
})));

const filter = async () => {
    loading.value = true;

    const cleanFilterObj = Object.keys(feedReqFilterForm.value).reduce((acc, key) => {
        if (feedReqFilterForm.value[key] != undefined && feedReqFilterForm.value[key] != null && feedReqFilterForm.value[key] != '') {
            acc[key] = feedReqFilterForm.value[key]
        }
        return acc;
    }, {})

    try {
        const filterString = objectToQueryString(cleanFilterObj)
        await entitiesStore.getAllVeternaryVisits('', filterString)
        notify('success', 'Success', 'Data retrieved ')
        setTimeout(() => {
            feedReqFilterForm.value = {
                farmer: null,
                recordedBy: null
            }
            props.cancelButton()
        }, 3000);
    } catch (error) {
        console.log('----err', error);
        notify('error', 'Failed', 'Filter failed ')
        feedReqFilterForm.value = {
            farmer: null,
            recordedBy: null
        }

    } finally {
        loading.value = false
    }
}
const fetchAllData = async () => {
    loadingInitData.value = true; // Start loading
    try {
        await Promise.all([
            entitiesStore.getFarmers(),
            entitiesStore.getUsers(),
        ]);
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        loadingInitData.value = false; // Stop loading
    }
};
onMounted(() => {
    fetchAllData()
})
</script>

<style scoped lang="scss">
@import "../styles/_auth.scss";

.auth {
    :where(.css-dev-only-do-not-override-185kyl0).ant-form-item {
        margin-bottom: 16px !important;
    }

    .btn-auth {
        margin-left: 4px;
    }

    .select-input {
        width: 100%;
    }
}

.double-form-btn {
    display: flex;
    justify-content: space-between;

    .btn-auth,
    .cancel-form-btn {
        width: 100%;
        height: 44px
    }

    .btn-auth {
        background-color: rgba(28, 130, 23, 0.68);
        color: white;
        outline: none;
        border: none;

        &:hover {
            background-color: rgba(28, 130, 23, 1);
            color: white
        }
    }

    @media(max-width:800px) {

        .btn-auth,
        .cancel-form-btn {
            padding: 0.4em;

        }
    }
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    gap: 10px;

    p {
        margin: 0;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.65);
    }
}
</style>