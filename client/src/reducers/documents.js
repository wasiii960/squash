import {
  DOCUMENTS,
  CLEAR_DOCUMENT,
  DOCUMENT_SINGLE,
  DOCUMENTS_ERROR,
  DOCUMENTS_INIT_STATE,
} from "../tasks/types";

const initialState = {
  documents: null,
  singleDocument: null,
  singleDocumentLoading: true,
  loading: true,
  error: {},
};

export default function foo(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case DOCUMENTS:
      return {
        ...state,
        documents: payload,
        loading: false,
      };
    case CLEAR_DOCUMENT:
      return {
        ...state,
        singleDocument: null,
        singleDocumentLoading: true,
      };
    case DOCUMENT_SINGLE:
      return {
        ...state,
        singleDocument: payload,
        singleDocumentLoading: false,
      };
    case DOCUMENTS_INIT_STATE:
      return {
        ...initialState,
      };
    case DOCUMENTS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
