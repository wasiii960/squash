import axios from "axios";
import {
  VIDEOS,
  VIDEOS_CLEAR,
  VIDEOS_ERROR,
  VIDEOS_SINGLE,
  //   VIDEOS_INIT_STATE,
} from "./types";
import { setAlert } from "./alertT";

export const loadVideos = () => async (dispatch) => {
  try {
    const res = await axios.get(
      "https://squashsiteserver.alliancetechltd.com/api/videos"
    );
    dispatch({
      type: VIDEOS,
      payload: res.data,
    });
    dispatch({
      type: VIDEOS_CLEAR,
    });
  } catch (error) {
    dispatch({
      type: VIDEOS_ERROR,
      payload: {
        msg: error.response.data,
        status: error.response.status,
      },
    });
  }
};

export const loadSingleVideo = (id) => async (dispatch) => {
  try {
    const res = await axios.get(
      `https://squashsiteserver.alliancetechltd.com/api/videos/${id}`
    );
    dispatch({
      type: VIDEOS_SINGLE,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: VIDEOS_ERROR,
      payload: {
        msg: error.response.data,
        status: error.response.status,
      },
    });
  }
};

export const ChangeVideo = (id, status, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ status });
    await axios.put(
      `https://squashsiteserver.alliancetechltd.com/api/videos/status/${id}`,
      body,
      config
    );
    //   dispatch({ type: VIDEOS_INIT_STATE });
    dispatch(setAlert("Video Updated Successfully!", "success"));
    localStorage.removeItem("videoId");
    navigate("/videos");
  } catch (err) {
    const errors = err.response.data;
    if (errors) {
      dispatch(setAlert(errors, "danger"));
    }
    dispatch({
      type: VIDEOS_ERROR,
      payload: {
        msg: err.response.data,
        status: err.response.status,
      },
    });
  }
};

// export const deleteArticle = (id, navigate) => async (dispatch) => {
//   if (window.confirm("Are You Sure you Want to delete this News Article?")) {
//     try {
//       await axios.delete(`http://localhost:5000/api/newsFeed/${id}`);
//       // dispatch({ type: NEWS_INIT_STATE });
//       dispatch(setAlert("News Article removed", "success"));
//       navigate("/news-feed");
//     } catch (err) {
//       const errors = err.response.data;
//       if (errors) {
//         dispatch(setAlert(errors, "danger"));
//       }
//       dispatch({
//         type: NEWS_ERROR,
//         payload: {
//           msg: err.response.data,
//           status: err.response.status,
//         },
//       });
//     }
//   }
// };
