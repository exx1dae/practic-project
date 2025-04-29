import { api } from "@/shared/api.ts";
import { DetectHorsesResponse } from "../types";

const detectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    detectHorses: builder.mutation<DetectHorsesResponse, FormData>({
      query: (formData) => ({
        url: "/detect",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["DetectHorses"],
    }),
  }),
});

export const { useDetectHorsesMutation } = detectApi;
