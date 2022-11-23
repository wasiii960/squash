import axios from "axios";
import {
  NEWS,
  NEWS_CLEAR,
  NEWS_ERROR,
  NEWS_SINGLE,
  NEWS_INIT_STATE,
} from "./types";
import { setAlert } from "./alertT";

export const loadNews = () => async (dispatch) => {
  try {
    const res = await axios.get(
      "https://squashsiteserver.alliancetechltd.com/api/newsfeed"
    );
    dispatch({
      type: NEWS,
      payload: res.data,
    });
    dispatch({
      type: NEWS_CLEAR,
    });
  } catch (error) {
    dispatch({
      type: NEWS_ERROR,
      payload: {
        msg: error.response.data,
        status: error.response.status,
      },
    });
  }
};

export const loadSingleArticle = (id) => async (dispatch) => {
  try {
    const res = await axios.get(
      `https://squashsiteserver.alliancetechltd.com/api/newsfeed/${id}`
    );
    dispatch({
      type: NEWS_SINGLE,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: NEWS_ERROR,
      payload: {
        msg: error.response.data,
        status: error.response.status,
      },
    });
  }
};

export const addNewsArticle = (formdata, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    await axios.post(
      `https://squashsiteserver.alliancetechltd.com/api/newsFeed`,
      formdata,
      config
    );
    dispatch({ type: NEWS_INIT_STATE });
    dispatch(setAlert("News Article Added Successfully!", "success"));
    navigate("/news-feed");
  } catch (err) {
    const errors = err.response.data;
    if (errors) {
      dispatch(setAlert(errors, "danger"));
    }
    dispatch({
      type: NEWS_ERROR,
      payload: {
        msg: err.response.data,
        status: err.response.status,
      },
    });
  }
};

export const editNewsArticle = (id, formdata, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    await axios.put(
      `https://squashsiteserver.alliancetechltd.com/api/newsFeed/${id}`,
      formdata,
      config
    );
    // dispatch({ type: NEWS_INIT_STATE });
    dispatch(setAlert("Article changed Successfully!", "success"));
    localStorage.removeItem("articleId");
    navigate("/news-feed");
  } catch (err) {
    const errors = err.response.data;
    if (errors) {
      dispatch(setAlert(errors, "danger"));
    }
    dispatch({
      type: NEWS_ERROR,
      payload: {
        msg: err.response.data,
        status: err.response.status,
      },
    });
  }
};

export const deleteArticle = (id, navigate) => async (dispatch) => {
  if (window.confirm("Are You Sure you Want to delete this News Article?")) {
    try {
      await axios.delete(
        `https://squashsiteserver.alliancetechltd.com/api/newsFeed/${id}`
      );
      // dispatch({ type: NEWS_INIT_STATE });
      dispatch(setAlert("News Article removed", "success"));
      navigate("/news-feed");
    } catch (err) {
      const errors = err.response.data;
      if (errors) {
        dispatch(setAlert(errors, "danger"));
      }
      dispatch({
        type: NEWS_ERROR,
        payload: {
          msg: err.response.data,
          status: err.response.status,
        },
      });
    }
  }
};
