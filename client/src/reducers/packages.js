import {
  PACKAGES,
  PACKAGES_CLEAR,
  PACKAGES_ERROR,
  PACKAGES_SINGLE,
  PACKAGES_INIT_STATE,
} from "../tasks/types";

const initialState = {
  packages: null,
  singlePackage: null,
  singlePackageLoading: true,
  loading: true,
  error: {},
};

export default function foo(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case PACKAGES:
      return {
        ...state,
        packages: payload,
        loading: false,
      };
    case PACKAGES_CLEAR:
      return {
        ...state,
        singlePackage: null,
        singlePackageLoading: true,
      };
    case PACKAGES_SINGLE:
      return {
        ...state,
        singlePackage: payload,
        singlePackageLoading: false,
      };
    case PACKAGES_INIT_STATE:
      return {
        ...initialState,
      };
    case PACKAGES_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
