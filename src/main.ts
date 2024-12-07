import { createApp } from "vue";
import {createPinia} from 'pinia'
import "./style.css";
import App from "./App.vue";
import router from "./routes";
import { OhVueIcon,addIcons } from "oh-vue-icons";
import {
    BiArrowLeft,
	IoAddCircleOutline,BiPatchCheck,
	BiEye,
	MdDashboardOutlined,
	IoCloseOutline,
	RiDeleteBin7Line,
	CoCheckAlt,
	GiFarmTractor,
	FaUserMd,
	FaUserTie,
	LaEditSolid,
	SiCashapp,
	RiSettings5Line,
	HiSolidUserCircle,
} from "oh-vue-icons/icons";

addIcons(BiArrowLeft,IoAddCircleOutline,BiPatchCheck,BiEye,CoCheckAlt,MdDashboardOutlined,IoCloseOutline, GiFarmTractor, FaUserMd, FaUserTie,LaEditSolid, SiCashapp, RiDeleteBin7Line, RiSettings5Line,HiSolidUserCircle);

const pinia= createPinia()

createApp(App)
.component('v-icon',OhVueIcon)
.use(pinia)
.use(router)
.mount("#app");

