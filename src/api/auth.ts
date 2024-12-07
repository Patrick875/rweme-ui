import instance from ".";
import { notify } from "../utils/notify";
import { useAuthStore } from "../store/auth.store";
interface LoginI {
	login: string;
	password: string;
}

export const login = async (login: LoginI) => {
	const { setUser } = useAuthStore();
	return await instance
		.post("/auth/login", login)
		.then((res) => {
			setUser(res.data.data);
			notify("success", "Success !!!", res.data.message);
		})
		.catch((err) => {
			notify("error", "Error loging in !!!", err.response.data.message);
			throw err;
		});
};
export const logout = async () => {
	return await instance
		.post("/auth/logout")
		.then((res) => {
			notify("success", "Success !!!", res.data.message);
		})
		.catch((err) => {
			console.log("err", err);
			notify("error", "Error loging in !!!", err.response.data.message);
			throw err;
		});
};
