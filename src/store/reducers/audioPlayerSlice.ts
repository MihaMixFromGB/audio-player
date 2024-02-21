import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  isAnyOf,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AudioPlayer } from "./audioPlayer";
import { SoundTrack } from "../model";
import { RootState, AppDispatch } from "../store";

const player = new AudioPlayer(null);

const playListAdapter = createEntityAdapter<SoundTrack>({});
let initialState = playListAdapter.getInitialState();

/**
 * Set initial data (TEST ONLY)
 */
const playListSrc = [
  "https://audio-ssl.itunes.apple.com/itunes-assets/Music/v4/a6/f4/ba/a6f4ba62-68f2-eac3-a813-b0626ef71df6/mzaf_1126527984189561509.plus.aac.p.m4a",
  "https://audio-ssl.itunes.apple.com/itunes-assets/Music4/v4/de/de/37/dede37ee-e3c9-d029-c02e-c8cf150b5548/mzaf_3092856567623581067.plus.aac.p.m4a",
];
const playList = playListSrc.map<SoundTrack>((src, idx) => ({
  id: idx,
  src,
  currentInSec: 0,
  status: "stopped",
  duration: 29,
  waveform: [
    0, 0, 0, 0, 0, 1, 31, 31, 31, 31, 30, 26, 31, 31, 31, 31, 31, 27, 11, 17,
    17, 16, 12, 9, 2, 0, 0, 0, 0, 3, 12, 12, 12, 12, 11, 10, 3, 0, 0, 4, 9, 10,
    8, 6, 8, 8, 6, 3, 5, 6, 4, 5, 4, 0, 5, 5, 5, 4, 1, 2, 2, 0, 3, 3, 3, 3, 5,
    6, 5, 1, 2, 2, 1, 1, 3, 5, 6, 6, 7, 7, 6, 3, 1, 0, 0, 0,
  ],
}));
const ids = [0, 1];
initialState = {
  ...initialState,
  ids,
  entities: ids.reduce((res: Record<number, SoundTrack>, idx) => {
    res[idx] = playList[idx];
    return res;
  }, {}),
};
// --------------------------------------------------------------------------------

export type UpdatePayload = Pick<SoundTrack, "id"> &
  Partial<Pick<SoundTrack, "currentInSec" | "status">>;

export const play = createAsyncThunk<
  UpdatePayload | undefined,
  number,
  { state: RootState; dispatch: AppDispatch }
>("audioPlayer/play", async (trackId, { getState, dispatch }) => {
  const { entities } = getState().audioPlayer;
  if (player.track?.id !== trackId) {
    await setTrack({ track: entities[trackId], dispatch });
  }

  await player.play((payload) => {
    dispatch(updateState(payload));
  });

  return { id: trackId, status: "playing" };
});

export const seek = createAsyncThunk<
  UpdatePayload | undefined,
  { trackId: SoundTrack["id"]; currentInSec: number },
  { state: RootState; dispatch: AppDispatch }
>(
  "audioPlayer/seek",
  async ({ trackId, currentInSec }, { getState, dispatch }) => {
    if (player.track && player.track.id !== trackId) {
      const track = getState().audioPlayer.entities[trackId];
      await setTrack({ track, dispatch });
    }

    const newCurrentInSec = await player.seek(currentInSec);
    return { id: trackId, currentInSec: newCurrentInSec };
  }
);

export const pause = createAsyncThunk<
  UpdatePayload | undefined,
  undefined,
  { state: RootState }
>("audioPlayer/pause", async () => {
  if (!player.track) return;

  await player.pause();
  return { id: player.track.id, status: "paused" };
});

type SetTrackArgs = {
  track: SoundTrack;
  dispatch: AppDispatch;
};
const setTrack = async ({ track, dispatch }: SetTrackArgs) => {
  if (player.track && player.track.id !== track.id) {
    await dispatch(pause());
  }
  player.setTrack(track);
};

const audioPlayerSlice = createSlice({
  name: "audioPlayer",
  initialState,
  reducers: {
    updateState: (state, action: PayloadAction<UpdatePayload>) => {
      const { id, ...changes } = action.payload;
      playListAdapter.updateOne(state, { id, changes });
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(play.fulfilled, seek.fulfilled, pause.fulfilled),
      (state, action) => {
        if (!action.payload) return;
        const { id, ...changes } = action.payload;
        playListAdapter.updateOne(state, { id, changes });
      }
    );
  },
});

const { updateState } = audioPlayerSlice.actions;

export const { selectById: selectTrackById } = playListAdapter.getSelectors(
  (state: RootState) => state.audioPlayer
);

export default audioPlayerSlice.reducer;
