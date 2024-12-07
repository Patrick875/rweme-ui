import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "vue-router";
import { notify } from "../utils/notify";

const localServer: string = "http://localhost:5000/api/v1";
// const liveServer:string

const instance = axios.create({
	baseURL: localServer,
	withCredentials: true,
});

export default instance;
