import { defineStore } from "pinia";
import { logout } from "../api/auth";

const defaultState = {
	user: null as any,
	userProfile: null as any,
};
export const useAuthStore = defineStore({
	id: "auth",
	getters: {
		loggedInUser: (state) => state.user,
	},
	state: () => ({
		...defaultState,
	}),
	actions: {
		setUser(user: any) {
			this.user = user;
		},
		async logoutUser() {
			try {
				await logout();
			} catch (error) {
				console.log("err", error);
			}
			this.user = null;
		},
	},
	// persist: {
	// 	enabled: true,
	// },
});
