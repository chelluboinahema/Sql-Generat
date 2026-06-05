import api from "./axios";

export const generateSql = async (input) => {
  const res = await api.post(
    "/v1/api/sql/generate",

    {
      input,
    },
  );

  return res.data;
};

export const explainSql = async (input, previousResponse = null) => {
  const payload = { input };
  if (previousResponse) payload.previousResponse = previousResponse;

  const res = await api.post(
    "/v1/api/sql/explain",

    payload,
  );

  return res.data;
};

export const optimizeSql = async (input, previousResponse = null) => {
  const payload = { input };
  if (previousResponse) payload.previousResponse = previousResponse;

  const res = await api.post(
    "/v1/api/sql/optimize",

    payload,
  );

  return res.data;
};
