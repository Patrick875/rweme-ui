<template>
  <div>
    <Table :data="farmers" :title="'Farmers'" :length="String(farmers.length)" :user-can-delete="!isVeternary"
      :loading="loading" :handleTableSearch="handleSearch" :handlePrimaryButtonClicks="handleCreateFarmer"
      :handle-update-action="handleUpdateFarmer" :btn-name="'Add new farmer'" :columns="columns"
      :handleDeleteItem="deleteFarmer" :open-filter="openFilter" :reset-filter="resetFilter"
      :handle-export="exportToExcell" />
    <Modal :isOpen="isToggleCreateFarmer" @modal-close="closeCreateFarmerModal" mainHeader="CREATE FARMER"
      subHeader="Fill the details to create a new farmer" :width="isSmallScreen ? '80%' : '550px'">
      <template #content>
        <create-farmer-form :onComplete="next" :cancelButton="closeCreateFarmerModal"></create-farmer-form>
      </template>
    </Modal>
    <Modal :isOpen="isToggleSignContract" @modal-close="closeCloseContractSignModal" mainHeader="SIGN CONTRACT"
      subHeader="click sign to sign the contract " :width="isSmallScreen ? '80%' : '550px'">
      <template #content>
        <farmer-contract :loading="loading" :cancelButton="closeCloseContractSignModal"
          :sign="handleFarmerContract"></farmer-contract>
      </template>
    </Modal>
    <Modal :isOpen="isToggleFilterFarmers" @modal-close="closeFilterFarmersModal" mainHeader="Filter"
      subHeader="fill the form to filter " :width="isSmallScreen ? '80%' : '550px'">
      <template #content>
        <farmer-filter :cancelButton="closeFilterFarmersModal"></farmer-filter>
      </template>
    </Modal>
    <Modal :isOpen="isToggleComfirmFarmer" @modal-close="closeComfirmFarmerModal" mainHeader="" subHeader=""
      :width="'550px'">
      <template #content>
        <ComfirmOTP :cancelButton="closeComfirmFarmerModal"></ComfirmOTP>
      </template>
    </Modal>
    <Modal :isOpen="isUpdateFarmer && updateFarmer && updateFarmer !== ''" @modal-close="closeUpdateFarmerModal"
      mainHeader="" subHeader="" :width="'550px'">
      <template #content>
        <UpdateFarmerModal :cancel-button="closeUpdateFarmerModal" :farmerId="updateFarmer ? updateFarmer : ''" />
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import instance from "../api";
import { ref, computed, nextTick } from "vue";
import Table from "../components/Table.vue";
import { useEntitiesStore } from "../store/entities.store";
import { useAuthStore } from "../store/auth.store";
import { userRoles } from "../utils/enums";
import { useScreenSize } from "../utils/useScreenSize";
import * as xlsx from "xlsx";
import UpdateFarmerModal from "../components/UpdateFarmerModal.vue";

const { isSmallScreen } = useScreenSize();
const loading = ref<boolean>(false);
const entitiesStore = useEntitiesStore();
const authStore = useAuthStore();
const logedInUser = computed(() => authStore.user);
const isVeternary = computed(
  () => logedInUser.value?.role === userRoles.veternary
);
const updateFarmer = ref<string | null>(null)
const isToggleCreateFarmer = ref<boolean>(false);
const isUpdateFarmer = ref<boolean>(false);
const isToggleFilterFarmers = ref<boolean>(false);
const farmers = computed(() =>
  entitiesStore.farmers.map((item) => ({
    ...item,
    isFarmer: true,
    location: item?.Village?.name,
    veternaryInCharge: item?.Veternary?.User?.fullName,
    key: item.id,
  }))
);
const isToggleSignContract = ref<boolean>(false);
const closeCloseContractSignModal = () => {
  isToggleSignContract.value = false;
};
const closeFilterFarmersModal = () => {
  isToggleFilterFarmers.value = false;
};
const openFilter = () => {
  isToggleFilterFarmers.value = true;
};
const resetFilter = async () => {
  await entitiesStore.getFarmers();
};
const handleUpdateFarmer = async (farmerId: string) => {
  updateFarmer.value = null;
  await nextTick();
  updateFarmer.value = farmerId
  isUpdateFarmer.value = true
}
const closeUpdateFarmerModal = () => {
  updateFarmer.value = null;
  isUpdateFarmer.value = false

}

const columns = [
  { title: "Name", dataIndex: "fullName", key: "fullName" },
  { title: "Location", dataIndex: "location", key: "location" },
  {
    title: "Type of chicken",
    dataIndex: "typeOfChicken",
    key: "typeOfChicken",
  },
  {
    title: "Number of Chicken",
    dataIndex: "numberOfChicken",
    key: "numberOfChicken",
  },
  {
    title: "Veternary In Charge",
    dataIndex: "veternaryInCharge",
    key: "veternaryInCharge",
  },
  { title: "Status", dataIndex: "status", key: "status" },
  { title: "Actions", dataIndex: "actions", key: "action" },
];

const closeCreateFarmerModal = () => {
  isToggleCreateFarmer.value = false;
};
const handleCreateFarmer = () => {
  isToggleCreateFarmer.value = true;
};
const next = () => {
  isToggleCreateFarmer.value = false;
  isToggleSignContract.value = true;
};
const deleteFarmer = async (farmerId: string) => {
  loading.value = true;
  try {
    await entitiesStore.deleteItem(`/farmers/${farmerId}`);
    entitiesStore.getFarmers();
  } catch (error) {
    console.log("err", error);
  } finally {
    loading.value = false;
  }
};
const handleSearch = (q: string) => {
  entitiesStore.getFarmers(q);
};
const isToggleComfirmFarmer = ref<boolean>(false);

const closeComfirmFarmerModal = () => {
  isToggleComfirmFarmer.value = false;
};
const handleFarmerContract = async () => {
  isToggleComfirmFarmer.value = true;
  const farmer = localStorage.getItem("newFarmer");
  const newFarmer = JSON.parse(farmer as string);
  try {
    loading.value = true;
    if (newFarmer) {
      await instance.post(`/farmers/sendotp/${newFarmer.id}`);
    } else {
      console.log("local-storage-error");
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    loading.value = false;
    isToggleSignContract.value = false;
  }
};
const exportToExcell = (data: Array<any>, entity: string) => {
  const headers = columns
    .filter((el) => el.title !== "Actions")
    .map((el) => el.title);
  const excelData = [headers];
  data.forEach((item) => {
    const rowData = [
      item.fullName || "",
      item.location || "",
      item.typeOfChicken || "",
      item.numberOfChicken || "",
      item.veternaryInCharge || "",
      item.status || "",
    ];
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
  xlsx.writeFile(workbook, `${entity.toLocaleUpperCase()}.xlsx`);
};

entitiesStore.getFarmers();
</script>

<style scoped></style>
