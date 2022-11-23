import axios from "axios";
import {
  PLAYERS,
  PLAYER_SINGLE,
  PLAYER_CLEAR,
  PLAYERS_ERROR,
  PLAYERS_INIT_STATE,
} from "./types";
import { setAlert } from "./alertT";

export const loadPlayers = () => async (dispatch) => {
  try {
    const res = await axios.get(
      "https://squashsiteserver.alliancetechltd.com/api/profiles/players"
    );
    dispatch({
      type: PLAYERS,
      payload: res.data,
    });
    dispatch({
      type: PLAYER_CLEAR,
    });
  } catch (error) {
    dispatch({
      type: PLAYERS_ERROR,
      payload: {
        msg: error.response.data,
        status: error.response.status,
      },
    });
  }
};

export const loadSinglePlayer = (id) => async (dispatch) => {
  try {
    const res = await axios.get(
      `https://squashsiteserver.alliancetechltd.com/api/profiles/players/single/${id}`
    );
    dispatch({
      type: PLAYER_SINGLE,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PLAYERS_ERROR,
      payload: {
        msg: error.response.data,
        status: error.response.status,
      },
    });
  }
};

export const editPlayer = (id, status, navigate) => async (dispatch) => {
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
    dispatch({ type: PLAYERS_INIT_STATE });
    dispatch(setAlert("Player Status changed Successfully!", "success"));
    localStorage.removeItem("PlayerId");
    navigate("/players");
  } catch (err) {
    const errors = err.response.data;
    if (errors) {
      dispatch(setAlert(errors, "danger"));
    }
    dispatch({
      type: PLAYERS_ERROR,
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
