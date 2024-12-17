import axios from "axios";

const localServer: string = "http://localhost:5000/api/v1";
// const liveServer:string

const instance = axios.create({
	baseURL: localServer,
	withCredentials: true,
});

export default instance;
