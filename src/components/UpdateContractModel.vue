<template>
    <div>
        <Modal :isOpen="props.isOpen" @modal-close="props.cancelButton" mainHeader="UPDATE FARMER CONTRACT" subHeader=""
            :width="isSmallScreen ? '80%' : '550px'">
            <template #content>
                <p class="preview-warning">Please view the selected contract before proceding to update it </p>
                <a-form :model="contractUpdateForm" ref="formRef" name="basic" :label-col="{ span: 24 }"
                    :wrapper-col="{ span: 24 }" autocomplete="off">
                    <p class='upload-label'> Upload contract</p>
                    <a-form-item>
                        <a-upload class="upload-here" :maxCount="1" :file-list="fileList" :before-upload="beforeUpload"
                            :custom-request="customRequest" @change="handleChange">
                            <a-button class="upload-input">
                                <v-icon name='co-cloud-upload' fill="#0369a1" :scale="1.2"></v-icon>
                                <p class='all-upload-text'>[upload or drag and
                                    drop]
                                    [Max
                                    file size : 5MB]</p>
                            </a-button>
                        </a-upload>
                    </a-form-item>
                    <div class="double-form-btn g-flex">
                        <a-button class="cancel-form-btn" danger html-type="button"
                            @click="props.cancelButton">CANCEL</a-button>
                        <a-button :loading="updating" class="btn-auth" @click="submitNewContract"
                            html-type="submit">UPDATE
                        </a-button>
                    </div>
                </a-form>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useScreenSize } from "../utils/useScreenSize";
import { extractPublicId, uploadToCloudinary, uploadUpdateContract } from "../utils/uploadToCloudinary";
import { validateFileOnChange } from "../utils/uploadValidator";
import { UploadRequestOption } from "ant-design-vue/es/vc-upload/interface";
import instance from "../api";
import { useEntitiesStore } from "../store/entities.store";
import { notify } from "../utils/notify";
const fileList = ref([]);
const entitiesStore = useEntitiesStore();

interface ContractUpdateForm {
    farmerId: string | null;
    contractLink: string | null;
}
const { isSmallScreen } = useScreenSize();

const updating = ref(false)
const selectedFile = ref<File | null>(null)


const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    cancelButton: {
        type: Function,
        default: () => { },
    },
    farmerId: {
        type: String || null,
    },
    contractLink: {
        type: String || null,
    },
});

const contractUpdateForm = ref<ContractUpdateForm>({
    farmerId: props.farmerId ? props.farmerId : null,
    contractLink: props.contractLink ? props.contractLink : null,

});

const submitNewContract = async () => {
    updating.value = true
    try {

        if (selectedFile.value) {
            console.log('selected-File', selectedFile.value);

            const publicId = props.contractLink ? extractPublicId(props.contractLink) : undefined;
            // console.log('public_id', publicId);


            const uploadResult = await uploadUpdateContract(selectedFile.value, selectedFile.value.name);
            if (uploadResult) {
                contractUpdateForm.value.contractLink = uploadResult;
            }
            // console.log('cloudinary-result', uploadResult);

        }
        const res = await instance.patch(`/farmers/${props.farmerId}/contract`, {
            farmerId: props.farmerId,
            contractLink: contractUpdateForm.value.contractLink
        })
        if (res) {
            await entitiesStore.getFarmer(props.farmerId as string)
        }
        notify('success', 'Success', 'Contract details updated !!!')
    } catch (error) {
        notify('error', 'failed', 'contract details update failed !!!')
    } finally {
        updating.value = false

    }
}

const handleChange = (info: any) => {
    const validationResult = validateFileOnChange(info, fileList)
    if (validationResult) {
        selectedFile.value = info.file; // Store file for later upload
    }
}
const customRequest = async (options: UploadRequestOption<any>) => {
    const { file, onSuccess, onError } = options
    try {
        console.log('***file', file);

    } catch (error) {
        onError?.(error as Error)
    }
}
const beforeUpload = (file: any) => {
    try {
        selectedFile.value = file
        return false
    } catch (error) {
        console.log('****upload error', error);
        return false
    }

}

</script>

<style scoped lang="scss">
.model-action-btn {
    width: 50%;
    height: 3em;
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

.cancel-form-btn:hover {
    background-color: rgb(255, 244, 242);
}

.double-form-btn {
    display: flex;
    justify-content: 1em;
    gap: 1em;
}

:deep .ant-input-number .ant-input-number-in-form-item,
.ant-picker {
    width: 100%;
    display: block !important;
}

:where(.css-dev-only-do-not-override-17yhhjv).ant-input-number {
    width: 100%;
    display: block !important;
}

.preview-warning {
    margin-block: 1.25em;
    font-weight: 600;
    text-align: center;

}

.upload-label {
    margin-block: 1.25em;
    text-align: center;
}

.upload-text {
    text-wrap-style: balance;
}

:deep .ant-upload-wrapper {
    width: 100%;

}

:deep .ant-upload {
    display: block;

    .ant-btn {
        width: 100%;
        height: fit-content;
        display: block;
    }

    .ant-btn:hover {
        border-color: #d9d9d9;
        outline: #d9d9d9;
        color: black
    }
}

.upload-here {
    width: 100%
}
</style>
