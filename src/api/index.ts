import axios from "axios";
import { useRouter } from "vue-router";

const localServer: string = "http://localhost:5000/api/v1";
const liveServer:string="https://rweme-platform-backend-production.up.railway.app/api/v1"

const instance = axios.create({
	baseURL: liveServer,
	withCredentials: true,
});
instance.interceptors.response.use((response) => {
	console.log("response", response);
	const router = useRouter();
	if (response.status === 403 || response.status === 401) {
		axios.post(`${localServer}/auth/logout`).then(() => {
			router.replace("/auth/login");
		});
	}
	return response;
});

export default instance;
