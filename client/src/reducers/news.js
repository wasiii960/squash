import {
  NEWS,
  NEWS_CLEAR,
  NEWS_ERROR,
  NEWS_SINGLE,
  NEWS_INIT_STATE,
} from "../tasks/types";

const initialState = {
  news: null,
  singleArticle: null,
  singleArticleLoading: true,
  loading: true,
  error: {},
};

export default function foo(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case NEWS:
      return {
        ...state,
        news: payload,
        loading: false,
      };
    case NEWS_CLEAR:
      return {
        ...state,
        singleArticle: null,
        singleArticleLoading: true,
      };
    case NEWS_SINGLE:
      return {
        ...state,
        singleArticle: payload,
        singleArticleLoading: false,
      };
    case NEWS_INIT_STATE:
      return {
        ...initialState,
      };
    case NEWS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
