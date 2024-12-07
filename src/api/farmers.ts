import instance from ".";

export const getAllFarmers = async () => {
	return await instance.get("/farmers").then(() => {});
};
