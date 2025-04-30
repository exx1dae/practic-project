import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_APP_API}/api`,
});

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: (_) => ({}),
  tagTypes: ["DetectHorses"],
});
