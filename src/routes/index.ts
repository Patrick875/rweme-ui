import { createRouter, createWebHistory } from "vue-router";
import authRoutes from "./auth";
import adminRoutes from "./admin";

const routes = [...authRoutes, ...adminRoutes];
const router = createRouter({
	history: createWebHistory(),
	routes,
});
export default router;
