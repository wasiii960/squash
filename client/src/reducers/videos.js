import {
  VIDEOS,
  VIDEOS_CLEAR,
  VIDEOS_ERROR,
  VIDEOS_SINGLE,
  VIDEOS_INIT_STATE,
} from "../tasks/types";

const initialState = {
  videos: null,
  singleVideo: null,
  singleVideoLoading: true,
  loading: true,
  error: {},
};

export default function foo(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case VIDEOS:
      return {
        ...state,
        videos: payload,
        loading: false,
      };
    case VIDEOS_CLEAR:
      return {
        ...state,
        singleVideo: null,
        singleVideoLoading: true,
      };
    case VIDEOS_SINGLE:
      return {
        ...state,
        singleVideo: payload,
        singleVideoLoading: false,
      };
    case VIDEOS_INIT_STATE:
      return {
        ...initialState,
      };
    case VIDEOS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
