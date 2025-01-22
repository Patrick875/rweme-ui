<template>
    <div v-if="loadingInitData" class="loading-state">
        <a-spin size="large" />
    </div>
    <div v-else>
        <a-form :model="supFilterForm" name="basic" :label-col="{ span: 24 }">
            <a-row :gutter="[16, 16]">
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Status" name="status">
                        <a-select v-model:value="supFilterForm.status" :size="'middle'" placeholder="Please select !!">
                            <a-select-option value="">---</a-select-option>
                            <a-select-option value="Pending">Pending</a-select-option>
                            <a-select-option value="Active">Active</a-select-option>
                            <a-select-option value="Inactive">Inactive</a-select-option>
                            <a-select-option value="Blocked">Blocked</a-select-option>
                            <a-select-option value="Deleted">Deleted</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item name="supTypeOfFeeds" label="Select type of feeds" has-feedback
                        :rules="[{ required: true, message: 'Please select type of feeds!' }]">
                        <a-select v-model:value="supFilterForm.supTypeOfFeeds" :options="typesOfFeed" mode="multiple"
                            :size="'middle'" placeholder="Please select types of feed">

                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Province" name="province">
                        <a-select v-model:value="supFilterForm.province" :size="'middle'"
                            placeholder="Please select !!">
                            <a-select-option value="">---</a-select-option>
                            <a-select-option v-for="province in provinces" :key="province.id" :value="province.key">
                                {{ province.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="District" name="district">
                        <a-select :disabled="!supFilterForm.province" v-model:value="supFilterForm.district"
                            :size="'middle'" placeholder="Please select !!">
                            <a-select-option value="">---</a-select-option>

                            <a-select-option
                                v-for="district in districts.filter((distr) => distr.provinceId === supFilterForm.province)"
                                :key="district.id" :value="district.key">
                                {{ district.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Sector" name="vetSector">
                        <a-select :disabled="!supFilterForm.district" v-model:value="supFilterForm.vetSector"
                            :size="'middle'" placeholder="Please select !!">
                            <a-select-option value="">---</a-select-option>

                            <a-select-option
                                v-for="sector in sectors.filter((sect) => sect.districtId === supFilterForm.district)"
                                :key="sector.id" :value="sector.key">
                                {{ sector.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Cell" name="cell">
                        <a-select :disabled="!supFilterForm.vetSector" v-model:value="supFilterForm.cell"
                            :size="'middle'" placeholder="Please select !!">
                            <a-select-option value="">---</a-select-option>

                            <a-select-option
                                v-for="cell in cells.filter((cell) => cell.sectorId === supFilterForm.vetSector)"
                                :key="cell.id" :value="cell.key">
                                {{ cell.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="isSmallScreen ? 24 : 12">
                    <a-form-item class="label-input-height" label="Village" name="address">
                        <a-select :disabled="!supFilterForm.cell" v-model:value="supFilterForm.village" :size="'middle'"
                            placeholder="Please select !!">
                            <a-select-option value="">---</a-select-option>
                            <a-select-option
                                v-for="village in villages.filter((vill) => vill.cellId === supFilterForm.cell)"
                                :key="village.id" :value="village.key">
                                {{ village.name }}
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
    status: string | null,
    province: number | null,
    district: number | null,
    vetSector: number | null,
    cell: number | null,
    village: number | null,
    supTypeOfFeeds: string[]

}
const supFilterForm = ref<filterFormI>({
    status: null,
    supTypeOfFeeds: [],
    province: null,
    district: null,
    vetSector: null,
    cell: null,
    village: null,
})

const provinces = computed(() => entitiesStore.provinces?.map((prov) => ({
    ...prov,
    label: prov.name,
    key: prov.id,
})))

const districts = computed(() => entitiesStore.districts?.map((distr) => ({
    ...distr,
    label: distr.name,
    key: distr.id
})))
const sectors = computed(() => entitiesStore.sectors?.map((sect) => ({
    ...sect,
    label: sect.name,
    key: sect.id
})))
const cells = computed(() => entitiesStore.cells?.map((cll) => ({
    ...cll,
    label: cll.name,
    key: cll.id
})))
const villages = computed(() => entitiesStore.villages?.map((vl) => ({
    ...vl,
    label: vl.name,
    key: vl.id
})))

const typesOfFeed = computed(() => entitiesStore.typeoffeeds?.map((el) => ({
    label: el.name,
    value: el.id
})));

const filter = async () => {
    loading.value = true;

    const cleanFilterObj = Object.keys(supFilterForm.value).reduce((acc, key) => {
        if (supFilterForm.value[key] != undefined && supFilterForm.value[key] != null && supFilterForm.value[key] != '') {

            if (key === 'supTypeOfFeeds' && supFilterForm.value[key].length == 0) {
                acc = acc;
            } else {
                acc[key] = supFilterForm.value[key]
            }
        }
        return acc;
    }, {})

    try {
        const filterString = objectToQueryString(cleanFilterObj)

        await entitiesStore.getSuppliers('', filterString)
        notify('success', 'Success', 'Data retrieved ')
        setTimeout(() => {
            supFilterForm.value = {
                status: null,
                supTypeOfFeeds: [],
                province: null,
                district: null,
                vetSector: null,
                cell: null,
                village: null,

            }
            props.cancelButton()
        }, 3000);
    } catch (error) {
        console.log('----err', error);

        notify('error', 'Failed', 'Filter failed ')
        supFilterForm.value = {
            status: null,
            supTypeOfFeeds: [],
            province: null,
            district: null,
            vetSector: null,
            cell: null,
            village: null,

        }

    } finally {
        loading.value = false
    }
}
const fetchAllData = async () => {
    loadingInitData.value = true; // Start loading
    try {
        await Promise.all([
            entitiesStore.getLocations(),
            entitiesStore.getTypesOfFeed(),
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