import axios from "axios";
import { useRouter } from "vue-router";

const serverUrl = import.meta.env.VITE_SERVER_UR;

const instance = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});
instance.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("auth_token"); // Assuming your token is stored in localStorage
  if (authToken) {
    config.headers["Authorization"] = `Bearer ${authToken}`; // Attach token as Authorization header
  }
  return config;
});
instance.interceptors.response.use((response) => {
  const router = useRouter();
  if (response.status === 403 || response.status === 401) {
    axios.post(`${serverUrl}/auth/logout`).then(() => {
      router.replace("/auth/login");
    });
  }

  return response;
});

export default instance;
