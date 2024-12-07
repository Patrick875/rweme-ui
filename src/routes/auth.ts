import AccountConfirmation from "../views/AccountConfirmation.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import Login from "../views/Login.vue";

const authRoutes = [
	{
		path: "/login",
		name: "Login",
		component: Login,
	},
	{
		path: "/forgot-password",
		name: "Forgot Password",
		component: ForgotPassword,
	},
	{
		path: "/comfirm-account",
		name: "Confirm Account",
		component: AccountConfirmation,
	},
];

export default authRoutes;
