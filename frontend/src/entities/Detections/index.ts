export type { Detection } from "./model/types";
export {
  useGetDetectionsHistoryQuery,
  useLazyGetDetectionsHistoryQuery,
  useDeleteDetectionHistoryItemMutation,
} from "./model/api/detectionsApi";

export {
  detectionsSliceReducer,
  detectionsSliceActions,
} from "./model/slices/detectionsSlice";

export {
  getDetectionPreviewUrl,
  getVisualizeDetectionLoading,
} from "./model/selectors";

export { DetectionsDataTable } from "./ui/DetectionsDataTable";
export { DetectionPreview } from "./ui/DetectionPreview";
export { DetectionsTabs } from "./ui/DetectionsTabs";
