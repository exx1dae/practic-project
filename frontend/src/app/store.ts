import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/shared/api";
import { detectionsSliceReducer } from "@/entities/Detections";

export const store = configureStore({
  reducer: {
    detections: detectionsSliceReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
