import { NotificationPlacement } from "ant-design-vue";
import { defineStore } from "pinia";
import instance from "../api";
import { notify } from "../utils/notify";
import { entities } from "../utils/enums";
import { useRouter } from "vue-router";

const defaultState = {
	farmers: [] as any,
	farmer: null as any,
	veternaries: [] as any,
	specializations: [] as any,
	suppliers: [] as any,
	selectedFarmerId: "",
	typeofchicken: [] as any,
	typeoffeeds: [] as any,
	provinces: [] as any,
	districts: [] as any,
	sectors: [] as any,
	cells: [] as any,
	villages: [] as any,
	success: false,
	successMessage: "",
	failure: false,
	failureMessage: "",
};

export const useEntitiesStore = defineStore({
	id: "farmers",
	state: () => ({
		...defaultState,
	}),
	actions: {
		async getFarmers() {
			this.resetStatuses();
			const router = useRouter();
			try {
				const response = await instance.get("/farmers");
				this.farmers = response.data.data;
			} catch (err: any) {
				if (err.response.status === 401 || err.response.status === 403) {
					router.replace("/login");
				}
			}
		},
		async getFarmer(farmerId: string) {
			this.resetStatuses();

			try {
				const response = await instance.get(`/farmers/${farmerId}`);
				console.log("the response", response);
				this.farmer = response.data.data;
			} catch (err) {
				console.log("err", err);
				notify("error", "error fetching farmer", err.response.data.message);
			}
		},
		async getVeternaries() {
			this.resetStatuses();

			try {
				const response = await instance.get("/veternaries");
				this.veternaries = response.data.data;
			} catch (err) {
				console.log("err", err);
			}
		},
		async getSuppliers() {
			this.resetStatuses();

			try {
				const response = await instance.get("/suppliers");
				this.suppliers = response.data.data;
			} catch (err) {
				console.log("err", err);
			}
		},
		async getTypesOfChicken() {
			this.resetStatuses();

			try {
				const response = await instance.get("/typeofchicken");
				this.typeofchicken = response.data.data;
			} catch (err) {
				console.log("err", err);
			}
		},
		async getTypesOfFeed() {
			this.resetStatuses();

			try {
				const response = await instance.get("/typeoffeeds");
				this.typeoffeeds = response.data.data;
			} catch (err) {
				console.log("err", err);
			}
		},
		async getSpecializations() {
			this.resetStatuses();

			try {
				const response = await instance.get("/specializations");
				this.specializations = response.data.data;
			} catch (err) {
				console.log("err", err);
			}
		},
		async createVeternary(data: any) {
			this.resetStatuses();

			try {
				const response = await instance.post("/veternaries", data);
				this.getVeternaries();
				notify("success", "Success !!!", response.data.message);
			} catch (err: any) {
				console.log("err", err);
				notify("error", "Error loging in !!!", err.response.data.message);
			}
		},
		async createSupplier(data: any) {
			this.resetStatuses();

			try {
				const response = await instance.post("/suppliers", data);
				this.getSuppliers();
				notify("success", "Success !!!", response.data.message);
			} catch (err: any) {
				console.log("err", err);
				notify("error", "Error loging in !!!", err.response.data.message);
			}
		},
		async createFarmer(data: any) {
			this.resetStatuses();

			try {
				const response = await instance.post("/farmers", data);

				if (response) {
					console.log("res", response);
					localStorage.setItem("newFarmer", JSON.stringify(response.data.data));
					this.success = true;
				}

				this.getFarmers();
				notify("success", "Success !!!", response.data.message);
			} catch (err: any) {
				console.log("err", err);
				notify("error", "Error Creating Farmer!!!", err.response.data.message);
			}
		},
		async addFarmStatus(data: any) {
			this.resetStatuses();

			try {
				const response = await instance.post("/farmstatus", data);
				if (response) {
					this.getFarmer(data.farmerId);
				}
				notify("success", "Status Recorded", "", "top");
			} catch (err) {
				console.log("err", err);
				notify("error", "Error", err.response.data.message, "top");
			}
		},
		async getLocations() {
			this.resetStatuses();

			try {
				const provinces = await instance.get("/locations/provinces");
				const districts = await instance.get("/locations/districts");
				const sectors = await instance.get("/locations/sectors");
				const cells = await instance.get("/locations/cells");
				const villages = await instance.get("/locations/villages");
				if (provinces) {
					this.$patch((state) => {
						state.provinces = provinces.data.data;
					});
				}
				if (districts) {
					this.$patch((state) => {
						state.districts = districts.data.data;
					});
				}
				if (sectors) {
					this.$patch((state) => {
						state.sectors = sectors.data.data;
					});
				}
				if (cells) {
					this.$patch((state) => {
						state.cells = cells.data.data;
					});
				}
				if (villages) {
					this.$patch((state) => {
						state.villages = villages.data.data;
					});
				}
			} catch (err) {
				console.log("err", err);
				notify("error", "Error loging in !!!", err.response.data.message);
			}
		},
		async deleteItem(deleteUrl: string, entity: entities) {
			this.resetStatuses();

			try {
				const response = await instance.delete(deleteUrl);
				if (response) {
					notify("success", "Deleted", response.data.message);
					if (entity == entities.farmers) {
						this.getFarmers();
					} else if (entity === entities.veternaries) {
						this.getVeternaries();
					} else if (entity === entities.suppliers) {
						this.getSuppliers;
					}
				}
			} catch (error) {
				console.log("err", error);
			}
		},
		resetStatuses() {
			this.success = false;
			this.failure = false;
			(this.successMessage = ""), (this.failureMessage = "");
		},
	},
});
