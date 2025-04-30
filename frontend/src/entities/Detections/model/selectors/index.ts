import { RootState } from "@/app/store.ts";

export const getDetectionPreviewUrl = (state: RootState) =>
  state.detections.detectionPreviewUrl;

export const getVisualizeDetectionLoading = (state: RootState) =>
  state.detections.isVisualizeDetectionLoading;
