import { useAppSelector } from "./useRedux";
import { selectTrackById } from "../store/selectors";

const useTrack = (trackId: number) => {
  return useAppSelector((state) => selectTrackById(state, trackId));
};

export default useTrack;
