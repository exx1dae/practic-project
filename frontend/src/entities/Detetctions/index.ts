export type { Detection } from "./model/types";
export {
  useGetDetectionsHistoryQuery,
  useLazyGetDetectionsHistoryQuery,
  useDeleteDetectionHistoryItemMutation,
} from "./model/api/detectionsApi";

export { DetectionsDataTable } from "./ui/DetectionsDataTable";
