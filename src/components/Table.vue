<template>
  <div class="table">
    <div class='table-header'>
      <a-row>
        <a-col v-if="!isReportsTable" class="title-table" :span="4">
          <div class="margin-text">
            {{ title }} <span class="number-style">{{ length }}</span>
          </div>
        </a-col>
        <a-col v-if="!isReportsTable" :span="8">
          <a-input v-model:value="userName" :placeholder="props.placeholder">
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
        </a-col>
        <p v-if="isReportsTable" class="margin-text" style="text-align: center;font-weight:bold">{{ title }} </p>
        <a-col v-if="!isReportsTable" :span="12">
          <div class="filter-section">
            <a-button class="btn-export" v-if="
              isShowFilter
            " @click="() => props.handleSecondaryButtonClicks()">Filter List</a-button>

            <a-button class="btn-export" @click="() => props.resetFilter()">Reset</a-button>

            <a-dropdown>
              <template #overlay>
                <a-menu @click="handleExport">
                  <a-menu-item @click="() => props.exportPDF()" key="1"> Excel </a-menu-item>
                </a-menu>
              </template>
              <a-button class="btn-export export-margin">
                Export List
                <CaretDownOutlined />
              </a-button>
            </a-dropdown>
            <span>
              <span v-if="props.btnName">
                <a-button :disabled="isDisabled" :class="!isDisabled ? 'btn-create' : 'btn-disabled'"
                  @click="() => props.handlePrimaryButtonClicks()">{{ btnName }}
                </a-button>
              </span>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>

    <a-table :columns="props.columns" :data-source="props.data">

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          {{ record.name }}
        </template>
        <template v-else-if="column.key === 'typeOfChicken' && column.title === 'Category'">
          {{ record.typeOfChicken?.toUpperCase() || 'N/A' }}
        </template>
        <template v-else-if="column.key === 'specializations'">
          <span>
            <a-tag v-for="tag in record.specializations" :key="tag" color="geekblue">
              {{ tag.name.toUpperCase() }}
            </a-tag>
          </span>
        </template>
        <template v-else-if="column.key === 'status'">
          <span>
            <a-tag
              :color="record.status === accountStatus.active ? 'success' : [accountStatus.blocked, accountStatus.deleted, accountStatus.inactive].includes(record.status) ? 'error' : 'default'">
              {{ record.status.toUpperCase() }}
            </a-tag>
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <div class="actions-column">
            <v-icon v-if="record.isFarmer" @click="onView(record)" class='view-icon-style' name="bi-eye" />
            <div class="action-icon" data-caption='Edit'>
              <v-icon v-if="record.status == accountStatus.active" class='edit-icon-style ' name="la-edit-solid" />
            </div>
            <div class='action-icon' data-caption='Activate'>
              <v-icon v-if="[accountStatus.inactive, accountStatus.blocked].includes(record.status)"
                class='active-style action-icon' name="co-check-alt" />
            </div>
            <div class='action-icon' data-caption='Deactivate'>
              <v-icon v-if="record.status == accountStatus.active" class='deactivate-icon-style action-icon'
                name="io-close-outline" />
            </div>
            <div class='action-icon' data-caption='Delete'>
              <v-icon @click="() => triggerDelete(record.id)" v-if="record.status !== accountStatus.deleted"
                class='deactivate-icon-style action-icon' name="ri-delete-bin-7-line" />
            </div>
          </div>
        </template>
      </template>
    </a-table>
    <Modal :isOpen="isToggleDeleteModal" @modal-close="closeModal" mainHeader="DELETE"
      :subHeader="`Are you sure you want to delete this ${currentEntity}`" :width="'550px'">
      <template #content>
        <div class='delete-btns'>
          <a-button class="cancel-form-btn" danger html-type="button" @click="closeModal">CANCEL</a-button>
          <a-button :loading="loading" class="btn-auth" @click="deleteItem">Delete</a-button>
        </div>
      </template>
    </Modal>
  </div>

</template>
<script lang="ts" setup>
import { PropType, ref, watch } from 'vue';
import { accountStatus, entities } from '../utils/enums';
import { useRouter, useRoute } from 'vue-router'
import { useEntitiesStore } from '../store/entities.store';
interface Column {
  title: string
  dataIndex: string
  key: string
}
const entitiesStore = useEntitiesStore()
const router = useRouter();
const route = useRoute()
const currentEntity = route.fullPath.substring(1, route.fullPath.length - 1)
const onView = (record) => {
  if (record.isFarmer) {
    router.push(`/farmers/${record.id}`)
  }
}
const deleteTargetItemId = ref<string>('')
const triggerDelete = (recordId: string) => {
  isToggleDeleteModal.value = true
  deleteTargetItemId.value = recordId as string
}
const loading = ref<boolean>(false);
const isToggleDeleteModal = ref<boolean>(false);
const closeModal = () => {
  isToggleDeleteModal.value = false
}

const deleteItem = async () => {
  loading.value = true;
  let deleteUrl = `${currentEntity}s/${deleteTargetItemId.value}`
  const deleteEntity = currentEntity === 'farmer' ? entities.farmers : currentEntity === 'veternarie' ? entities.veternaries : currentEntity === 'supplier' ? entities.suppliers : entities.farmStatuses
  try {
    await entitiesStore.deleteItem(deleteUrl, deleteEntity);
  } catch (error) {
    console.log('err', error);

  } finally {
    loading.value = false
    setTimeout(() => {
      isToggleDeleteModal.value = false;
    }, 5000);
  }
}
watch([isToggleDeleteModal], ([newVal]) => {
  if (newVal === false) {
    deleteTargetItemId.value = ''
  }
})

const userName = ref<string>('')

const props = defineProps({
  columns: {
    type: Array as PropType<Column[]>,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  length: {
    type: String,
    default: "",
  },
  btnName: {
    type: String,
    default: "",
    required: false,
  },
  isShowFilter: {
    type: Boolean,
    default: true,
    required: false,
  },
  placeholder: {
    type: String,
    default: "Search for a user", // Default placeholder text
  },
  buttonComponent: {
    type: Object as PropType<any>,
    required: false,
    default: null,
  },
  handlePrimaryButtonClicks: {
    type: Function,
    default: () => { },
  },
  exportPDF: {
    type: Function,
    default: () => { },
  },
  handleApproveClientAccount: {
    type: Function,
    default: () => { },
  },
  handleRejectClientAccount: {
    type: Function,
    default: () => { },
  },
  handleExport: {
    type: Function,
    default: () => { },
  },
  handleDeleteModalClick: {
    type: Function,
    default: () => { },
  },
  handleSecondaryButtonClicks: {
    type: Function,
    default: () => { },
  },
  resetFilter: {
    type: Function,
    default: () => { },
  },

  handlerToggleApplicationRevertModal: {
    type: Function,
    default: () => { },
  },
  handlerToggleApplicationViewModal: {
    type: Function,
    default: () => { },
  },
  handlerToggleApplicationDispatchModal: {
    type: Function,
    default: () => { },
  },
  handlerToggleApplicationCancelModal: {
    type: Function,
    default: () => { },
  },
  redirectToConfirmation: {
    type: Function,
    default: () => { },
  },
  handleApplicationSampleReception: {
    type: Function,
    default: () => { },
  },
  redirectToPayment: {
    type: Function,
    default: () => { },
  },
  isTableBorder: {
    type: Boolean,
    default: false,
  },
  isReportsTable: {
    type: Boolean,
    default: false,
  },
  isPaginated: {
    type: Boolean,
    default: true,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  isApiPagination: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  apiCurrentPage: {
    type: Number,
    default: 1
  }
})


</script>

<style lang="scss" scoped>
@import "./../styles/table";

.actions-column {
  display: flex;
  gap: 0.10em;
  align-items: center;
}

.table-header {
  margin-bottom: 1em;
}

.delete-btns {
  width: 100%;
  display: flex;
  gap: 1em;

  :deep {
    .ant-btn {
      width: 50%;
      display: block
    }
  }
}
</style>
