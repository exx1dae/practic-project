import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DetectionsSliceState {
  detectionPreviewUrl: string;
  isVisualizeDetectionLoading: boolean;
}

const initialState: DetectionsSliceState = {
  detectionPreviewUrl: "",
  isVisualizeDetectionLoading: false,
};

export const detectionsSlice = createSlice({
  name: "detectionsSlice",
  initialState,
  reducers: {
    setPreviewUrl: (state, action: PayloadAction<string>) => {
      state.detectionPreviewUrl = action.payload;
    },
    setVisualizeDetectionLoading: (state, action: PayloadAction<boolean>) => {
      state.isVisualizeDetectionLoading = action.payload;
    },
  },
});

export const { actions: detectionsSliceActions } = detectionsSlice;
export const { reducer: detectionsSliceReducer } = detectionsSlice;
