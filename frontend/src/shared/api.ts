import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api",
});

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  endpoints: (_) => ({}),
  tagTypes: ["DetectHorses"],
});
