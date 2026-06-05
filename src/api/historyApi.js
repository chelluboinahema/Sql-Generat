import api from "./axios";

export const getAllHistory = async () => {

    const res =

        await api.get(
            "/v1/api/sql/history"
        );

    return res.data;

};

export const getHistory = async (id) => {

    const res =

        await api.get(
            `/v1/api/sql/history/${id}`
        );

    return res.data;

};

export const deleteHistory = async (id) => {

    await api.delete(
        `/v1/api/sql/history/${id}`
    );

};

export const deleteAllHistory = async (list) => {

    await Promise.all(

        list.map(

            item =>

                api.delete(
                    `/v1/api/sql/history/${item.id}`
                )

        )

    );

};