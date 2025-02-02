<template>
  <div v-if="loadingInitData" class="loading-state">
    <a-spin size="large" />
  </div>
  <div v-else>
    <a-form :model="farmerFilterForm" name="basic" :label-col="{ span: 24 }">
      <a-row :gutter="[16, 16]">
        <a-col :span="isSmallScreen ? 24 : 12">
          <a-form-item class="label-input-height" label="Status" name="status">
            <a-select
              v-model:value="farmerFilterForm.status"
              :size="'middle'"
              placeholder="Please select !!"
            >
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
          <a-form-item
            class="label-input-height"
            label="Chicken type"
            name="typeOfChicken"
          >
            <a-select
              v-model:value="farmerFilterForm.typeOfChicken"
              :size="'middle'"
              placeholder="Please select !!"
            >
              <a-select-option value="">---</a-select-option>
              <a-select-option value="layer">LAYER</a-select-option>
              <a-select-option value="broiler">BROILER</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="isSmallScreen ? 24 : 12">
          <a-form-item
            class="label-input-height"
            label="Number of chicken"
            name="Number of chicken"
          >
            <a-select
              v-model:value="farmerFilterForm.numberOfChicken"
              :size="'middle'"
              placeholder="Please select !!"
            >
              <a-select-option value="">---</a-select-option>
              <a-select-option value="0-100">0 to 100</a-select-option>
              <a-select-option value="100-300">100 to 300</a-select-option>
              <a-select-option value="300-500">300 to 500</a-select-option>
              <a-select-option value="500-">500 and more</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="isSmallScreen ? 24 : 12">
          <a-form-item
            class="label-input-height"
            label="Assigned Veternary"
            name="assignedTo"
            :rules="[{ message: 'Please select !!' }]"
          >
            <a-select
              v-model:value="farmerFilterForm.assignedTo"
              :size="'middle'"
              placeholder="Please select"
            >
              <a-select-option disabled value=""
                >Select veternary</a-select-option
              >
              <a-select-option
                v-for="vet in veternaries"
                :value="vet.key"
                :key="vet.key"
                >{{ vet.fullName + " / " + vet.telephone }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="isSmallScreen ? 24 : 12">
          <a-form-item
            class="label-input-height"
            label="Province"
            name="province"
          >
            <a-select
              v-model:value="farmerFilterForm.province"
              :size="'middle'"
              placeholder="Please select !!"
            >
              <a-select-option value="">---</a-select-option>
              <a-select-option
                v-for="province in provinces"
                :key="province.id"
                :value="province.key"
              >
                {{ province.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="isSmallScreen ? 24 : 12">
          <a-form-item
            class="label-input-height"
            label="District"
            name="district"
          >
            <a-select
              :disabled="!farmerFilterForm.province"
              v-model:value="farmerFilterForm.district"
              :size="'middle'"
              placeholder="Please select !!"
            >
              <a-select-option value="">---</a-select-option>

              <a-select-option
                v-for="district in districts.filter(
                  (distr) => distr.provinceId === farmerFilterForm.province
                )"
                :key="district.id"
                :value="district.key"
              >
                {{ district.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="isSmallScreen ? 24 : 12">
          <a-form-item
            class="label-input-height"
            label="Sector"
            name="farmerSector"
          >
            <a-select
              :disabled="!farmerFilterForm.district"
              v-model:value="farmerFilterForm.farmerSector"
              :size="'middle'"
              placeholder="Please select !!"
            >
              <a-select-option value="">---</a-select-option>

              <a-select-option
                v-for="sector in sectors.filter(
                  (sect) => sect.districtId === farmerFilterForm.district
                )"
                :key="sector.id"
                :value="sector.key"
              >
                {{ sector.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="isSmallScreen ? 24 : 12">
          <a-form-item class="label-input-height" label="Cell" name="cell">
            <a-select
              :disabled="!farmerFilterForm.farmerSector"
              v-model:value="farmerFilterForm.cell"
              :size="'middle'"
              placeholder="Please select !!"
            >
              <a-select-option value="">---</a-select-option>

              <a-select-option
                v-for="cell in cells.filter(
                  (cell) => cell.sectorId === farmerFilterForm.farmerSector
                )"
                :key="cell.id"
                :value="cell.key"
              >
                {{ cell.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="isSmallScreen ? 24 : 12">
          <a-form-item
            class="label-input-height"
            label="Village"
            name="address"
          >
            <a-select
              :disabled="!farmerFilterForm.cell"
              v-model:value="farmerFilterForm.village"
              :size="'middle'"
              placeholder="Please select !!"
            >
              <a-select-option value="">---</a-select-option>
              <a-select-option
                v-for="village in villages.filter(
                  (vill) => vill.cellId === farmerFilterForm.cell
                )"
                :key="village.id"
                :value="village.key"
              >
                {{ village.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <div class="double-form-btn g-flex">
        <a-button
          class="cancel-form-btn"
          danger
          html-type="button"
          @click="props.cancelButton"
          >CANCEL</a-button
        >
        <a-button :loading="loading" class="btn-auth" @click="filter"
          >FILTER</a-button
        >
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
  import { objectToQueryString } from "./../utils/helperFunctions";
  import { computed, onMounted, ref } from "vue";
  import { useScreenSize } from "../utils/useScreenSize";
  import { useEntitiesStore } from "../store/entities.store";
  import { notify } from "../utils/notify";
  const { isSmallScreen } = useScreenSize();

  const props = defineProps({
    cancelButton: {
      type: Function,
      default: () => {},
    },
  });

  const entitiesStore = useEntitiesStore();
  const loadingInitData = ref<boolean>(false);

  const loading = ref<boolean>(false);

  interface filterFormI {
    status: string | null;
    assignedTo: string | null;
    province: number | null;
    district: number | null;
    farmerSector: number | null;
    cell: number | null;
    village: number | null;
    numberOfChicken: string | null;
    typeOfChicken: string | null;
  }
  const farmerFilterForm = ref<filterFormI>({
    status: null,
    assignedTo: null,
    province: null,
    district: null,
    farmerSector: null,
    cell: null,
    village: null,
    numberOfChicken: null,
    typeOfChicken: null,
  });

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
      key: item.id,
    }))
  );
  const getMinAndMaxChicken = (range: string) => {
    let max;
    const min = Number(range.split("-")[0]);
    if (range.split("-").length == 2) {
      max = Number(range.split("-")[1]);
    }
    return {
      min,
      max,
    };
  };
  const filter = async () => {
    loading.value = true;

    const cleanFilterObj = Object.keys(farmerFilterForm.value).reduce(
      (acc, key) => {
        if (
          farmerFilterForm.value[key] != undefined &&
          farmerFilterForm.value[key] != null &&
          farmerFilterForm.value[key] != ""
        ) {
          if (key === "numberOfChicken") {
            const { min, max } = getMinAndMaxChicken(
              farmerFilterForm.value[key]
            );
            acc["minNumberOfChicken"] = min;
            if (max !== 0) {
              acc["maxNumberOfChicken"] = max;
            }
          } else {
            acc[key] = farmerFilterForm.value[key];
          }
        }
        return acc;
      },
      {}
    );

    try {
      const filterString = objectToQueryString(cleanFilterObj);
      await entitiesStore.getFarmers("", filterString);
      notify("success", "Success", "Data retrieved ");
      setTimeout(() => {
        farmerFilterForm.value = {
          status: null,
          assignedTo: null,
          province: null,
          district: null,
          farmerSector: null,
          cell: null,
          village: null,
          numberOfChicken: null,
          typeOfChicken: null,
        };
        props.cancelButton();
      }, 3000);
    } catch (error) {
      console.log("----err", error);

      notify("error", "Failed", "Filter failed ");
      farmerFilterForm.value = {
        status: null,
        assignedTo: null,
        province: null,
        district: null,
        farmerSector: null,
        cell: null,
        village: null,
        numberOfChicken: null,
        typeOfChicken: null,
      };
    } finally {
      loading.value = false;
    }
  };
  const fetchAllData = async () => {
    loadingInitData.value = true; // Start loading
    try {
      await Promise.all([
        entitiesStore.getLocations(),
        entitiesStore.getVeternaries(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      loadingInitData.value = false; // Stop loading
    }
  };
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
