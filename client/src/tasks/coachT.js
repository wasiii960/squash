import axios from "axios";
import {
  COACHES,
  COACHE_SINGLE,
  CLEAR_COACHE,
  COACHES_ERROR,
  COACHES_INIT_STATE,
} from "./types";
import { setAlert } from "./alertT";

export const loadCoaches = () => async (dispatch) => {
  try {
    const res = await axios.get(
      "https://squashsiteserver.alliancetechltd.com/api/profiles/coaches"
    );
    dispatch({
      type: COACHES,
      payload: res.data,
    });
    dispatch({
      type: CLEAR_COACHE,
    });
  } catch (error) {
    dispatch({
      type: COACHES_ERROR,
      payload: {
        msg: error.response.data,
        status: error.response.status,
      },
    });
  }
};

export const loadSingleCoach = (id) => async (dispatch) => {
  try {
    const res = await axios.get(
      `https://squashsiteserver.alliancetechltd.com/api/profiles/coaches/single/${id}`
    );
    dispatch({
      type: COACHE_SINGLE,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: COACHES_ERROR,
      payload: {
        msg: error.response.data,
        status: error.response.status,
      },
    });
  }
};

export const editCoach = (id, status, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ status });
    await axios.put(
      `https://squashsiteserver.alliancetechltd.com/api/users/status/${id}`,
      body,
      config
    );
    dispatch({ type: COACHES_INIT_STATE });
    dispatch(setAlert("Coach Status changed Successfully!", "success"));
    localStorage.removeItem("coachId");
    navigate("/coaches");
  } catch (err) {
    const errors = err.response.data;
    if (errors) {
      dispatch(setAlert(errors, "danger"));
    }
    dispatch({
      type: COACHES_ERROR,
      payload: {
        msg: err.response.data,
        status: err.response.status,
      },
    });
  }
};

// export const deleteCaptain = (id, navigate) => async (dispatch) => {
//   if (window.confirm("Are You Sure you Want to delete this captain?")) {
//     try {
//       await axios.delete(
//         `https://simphoneserver.alliancetechltd.com/api/users/captain/${id}`
//       );
//       dispatch({ type: CAPTAINS_INIT_STATE });
//       dispatch(
//         setAlert("Captain account removed form your franchise", "success")
//       );
//       navigate("/franchise-captains");
//     } catch (err) {
//       const errors = err.response.data;
//       if (errors) {
//         dispatch(setAlert(errors, "danger"));
//       }
//       dispatch({
//         type: CAPTAINS_ERROR,
//         payload: {
//           msg: err.response.data,
//           status: err.response.status,
//         },
//       });
//     }
//   }
// };
