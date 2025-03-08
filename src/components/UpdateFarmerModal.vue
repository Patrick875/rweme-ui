<template>
    <div class="auth">
        <div v-if="loadingInitData" class="loading-state">
            <a-spin size="large" />
            <p>...</p>
        </div>
        <div v-else>
            <p style="font-weight: 600; padding-bottom: 1.5em;">UPDATE FARMER</p>
            <a-form :model="farmerForm" ref="formRef" name="basic" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }"
                autocomplete="off">
                <a-row :gutter="16">
                    <a-col :span="isSmallScreen ? 24 : 12">
                        <a-form-item class="label-input-height" label="Full Name" name="fullName" :rules="[
                            { required: true, message: 'Please input farmer full name!' },
                        ]">
                            <a-input class="input" placeholder="Please enter farmer full name"
                                v-model:value="farmerForm.fullName" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="isSmallScreen ? 24 : 12">
                        <a-form-item class="label-input-height" label="Phone Number" name="telephone" :rules="[
                            {
                                required: true,
                                pattern: /^07\d{8}$/,
                                message:
                                    'Phone number should start with 07 and be 10 digits long',
                            },
                        ]">
                            <a-input class="input" placeholder="07-- --- ---" v-model:value="farmerForm.telephone" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="isSmallScreen ? 24 : 12">
                        <a-form-item class="label-input-height" label="Email Address" name="email"
                            :rules="[{ message: 'Please input an email !' }]">
                            <a-input class="input" type="email" placeholder="Enter a valid email"
                                v-model:value="farmerForm.email" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="isSmallScreen ? 24 : 12">
                        <a-form-item class="label-input-height" label="National Id" name="nationalId" :rules="[
                            {
                                required: true,
                                pattern: nationalIdPatern,
                                message: 'Please input a valid national id !',
                            },
                        ]">
                            <a-input class="input" placeholder="Enter a valid national Id"
                                v-model:value="farmerForm.nationalId" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="isSmallScreen ? 24 : 12">
                        <a-form-item class="label-input-height" label="Province" name="provinceId"
                            :rules="[{ required: true, message: 'Please input select !!' }]">
                            <a-select v-model:value="farmerForm.provinceId" :size="'middle'"
                                placeholder="Please select !!" @popupScroll="popupScroll">
                                <a-select-option v-for="province in provinces" :key="province.id" :value="province.key">
                                    {{ province.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isSmallScreen ? 24 : 12">
                        <a-form-item class="label-input-height" label="District" name="districtId"
                            :rules="[{ required: true, message: 'Please input select !!' }]">
                            <a-select :disabled="!farmerForm.provinceId" v-model:value="farmerForm.districtId"
                                :size="'middle'" placeholder="Please select !!" @popupScroll="popupScroll">
                                <a-select-option v-for="district in districts.filter(
                                    (distr) => distr.provinceId === farmerForm.provinceId
                                )" :key="district.id" :value="district.key">
                                    {{ district.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isSmallScreen ? 24 : 12">
                        <a-form-item class="label-input-height" label="Sector" name="sectorId"
                            :rules="[{ required: true, message: 'Please input select !!' }]">
                            <a-select :disabled="!farmerForm.districtId" v-model:value="farmerForm.sectorId"
                                :size="'middle'" placeholder="Please select !!" @popupScroll="popupScroll">
                                <a-select-option v-for="sector in sectors.filter(
                                    (sect) => sect.districtId === farmerForm.districtId
                                )" :key="sector.id" :value="sector.key">
                                    {{ sector.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isSmallScreen ? 24 : 12">
                        <a-form-item class="label-input-height" label="Cell" name="cellId"
                            :rules="[{ required: true, message: 'Please input select !!' }]">
                            <a-select :disabled="!farmerForm.sectorId" v-model:value="farmerForm.cellId"
                                :size="'middle'" placeholder="Please select !!" @popupScroll="popupScroll">
                                <a-select-option v-for="cell in cells.filter(
                                    (cell) => cell.sectorId === farmerForm.sectorId
                                )" :key="cell.id" :value="cell.key">
                                    {{ cell.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isSmallScreen ? 24 : 12">
                        <a-form-item class="label-input-height" label="Village" name="addressId"
                            :rules="[{ required: true, message: 'Please input select !!' }]">
                            <a-select :disabled="!farmerForm.cellId" v-model:value="farmerForm.addressId"
                                :size="'middle'" placeholder="Please select !!" @popupScroll="popupScroll">
                                <a-select-option v-for="village in villages.filter(
                                    (vill) => vill.cellId === farmerForm.cellId
                                )" :key="village.id" :value="village.key">
                                    {{ village.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isSmallScreen ? 24 : 12">
                        <a-form-item :disabled="true" class="label-input-height" label="Type of Chicken"
                            name="chickenTypeId" :rules="[
                                { required: true, min: 1, message: 'Please input select !!' },
                            ]">
                            <a-select :disabled="true" v-model:value="farmerForm.chickenTypeId" :options="typeofchicken"
                                :size="'middle'" placeholder="Please select !!" @popupScroll="popupScroll"></a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="isSmallScreen ? 24 : 12">
                        <a-form-item class="label-input-height" label="Number of Chicken" name="numberOfChicken" :rules="[
                            { message: 'Please input a valid number', required: true },
                        ]">
                            <a-input-number :min="1" class="input" placeholder="Enter a valid number"
                                v-model:value="farmerForm.numberOfChicken" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="isSmallScreen ? 24 : 12">
                        <a-form-item class="label-input-height" label="Assigned Veternary" name="assignedTo"
                            :rules="[{ message: 'Please select !!' }]">
                            <a-select v-model:value="farmerForm.assignedTo" :size="'middle'"
                                placeholder="Please select">
                                <a-select-option disabled value="">Select veternary</a-select-option>
                                <a-select-option v-for="vet in veternaries" :value="vet.key" :key="vet.key">{{
                                    vet.fullName + " / " +
                                    vet.telephone }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>

                </a-row>
            </a-form>
            <a-divider />
            <p>Next of Kin details</p>
            <a-form :model="nextOfKinForm" ref="nextOfKinformRef" name="nextOfKin" :label-col="{ span: 24 }"
                :wrapper-col="{ span: 24 }" autocomplete="off">
                <a-row :gutter="16">
                    <a-col :span="isSmallScreen ? 24 : 12">
                        <a-form-item class="label-input-height" label="Full Name" name="fullName"
                            :rules="[{ required: true, message: 'Please input full name!' }]">
                            <a-input class="input" placeholder="Please enter  full name"
                                v-model:value="nextOfKinForm.fullName" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="isSmallScreen ? 24 : 12">
                        <a-form-item class="label-input-height" label="Phone Number" name="telephone" :rules="[
                            {
                                required: true,
                                pattern: /^07\d{8}$/,
                                message:
                                    'Phone number should start with 07 and be 10 digits long',
                            },
                        ]">
                            <a-input class="input" placeholder="07-- --- ---" v-model:value="nextOfKinForm.telephone" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="isSmallScreen ? 24 : 12">
                        <a-form-item class="label-input-height" label="National Id" name="nationalId" :rules="[
                            {
                                required: true,
                                pattern: nationalIdPatern,
                                message: 'Please input a valid national id !',
                            },
                        ]">
                            <a-input class="input" placeholder="Enter a valid national Id"
                                v-model:value="nextOfKinForm.nationalId" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="isSmallScreen ? 24 : 12">
                        <a-form-item name="relation" label="Relation" has-feedback
                            :rules="[{ required: true, message: 'Please select !' }]">
                            <a-select v-model:value="nextOfKinForm.relation" :size="'middle'"
                                placeholder="Please select type of Feeds" placement="topLeft">
                                <a-option value="Spouse">Spouse</a-option>
                                <a-option value="Parent">Parent</a-option>
                                <a-option value="Relative">Relative</a-option>
                                <a-option value="Child">Child</a-option>
                                <a-option value="Business Partner">Business Partner</a-option>
                                <a-option value="Other">Other</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <div class="double-form-btn g-flex">
                <a-button class="cancel-form-btn" danger html-type="button"
                    @click="props.cancelButton">CANCEL</a-button>
                <a-button :loading="loading" class="btn-auth" @click="updateFarmer">UPDATE FARMER</a-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, toRaw } from "vue";
import { useEntitiesStore } from "../store/entities.store";
import dayjs from "dayjs";
import { useScreenSize } from "../utils/useScreenSize";

interface farmerForm {
    fullName: string;
    email: string;
    telephone: string;
    nationalId: string;
    chickenTypeId: string;
    numberOfChicken: number | null;
    provinceId: string | null;
    districtId: string | null;
    sectorId: string | null;
    cellId: string | null;
    addressId: string | null;
    assignedTo: string | null;
}

interface NextOfKinForm {
    fullName: string;
    nationalId: string;
    relation: string;
    telephone: string;
}
const popupScroll = () => {
    console.log("popupScroll");
};
const nationalIdPatern =
    /^[12](19\d{2}|20\d{2}|2100)[78]\d{2}[0-3]\d{4}\d{3}$/;
const { isSmallScreen } = useScreenSize();
const nextOfKinformRef = ref<InstanceType<any> | null>(null);
const entitiesStore = useEntitiesStore();
const isActionSuccess = computed(() => entitiesStore.success);

const typeofchicken = computed(() =>
    entitiesStore.typeofchicken.map((el: any) => ({
        label: el.name.toUpperCase(),
        value: el.id,
    }))
);

const provinces = computed(() =>
    entitiesStore.provinces?.map((prov) => ({
        ...prov,
        label: prov.name,
        key: prov.id,
    }))
);

const districts = computed(() =>
    entitiesStore.districts?.map((distr) => ({
        ...distr,
        label: distr.name,
        key: distr.id,
    }))
);
const sectors = computed(() =>
    entitiesStore.sectors?.map((sect) => ({
        ...sect,
        label: sect.name,
        key: sect.id,
    }))
);
const cells = computed(() =>
    entitiesStore.cells?.map((cll) => ({
        ...cll,
        label: cll.name,
        key: cll.id,
    }))
);
const villages = computed(() =>
    entitiesStore.villages?.map((vl) => ({
        ...vl,
        label: vl.name,
        key: vl.id,
    }))
);

const veternaries = computed(() =>
    entitiesStore.veternaries.map((item) => ({
        ...item,
        fullName: item.User.fullName,
        telephone: item.User.telephone,
        email: item.User.email,
        specializations: item.specializations,
        status: item.User.status,
        key: item.id,
        location: item.User.Village.name,
    }))
);
const suppliers = computed(() =>
    entitiesStore.suppliers.map((el) => ({
        label: el.User.fullName,
        key: el.id,
        telephone: el.User.telephone,
        ...el,
    }))
);
const farmer = computed(() => entitiesStore.farmer)
const loading = ref<boolean>(false);
const loadingInitData = ref<boolean>(false);
const formRef = ref<InstanceType<any> | null>(null);

const farmerForm = ref<farmerForm>({
    fullName: farmer.value?.fullName,
    email: farmer.value?.email,
    telephone: farmer.value?.telephone,
    nationalId: farmer.value?.nationalId,
    chickenTypeId: farmer.value?.FarmStatuses?.length > 0 ? farmer.value?.FarmStatuses[farmer.value?.FarmStatuses.length - 1].chickenTypeId : '',
    numberOfChicken: farmer.value?.numberOfChicken,
    provinceId: farmer.value?.Village?.provinceId,
    districtId: farmer.value?.Village?.districtId,
    sectorId: farmer.value?.Village?.sectorId,
    cellId: farmer.value?.Village?.cellId,
    addressId: farmer.value?.Village?.id,
    assignedTo: farmer.value?.assignedTo,
});
const nextOfKinForm = ref<NextOfKinForm>({
    fullName: farmer.value?.nextOfKin?.fullName,
    nationalId: farmer.value?.nextOfKin?.nationalId,
    telephone: farmer.value?.nextOfKin?.telephone,
    relation: farmer.value?.nextOfKin?.relation,
});


watch(() => [farmer.value], ([newFarmer]) => {
    console.log('new-farmer', toRaw(newFarmer));
    const normalizedFarmer = toRaw(newFarmer)
    farmerForm.value.fullName = normalizedFarmer?.fullName
    farmerForm.value.email = normalizedFarmer?.email
    farmerForm.value.telephone = normalizedFarmer?.telephone
    farmerForm.value.nationalId = normalizedFarmer?.nationalId
    farmerForm.value.chickenTypeId = normalizedFarmer?.FarmStatuses?.length > 0 ? normalizedFarmer?.FarmStatuses[normalizedFarmer?.FarmStatuses.length - 1].chickenTypeId : ''
    farmerForm.value.numberOfChicken = normalizedFarmer?.numberOfChicken
    farmerForm.value.provinceId = normalizedFarmer?.Village?.provinceId
    farmerForm.value.districtId = normalizedFarmer?.Village?.districtId
    farmerForm.value.sectorId = normalizedFarmer?.Village?.sectorId
    farmerForm.value.cellId = normalizedFarmer?.Village?.cellId
    farmerForm.value.addressId = normalizedFarmer?.Village?.id
    farmerForm.value.assignedTo = normalizedFarmer?.assignedTo

    //next of kin

    nextOfKinForm.value.fullName = normalizedFarmer?.nextOfKin?.fullName
    nextOfKinForm.value.nationalId = normalizedFarmer?.nextOfKin?.nationalId
    nextOfKinForm.value.telephone = normalizedFarmer?.nextOfKin?.telephone
    nextOfKinForm.value.relation = normalizedFarmer?.nextOfKin?.relation

}, {
    immediate: true
})



const props = defineProps({
    cancelButton: {
        type: Function,
        default: () => { },
    },
    farmerId: {
        type: String
    },
    onComplete: {
        type: Function,
        default: () => { },
    },
});


const updateFarmer = async () => {
    loading.value = true;
    const submitObject = {
        ...farmerForm.value,
        typeOfChicken: farmerForm.value.chickenTypeId,
        nextOfKin: nextOfKinForm.value,
    };
    try {
        await entitiesStore.updateFarmer(submitObject, farmer.value.id);
    } catch (error: any) {
        console.error("Error in onFinish:", error);
    } finally {
        loading.value = false;
        farmerForm.value = {
            fullName: "",
            email: "",
            telephone: "",
            nationalId: "",
            chickenTypeId: "",
            numberOfChicken: null,
            provinceId: null,
            districtId: null,
            sectorId: null,
            cellId: null,
            addressId: null,
            assignedTo: null,
        };
        nextOfKinForm.value = {
            fullName: "",
            relation: "",
            nationalId: "",
            telephone: "",
        };
        if (isActionSuccess) {
            props.onComplete();
        }
    }
};


const fetchAllData = async () => {
    loadingInitData.value = true; // Start loading
    try {
        await Promise.all([
            entitiesStore.getTypesOfChicken(),
            entitiesStore.getLocations(),
            entitiesStore.getVeternaries(),
            entitiesStore.getFarmer(props.farmerId as string)
        ]);
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        loadingInitData.value = false; // Stop loading
    }
};

// watch(() => props.farmerId, (newId) => {
//     if (newId) {
//         entitiesStore.getFarmer(newId)
//     };
// }, { immediate: true });

onMounted(() => {
    fetchAllData();
});
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

:deep(input[type="number"]) {

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &[type="number"] {
        -moz-appearance: textfield;
    }
}

:deep {

    .ant-input-number,
    .ant-picker {
        width: 100%;
        display: block;
    }
}

.double-form-btn {
    display: flex;
    justify-content: space-between;

    .btn-auth,
    .cancel-form-btn {
        width: 100%;
        height: 44px;
    }

    .btn-auth {
        background-color: rgba(28, 130, 23, 0.68);
        color: white;
        outline: none;
        border: none;

        &:hover {
            background-color: rgba(28, 130, 23, 1);
            color: white;
        }
    }

    @media (max-width: 800px) {

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
