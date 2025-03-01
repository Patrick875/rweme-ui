<template>
  <div>
    <div>
      <Table :data="foodRequests" :title="'Feed Requests'" :length="String(foodRequests.length)"
        :handle-table-search="handleSearch" :handleViewDetails="openFoodRequest" :open-filter="openFilter"
        :reset-filter="resetFilter" :handlePrimaryButtonClicks="() => (isCreateFoodRequest = true)"
        :user-can-delete="false" :btn-name="isSupplier ? '' : 'Submit food Request'"
        :columns="!isSupplier ? columns : supplierColums" :handle-export="exportToExcell" />
      <FoodRequestModal :cancelButton="() => (isCreateFoodRequest = false)"
        :isToggleFoodRequestModal="isCreateFoodRequest"></FoodRequestModal>
      <FoodRequestDetailsModal v-if="viewableFoodRequest" :cancelButton="() => (isViewFoodRequest = false)"
        :isToggleFoodRequestModal="isViewFoodRequest && viewableFoodRequest"
        :viewableFoodRequest="viewableFoodRequest.value" :viewableFoodRequestId="viewableItemId" :loading="loading"
        :openComfirmationModal="() => (isComfirmRequestReception = true)" :foodRequest="viewableFoodRequest.value">
      </FoodRequestDetailsModal>

      <Modal :isOpen="isComfirmRequestReception" @modal-close="() => (isComfirmRequestReception = false)"
        mainHeader="COMFIRM FOOD RECEPTION" subHeader="" :width="isSmallScreen ? '80%' : '550px'">
        <template #content>
          <div class="otp-confirm-container">
            <div class="otp-confirm-header">
              <p class="otp-description">
                To confirm farmer agreement, input the verification code sent to
                the farmer's mobile number
              </p>
              <div class="otp-input-group">
                <OTPPad @entered="(v) => (otpValue = v)" />
              </div>
              <a-button class="submit-btn" @click="submitOtp" :loading="loading" :disabled="!isOtpComplete">
                SUBMIT
              </a-button>
            </div>
          </div>
        </template>
      </Modal>
      <Modal :isOpen="isToggleFilter" @modal-close="closeFilterModal" mainHeader="Filter"
        subHeader="Fill the form to filter" :width="isSmallScreen ? '80%' : '550px'">
        <template #content>
          <filter-feed-requests :cancelButton="closeFilterModal"></filter-feed-requests>
        </template>
      </Modal>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useEntitiesStore } from "../store/entities.store";
import { useAuthStore } from "../store/auth.store";
import { userRoles } from "../utils/enums";
import instance from "../api";
import { notify } from "../utils/notify";
import { useScreenSize } from "../utils/useScreenSize";
import * as xlsx from "xlsx";

const { isSmallScreen } = useScreenSize();
const entitiesStore = useEntitiesStore();
const authStore = useAuthStore();
const logedInUser = computed(() => authStore.user);
const isSupplier = computed(
  () => logedInUser.value?.role === userRoles.supplier
);
const viewableItemId = computed(() => entitiesStore.viewableItemId);
const viewableFoodRequest: any = ref<null>;
const loading = ref<boolean>(false);
const otpValue = ref("");

if (isSupplier.value) {
  entitiesStore.getRequestsBySupplier(logedInUser.value.Supplier.id);
} else {
  entitiesStore.getFoodRequests();
}

const foodRequests = computed(() =>
  entitiesStore.foodrequests.map((el) => ({
    ...el,
    farmerName: el.Farmer.fullName,
    typeoffeed: el?.TypeOfFeed?.name,
    quantity: el.quantityOfFeed,
    price: el.price,
    supplierName: el?.Supplier?.User?.fullName,
    deliveryStatus: el.deliveryStatus,
    submittedOn: new Date(el.createdAt).toLocaleDateString("fr-FR"),
    isFoodRequest: true,
    id: el.id,
  }))
);
const handleSearch = (q: string) => {
  if (logedInUser.value?.role === userRoles.supplier) {
    entitiesStore.getRequestsBySupplier(logedInUser.value?.Supplier.id, q);
  } else {
    entitiesStore.getFoodRequests(q);
  }
};
const isCreateFoodRequest = ref<boolean>(false);
const isViewFoodRequest = ref<boolean>(false);
const isComfirmRequestReception = ref<boolean>(false);

const columns = [
  {
    title: "Farmer",
    dataIndex: "farmerName",
    key: "farmerName",
  },
  {
    title: "Type of feed",
    dataIndex: "typeoffeed",
    key: "typeoffeed",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantityOfFeed",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "priceOfFeed",
  },
  {
    title: "Supplier",
    dataIndex: "supplierName",
    key: "supplierName",
  },
  {
    title: "Submitted On",
    dataIndex: "submittedOn",
    key: "submittedOn",
  },
  {
    title: "Submitted By",
    dataIndex: "submittedBy",
    key: "submittedBy",
  },
  // {
  //   title: "Status",
  //   dataIndex: "deliveryStatus",
  //   key: "deliveryStatus",
  // },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "action",
  },
];
const supplierColums = columns.filter((el) => el.key !== "supplierName");
const openFoodRequest = (record: any) => {
  viewableFoodRequest.value = record;
  isViewFoodRequest.value = true;
};

const props = defineProps({
  cancelButton: {
    type: Function,
    default: () => { },
  },
  next: {
    type: Function,
    default: () => { },
  },
});

const isOtpComplete = computed(() => {
  return otpValue.value.length === 6;
});
const isToggleFilter = ref<boolean>(false);

const openFilter = () => {
  isToggleFilter.value = true;
};
const closeFilterModal = () => {
  isToggleFilter.value = false;
};

const resetFilter = async () => {
  await entitiesStore.getFoodRequests();
};

const submitOtp = async () => {
  loading.value = true;

  if (otpValue.value.length === 6 && /^\d{6}$/.test(otpValue.value)) {
    try {
      const response = await instance.post("/foodrequests/comfirmdelivery", {
        otp: otpValue.value,
        requestId: viewableFoodRequest.value.id,
      });
      notify("success", "Success", response.data.message);
      setTimeout(() => {
        props.cancelButton();
        props.next();
      }, 3500);
    } catch (error) {
      console.error("Confirmation Failed:", error);
      notify("error", "Confirmation Failed", "");
      setTimeout(() => {
        props.cancelButton();
      }, 3500);
    } finally {
      // entitiesStore.getFoodRequests();
      entitiesStore.getRequestsBySupplier(logedInUser.value?.Supplier.id, '');
      otpValue.value = "";
    }
  } else {
    console.error("Invalid OTP");
  }
  loading.value = false;
};

const exportToExcell = (data: Array<any>, entity: string) => {
  const headers = isSupplier
    ? supplierColums
      .filter((el) => el.title !== "Actions")
      .map((el) => el.title)
    : columns.filter((el) => el.title !== "Actions").map((el) => el.title);
  const excelData = [headers];
  data.forEach((item) => {
    const rowData = [
      item.farmerName || "",
      item.typeoffeed || "",
      item.quantityOfFeed || "",
      item.price.toLocaleString() || "",
      item.submittedOn || "",
      item.submittedBy || "",
      item.deliveryStatus || "",
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
</script>
<style scoped lang="scss">
.otp-input-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1rem;
}

.otp-input {
  width: 32px;
  height: 32px;
  text-align: center;
  border: none;
  border-bottom: 1.5px solid #d2d2d2;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-bottom-color: #007bff;
  }
}

.submit-btn {
  width: 100%;
  height: 34px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #0056b3;
    color: white;
  }
}
</style>
