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
    visualizeDetection: builder.query<Blob, number>({
      query: (id) => ({
        url: `/visualize/${id}`,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useDetectHorsesMutation, useLazyVisualizeDetectionQuery } =
  detectApi;
