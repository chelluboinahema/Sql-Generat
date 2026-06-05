import api from "./axios";

export const getAllUsersHistory = async () => {
  const res = await api.get("/v1/api/admin/history");

  return res.data;
};

export const deleteUserHistory = async (id) => {
  await api.delete(`/v1/api/admin/history/${id}`);
};
