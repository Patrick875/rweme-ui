<template>
    <div>
        <back-button></back-button>
        <div class="steps-container">
            <a-steps v-model:current="current" :items="items"></a-steps>
            <div class="steps-content">
                <create-farmer-form v-if="steps[current].key === 'create'" :cancelButton="prev"
                    :onComplete="next"></create-farmer-form>
                <farmer-contract v-if="steps[current].key === 'contract'"></farmer-contract>
                <farmer-create-completion v-if="steps[current].key === 'complete'"></farmer-create-completion>
            </div>
        </div>

        <div class="steps-action">
            <a-button v-if="current < steps.length - 1" type="primary" @click="handleOnNext">Next</a-button>
            <a-button v-if="current == steps.length - 1" type="primary" @click="onDone">
                Done
            </a-button>
            <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">Previous</a-button>
        </div>
    </div>
    <Modal :isOpen="isToggleComfirmFarmer" @modal-close="closeComfirmFarmerModal" mainHeader="" subHeader=""
        :width="'550px'">
        <template #content>
            <ComfirmOTP :next="next" :cancelButton="closeComfirmFarmerModal"></ComfirmOTP>
        </template>
    </Modal>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { message } from 'ant-design-vue';
import { useEntitiesStore } from '../store/entities.store'
import instance from "../api";
import { useRouter } from "vue-router";

const router = useRouter()
const entitiesStore = useEntitiesStore()

const isToggleComfirmFarmer = ref<boolean>(false);
const closeComfirmFarmerModal = () => {
    isToggleComfirmFarmer.value = false
}
const onDone = () => {
    message.success('Processing complete!')
    router.push('/farmers')
}
const props = defineProps({
    cancelButton: {
        type: Function,
        default: () => { },
    },
})
const current = ref<number>(0);
const next = () => {
    current.value++;
};
const handleFarmerContract = async () => {
    isToggleComfirmFarmer.value = true
    const farmer = localStorage.getItem('newFarmer');
    const newFarmer = JSON.parse(farmer as string)
    if (newFarmer) {
        await instance.post(`/farmers/sendotp/${newFarmer.id}`)
    } else {
        console.log('local-storage-error')
    }

}
const handleOnNext = () => {
    if (steps[current.value].key === 'contract') {
        handleFarmerContract()
    } else {
        next()
    }
}
const prev = () => {
    current.value--;
};
const steps = [
    {
        key: 'create',
        title: 'Create Farmer',
        description: 'Fill the form to create a new farmer',
    },
    {
        key: 'contract',
        title: 'Contract Generation & Signature',
        description: 'Contract review and signature',
    },
    {
        key: 'complete',
        title: 'Complete',
        description: 'Complete',
    },
];
const items = steps.map(item => ({ key: item.title, title: item.title, description: item.description }));

entitiesStore.getTypesOfChicken()
entitiesStore.getTypesOfFeed()
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
        }
    }

    @media(max-width:800px) {

        .btn-auth,
        .cancel-form-btn {
            padding: 0.4em;

        }
    }
}

.steps-container {
    width: 90%;
    margin-inline: auto;
}

.steps-content {
    // width: 70%;
    // margin-inline: auto;
    margin-top: 1em;
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    padding: 2em;
    overflow-y: auto;

}

.steps-action {
    width: 70%;
    margin-inline: auto;
    margin-top: 24px;
}

[data-theme='dark'] .steps-content {
    background-color: #2f2f2f;
    border: 1px dashed #404040;
}
</style>
