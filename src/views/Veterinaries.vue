<template>
  <div>
    <Table
      :data="veternaries"
      :title="'Veternaries'"
      :length="String(veternaries.length)"
      :handlePrimaryButtonClicks="handleCreateToggleVeternary"
      :loading="loading"
      :handle-table-search="handleSearch"
      :handleUpdateAction="handleUpdateVet"
      :handleDeleteItem="deleteVeternary"
      :handle-update-item-status="updateVetStatus"
      :open-filter="openFilterVet"
      :reset-filter="resetFilter"
      :btn-name="'Create veternary'"
      :columns="columns"
      :handle-export="exportToExcell"
    />
    <Modal
      :isOpen="isToggleCreateVeternary"
      @modal-close="() => (isToggleCreateVeternary = false)"
      mainHeader="CREATE VETERNARY"
      subHeader="Please provide the following details to create a veternary"
      :width="isSmallScreen ? '80%' : '550px'"
    >
      <template #content>
        <create-veternary
          :cancelButton="() => (isToggleCreateVeternary = false)"
        ></create-veternary>
      </template>
    </Modal>

    <Modal
      :isOpen="isToggleUpdateModal && vet"
      @modal-close="() => (isToggleUpdateModal = false)"
      :mainHeader="'UPDATE VETERNARY'"
      :subHeader="'Provide the following details to update the veternary'"
      :width="isSmallScreen ? '80%' : '550px'"
    >
      <template #content>
        <update-veternary
          :vet="vet"
          :cancelButton="() => (isToggleUpdateModal = false)"
        ></update-veternary>
      </template>
    </Modal>
    <Modal
      :isOpen="isToggleFilterVets"
      @modal-close="closeFilterVetModal"
      mainHeader="Filter"
      subHeader="fill the form to filter"
      :width="isSmallScreen ? '80%' : '550px'"
    >
      <template #content>
        <veternary-filter
          :cancelButton="closeFilterVetModal"
        ></veternary-filter>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import Table from "../components/Table.vue";
  import Modal from "../components/Modal.vue";
  import { useEntitiesStore } from "../store/entities.store";
  import { useScreenSize } from "../utils/useScreenSize";
  import * as xlsx from "xlsx";

  const { isSmallScreen } = useScreenSize();
  const entitiesStore = useEntitiesStore();
  const loading = ref<boolean>(false);
  const isToggleCreateVeternary = ref<boolean>(false);
  const isToggleUpdateModal = ref<boolean>(false);
  const isToggleFilterVets = ref<boolean>(false);
  const vet = computed(() => entitiesStore.veternary);
  const handleUpdateVet = async (vetId: string) => {
    await entitiesStore.getVeternary(vetId);
    isToggleUpdateModal.value = true;
  };
  const openFilterVet = () => {
    isToggleFilterVets.value = true;
  };
  const closeFilterVetModal = () => {
    isToggleFilterVets.value = false;
  };
  const resetFilter = async () => {
    await entitiesStore.getVeternaries();
  };
  const handleCreateToggleVeternary = () => {
    isToggleCreateVeternary.value = !isToggleCreateVeternary.value;
  };

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
  const handleSearch = (q: string) => {
    entitiesStore.getVeternaries(q);
  };

  const deleteVeternary = async (veterinaryId: string) => {
    loading.value = true;
    try {
      await entitiesStore.deleteItem(`/veterinaries/${veterinaryId}`);
      entitiesStore.getVeternaries();
    } catch (error) {
      console.log("err", error);
    } finally {
      loading.value = false;
      setTimeout(() => {}, 5000);
    }
  };

  const updateVetStatus = async (data: any) => {
    loading.value = true;
    try {
      await entitiesStore.updateStatus(`/veterinaries/status-update`, {
        ...data,
        veternaryId: data.itemId,
      });
      entitiesStore.getVeternaries();
    } catch (error) {
      console.log("err", error);
    } finally {
      loading.value = false;
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Telephone",
      dataIndex: "telephone",
      key: "telephone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Specializations",
      dataIndex: "specializations",
      key: "specializations",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
    },
  ];
  const exportToExcell = (data: Array<any>, entity: string) => {
    const headers = columns
      .filter((el) => el.title !== "Actions")
      .map((el) => el.title);
    const excelData = [headers];
    data.forEach((item) => {
      const rowData = [
        item.fullName || "",
        item.location || "",
        item.telephone || "",
        item.email || "",
        item.specializations.length > 0
          ? item.specializations.map((el) => el.name.toUpperCase()).join(" ,")
          : "",
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
    xlsx.writeFile(workbook, `${entity.toLocaleLowerCase()}.xlsx`);
  };

  entitiesStore.getVeternaries();
</script>

<style scoped lang="scss"></style>
