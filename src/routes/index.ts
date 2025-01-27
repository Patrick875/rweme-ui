import { createRouter, createWebHistory } from "vue-router";
import authRoutes from "./auth";
import adminRoutes from "./admin";
import supplierRoutes from "./supplier";
import veternaryRoutes from "./veternary";
import { useAuthStore } from "../store/auth.store";

const routes = [...authRoutes, ...adminRoutes, ...supplierRoutes, ...veternaryRoutes];
const router = createRouter({
	history: createWebHistory(),
	routes,
});

// router.beforeEach((to, from, next) => {
// 	const authStore = useAuthStore();
// 	const user = authStore.user;
// 	if (!user) {
// 		router.replace("/auth/login");
// 	}
// });

export default router;
