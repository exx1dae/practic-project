import { api } from "@/shared/api.ts";
import { GetDetectionsHistoryResponse, HistoryItem } from "../types";

export const detectionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDetectionsHistory: builder.query<HistoryItem[], void>({
      query: () => ({
        url: "/history",
      }),
      transformResponse: (response: GetDetectionsHistoryResponse) =>
        response.history,
      providesTags: ["DetectHorses"],
    }),
    deleteDetectionHistoryItem: builder.mutation<void, number>({}),
  }),
});

export const {
  useGetDetectionsHistoryQuery,
  useLazyGetDetectionsHistoryQuery,
} = detectionsApi;
