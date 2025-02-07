<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="Types Of Feed">
      <Table :data="typesOfFood" :title="'Types of feed'" :length="typesOfFood.length.toString()" :columns="columns"
        :handle-table-search="searchFeed" :handle-delete-item="deleteFeed"
        :handlePrimaryButtonClicks="() => (isCreateItem = true)" :btn-name="'Create type of feed'"
        :handle-export="exportToExcell" />
      <Modal :isOpen="isCreateItem" @modal-close="() => (isCreateItem = false)" mainHeader="CREATE FEED"
        subHeader="Please provide the following details" :width="isSmallScreen ? '80%' : '550px'">
        <template #content>
          <a-form :model="createForm" ref="formRef" name="basic" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }"
            autocomplete="off" @finish="createFood" @finishFailed="onFinishFailed">
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item class="label-input-height" label="Name" name="name" :rules="[
                  { required: true, message: 'Please input the name!' },
                ]">
                  <a-input class="input" placeholder="Please enter the name" v-model:value="createForm.name" />
                </a-form-item>
              </a-col>
            </a-row>
            <div class="double-form-btn g-flex">
              <a-button class="cancel-form-btn" danger html-type="button"
                @click="() => (isCreateItem = false)">CANCEL</a-button>
              <a-button :loading="loading" class="btn-auth" html-type="submit">CREATE
              </a-button>
            </div>
          </a-form>
        </template>
      </Modal>
    </a-tab-pane>
    <a-tab-pane key="2" tab="Veternary Specializations">
      <Table :data="specializations" :title="'Vet-Specializations'" :length="specializations.length.toString()"
        :columns="columns" :handle-table-search="searchSpecialization" :handle-delete-item="deleteSpecialization"
        :handlePrimaryButtonClicks="() => (isCreateItem = true)" :btn-name="'Create '"
        :handle-export="exportToExcell" />
      <Modal :isOpen="isCreateItem" @modal-close="() => (isCreateItem = false)" mainHeader="CREATE SPECIALIZATION"
        subHeader="Please provide the following details to create a veternary specialization"
        :width="isSmallScreen ? '80%' : '550px'">
        <template #content>
          <a-form :model="createForm" ref="formRef" name="basic" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }"
            autocomplete="off" @finish="createSpecialization" @finishFailed="onFinishFailed">
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item class="label-input-height" label="Name" name="name" :rules="[
                  { required: true, message: 'Please input the name!' },
                ]">
                  <a-input class="input" placeholder="Please enter the name" v-model:value="createForm.name" />
                </a-form-item>
              </a-col>
            </a-row>
            <div class="double-form-btn g-flex">
              <a-button class="cancel-form-btn" danger html-type="button"
                @click="() => (isCreateItem = false)">CANCEL</a-button>
              <a-button :loading="loading" class="btn-auth" html-type="submit">CREATE SPECIALIZATION</a-button>
            </div>
          </a-form>
        </template>
      </Modal>
    </a-tab-pane>
    <a-tab-pane key="3" tab="Types Of Chicken">
      <Table :data="typesOfChicken" :title="'Types of chicken'" :length="typesOfChicken.length.toString()"
        :columns="columns" :handle-table-search="searchChicken" :handle-delete-item="deleteChickenType"
        :handlePrimaryButtonClicks="() => (isCreateItem = true)" :btn-name="'Create type'"
        :handle-export="exportToExcell" />

      <Modal :isOpen="isCreateItem" @modal-close="() => (isCreateItem = false)" mainHeader="CREATE SPECIALIZATION"
        subHeader="Please provide the following details" :width="isSmallScreen ? '80%' : '550px'">
        <template #content>
          <a-form :model="createForm" ref="formRef" name="basic" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }"
            autocomplete="off" @finish="createChicken" @finishFailed="onFinishFailed">
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item class="label-input-height" label="Name" name="name" :rules="[
                  { required: true, message: 'Please input the name!' },
                ]">
                  <a-input class="input" placeholder="Please enter the name" v-model:value="createForm.name" />
                </a-form-item>
              </a-col>
            </a-row>
            <div class="double-form-btn g-flex">
              <a-button class="cancel-form-btn" danger html-type="button"
                @click="() => (isCreateItem = false)">CANCEL</a-button>
              <a-button :loading="loading" class="btn-auth" html-type="submit">CREATE
              </a-button>
            </div>
          </a-form>
        </template>
      </Modal>
    </a-tab-pane>
    <a-tab-pane key="4" tab="Contract settings">
      <div class="tab-title-container">
        <p class="contract-details-title">CONTRACT DETAILS</p>
        <div @click="editContractDetails = true" class="text-icon">
          <v-icon :scale="1.5" fill='#075985' class="active-style active-icon-style action-icon" name="la-edit-solid" />
          <span class="contract-details-title">Update contract details</span>
        </div>
      </div>
      <div class="card-container">
        <a-row :gutter="[4, 12]">
          <a-col :span="isSmallScreen ? 24 : 8">
            <Card :title="'Contract Title'" :status="'Active'">
              <template #content>
                <p>{{ contractDetails.title }}</p>
              </template>
            </Card>
          </a-col>
          <a-col :span="isSmallScreen ? 24 : 8">
            <Card :title="'Business name'" :status="'Active'">
              <template #content>
                <p>{{ contractDetails.businessName }}</p>
              </template>
            </Card>
          </a-col>
          <a-col :span="isSmallScreen ? 24 : 8">
            <Card :title="'Profit percentage'" :status="'Active'">
              <template #content>
                <p>{{ `${contractDetails.profitPercentage}%` }}</p>

              </template>
            </Card>
          </a-col>
          <a-col :span="isSmallScreen ? 24 : 8">
            <Card :title="'MOMO Pay code'" :status="'Active'">
              <template #content>
                <p>{{ contractDetails.momo }}</p>
              </template>
            </Card>
          </a-col>
          <a-col :span="isSmallScreen ? 24 : 8">
            <Card :title="'Bussiness name on signature'" :status="'Active'">
              <template #content>
                <p>{{ contractDetails.businessNameOnSignature }}</p>
              </template>
            </Card>
          </a-col>
          <a-col :span="isSmallScreen ? 24 : 8">
            <Card :title="'Bussiness signature'" :status="'Active'">
              <template #content>
                <img style="padding-top:0.5em; object-fit:contain; width:100%;height:100px"
                  :src="`${contractDetails.businessSignature}`" alt='business signature' />
              </template>
            </Card>
          </a-col>
        </a-row>
      </div>
      <Modal :isOpen="editContractDetails" @modal-close="() => (editContractDetails = false)"
        mainHeader="UPDATE CONTRACT DETAILS" subHeader="Please provide the following details"
        :width="isSmallScreen ? '80%' : '550px'">
        <template #content>
          <a-form :model="contractDetailsUpdateForm" ref="formRef" name="basic" :label-col="{ span: 24 }"
            :wrapper-col="{ span: 24 }" autocomplete="off" @finish="updateContractDetails"
            @finishFailed="onFinishFailed">
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item class="label-input-height" label="Title" name="title" :rules="[
                  { required: true, message: 'Please input the title!' },
                ]">
                  <a-input class="input" placeholder="Please enter the title"
                    v-model:value="contractDetailsUpdateForm.title" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item class="label-input-height" label="Business name" name="businessName" :rules="[
                  { required: true, message: 'Please input the business name!' },
                ]">
                  <a-input class="input" placeholder="Please enter the business name"
                    v-model:value="contractDetailsUpdateForm.businessName" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item class="label-input-height" label="Name of business person on contract"
                  name="businessNameOnSignature" :rules="[
                    { required: true, message: 'Please input the title!' },
                  ]">
                  <a-input class="input" placeholder="Please enter the name"
                    v-model:value="contractDetailsUpdateForm.businessNameOnSignature" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item class="label-input-height" label="Profit percentage" name="profitPercentage" :rules="[
                  { required: true, message: 'Please input the profit percentage!' },
                ]">
                  <a-input-number class="input" :min="0.01" placeholder="Please enter the percentage" :step="0.01"
                    v-model:value="contractDetailsUpdateForm.profitPercentage" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item class="label-input-height" label="MOMO paycode" name="momo" :rules="[
                  { required: true, message: 'Please input the paycode!' },
                ]">
                  <a-input-number class="input" placeholder="Please enter the paycode"
                    v-model:value="contractDetailsUpdateForm.momo" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <p class='label-input-height'> Update signature</p>
                <img style="width:100%;height:100px; object-fit: contain;"
                  :src="`${contractDetails.businessSignature}`" />
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
              </a-col>
            </a-row>
            <div class="double-form-btn g-flex">
              <a-button class="cancel-form-btn" danger html-type="button"
                @click="() => (editContractDetails = false)">CANCEL</a-button>
              <a-button :loading="updatingDetails" class="btn-auth" html-type="submit">UPDATE
              </a-button>
            </div>
          </a-form>
        </template>
      </Modal>
    </a-tab-pane>
  </a-tabs>
</template>
<script lang="ts" setup>

import { computed, ref } from "vue";
import { useEntitiesStore } from "../store/entities.store";
import Table from "../components/Table.vue";
import instance from "../api";
import { notify } from "../utils/notify";
import { useScreenSize } from "../utils/useScreenSize";
import { validateFileBeforeUpload, validateFileOnChange } from "../utils/uploadValidator"
import * as xlsx from "xlsx";
import { UploadRequestOption } from "ant-design-vue/es/vc-upload/interface";
import { uploadToCloudinary } from '../utils/uploadToCloudinary'
const { isSmallScreen } = useScreenSize();
const activeKey = ref("1");
const fileList = ref([]);
const entitiesStore = useEntitiesStore();
entitiesStore.getTypesOfFeed();
entitiesStore.getSpecializations();
entitiesStore.getTypesOfChicken();
entitiesStore.getContractDetails()

const isCreateItem = ref<boolean>(false);
const updatingDetails = ref<boolean>(false);
const editContractDetails = ref<boolean>(false)
const typesOfFood = computed(() =>
  entitiesStore.typeoffeeds.map((el) => ({
    ...el,
    createdAt: new Date(el.createdAt).toLocaleString("fr-FR"),
  }))
);
const specializations = computed(() =>
  entitiesStore.specializations.map((el) => ({
    ...el,
    createdAt: new Date(el.createdAt).toLocaleString("fr-FR"),
  }))
);
const handleChange = (info: any) => {
  const validationResult = validateFileOnChange(info, fileList)
  return validationResult
}
const customRequest = async (options: UploadRequestOption<any>) => {
  const { file, onSuccess, onError } = options
  try {
    console.log('***file', file);

  } catch (error) {
    onError?.(error as Error)
  }
}
const beforeUpload = async (file: any) => {
  try {
    const result = await uploadToCloudinary(file as File)

    if (result) {
      contractDetailsUpdateForm.value.businessSignature = result;
    }
    return false

  } catch (error) {
    console.log('****upload error', error);
    return false
  }

}
const contractDetails = computed(() =>
  entitiesStore.contractDetails.length > 0 ? entitiesStore.contractDetails[0] : {
    id: 1,
    title: '',
    businessName: '',
    businessNameOnSignature: '',
    momo: '',
    businessSignature: '',
    profitPercentage: 0
  }
)
const updateContractDetails = async () => {
  updatingDetails.value = true
  try {
    const res = await instance.patch(`/contract-details/${contractDetailsUpdateForm.value.id}`, {
      title: contractDetailsUpdateForm.value.title,
      businessName: contractDetailsUpdateForm.value.businessName,
      businessNameOnSignature: contractDetailsUpdateForm.value.businessNameOnSignature,
      momo: contractDetailsUpdateForm.value.momo,
      profitPercentage: contractDetailsUpdateForm.value.profitPercentage,
      businessSignature: contractDetailsUpdateForm.value.businessSignature
    })
    if (res) {
      await entitiesStore.getContractDetails()
    }
    notify('success', 'Success', 'Contract details updated !!!')
  } catch (error) {
    notify('error', 'failed', 'contract details update failed !!!')
  } finally {
    updatingDetails.value = false

  }
}
const typesOfChicken = computed(() =>
  entitiesStore.typeofchicken.map((el) => ({
    ...el,
    createdAt: new Date(el.createdAt).toLocaleString("fr-FR"),
  }))
);
const loading = ref(false);

const createForm = ref({
  name: "",
});
const contractDetailsUpdateForm = ref({
  id: contractDetails.value.id,
  title: contractDetails.value.title,
  businessName: contractDetails.value.businessName,
  businessNameOnSignature: contractDetails.value.businessNameOnSignature,
  momo: contractDetails.value.momo,
  profitPercentage: contractDetails.value.profitPercentage,
  businessSignature: contractDetails.value.businessSignature
})

const createFood = async () => {
  loading.value = true;
  try {
    await instance.post("/typeoffeeds", createForm.value);
    entitiesStore.getTypesOfFeed();
  } catch (error) {
    console.log("errr", error);
  } finally {
    loading.value = false;
    createForm.value.name = "";
  }
};
const createSpecialization = async () => {
  loading.value = true;
  try {
    await instance.post("/specializations", createForm.value);
    entitiesStore.getSpecializations();
  } catch (error) {
    console.log("errr", error);
  } finally {
    loading.value = false;
    createForm.value.name = "";
  }
};

const createChicken = async () => {
  loading.value = true;
  try {
    await instance.post("/typeofchicken", createForm.value);
    entitiesStore.getTypesOfChicken();
  } catch (error) {
    console.log("errr", error);
  } finally {
    loading.value = false;
    createForm.value.name = "";
  }
};
const searchChicken = (q: string) => {
  entitiesStore.getTypesOfChicken(q);
};
const searchFeed = (q: string) => {
  entitiesStore.getTypesOfFeed(q);
};
const searchSpecialization = (q: string) => {
  entitiesStore.getSpecializations(q);
};
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "createdAt",
    dataIndex: "createdAt",
    key: "createdAt",
    format: (val) => new Date(val).toLocaleDateString(),
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "action",
  },
];
const deleteFeed = async (feedId: string) => {
  loading.value = true;
  try {
    await entitiesStore.deleteItem(`/typeoffeeds/${feedId}`);
    notify("success", "Success", "");
    entitiesStore.getTypesOfFeed();
  } catch (error) {
    notify("error", "Error", "");
    console.log("err", error);
  } finally {
    loading.value = false;
  }
};
const deleteChickenType = async (chickenTypeId: string) => {
  loading.value = true;
  try {
    await entitiesStore.deleteItem(`/typeofchicken/${chickenTypeId}`);
    notify("success", "Success", "");
    entitiesStore.getTypesOfChicken();
  } catch (error) {
    notify("error", "Error", "");
    console.log("err", error);
  } finally {
    loading.value = false;
  }
};
const deleteSpecialization = async (specId: string) => {
  loading.value = true;
  try {
    await entitiesStore.deleteItem(`/specializations/${specId}`);
    notify("success", "Success", "");
    entitiesStore.getSpecializations();
  } catch (error) {
    notify("error", "Error", "");
    console.log("err", error);
  } finally {
    loading.value = false;
  }
};

const onFinishFailed = (errorInfo: unknown) => {
  console.log("Failed:", errorInfo);
};

const exportToExcell = (data: Array<any>, entity: string) => {
  const headers = columns
    .filter((el) => el.title !== "Actions")
    .map((el) => el.title);
  const excelData = [headers];
  data.forEach((item) => {
    console.log("----createdAt", new Date(item.createdAt));

    const rowData = [item.name || "", item.createdAt || ""];
    excelData.push(rowData);
  });
  const workSheet = xlsx.utils.aoa_to_sheet(excelData);
  const columnWidths = [
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
  ];

  workSheet["!cols"] = columnWidths;
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, workSheet, entity);
  xlsx.writeFile(workbook, `${entity.toLocaleLowerCase()}.xlsx`);
};
</script>

<style scoped lang="scss">
// @import "../styles/auth";
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

  .all-upload-text:hover {
    color: black
  }
}

:deep .ant-input-number {
  display: block;
  width: 100%;
}

.upload-here {
  width: 100%
}

.text-icon {
  display: flex;
  align-items: center;
  gap: 1em;
  background-color: white;
  padding: 0.5em;
  border-radius: 0.5em;
  cursor: pointer
}

.tab-title-container {
  margin-block: 1em;
  display: flex;
  justify-content: space-between;

  @media (max-width: 800px) {
    display: block;
    margin-block: 1em;
  }
}

.contract-details-title {
  font-weight: bold;
  text-transform: uppercase;
}

.double-form-btn {
  display: flex;
  justify-content: space-between;
  gap: 1em;

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
    }
  }

  @media (max-width: 800px) {

    .btn-auth,
    .cancel-form-btn {
      padding: 0.4em;
    }
  }
}
</style>
