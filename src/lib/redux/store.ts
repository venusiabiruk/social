import { configureStore } from "@reduxjs/toolkit";
import { socialSparkApi } from "./services/api";

export const store = configureStore({
  reducer: {
    [socialSparkApi.reducerPath]: socialSparkApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socialSparkApi.middleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
