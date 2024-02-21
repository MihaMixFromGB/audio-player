import { configureStore } from "@reduxjs/toolkit";
import { audioPlayerReducer } from "./reducers";

export const store = configureStore({
  reducer: { audioPlayer: audioPlayerReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
