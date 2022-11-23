import axios from "axios";
import { DASHBOARD, DASHBOARD_ERROR, DASHBOARD_INIT_STATE } from "./types";
import { setAlert } from "./alertT";

export const loadDashData = () => async (dispatch) => {
  try {
    const res = await axios.get(
      "https://squashsiteserver.alliancetechltd.com/api/dash"
    );
    dispatch({
      type: DASHBOARD,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: DASHBOARD_ERROR,
      payload: {
        msg: error.response.data,
        status: error.response.status,
      },
    });
  }
};

export const clearAccount = (navigate) => async (dispatch) => {
  try {
    await axios.put(`https://squashsiteserver.alliancetechltd.com/api/dash`);
    dispatch({ type: DASHBOARD_INIT_STATE });
    dispatch(setAlert("Account Cleared Successfully!", "success"));
    dispatch(loadDashData());
    navigate("/dashboard");
  } catch (err) {
    const errors = err.response.data;
    if (errors) {
      dispatch(setAlert(errors, "danger"));
    }
    dispatch({
      type: DASHBOARD_ERROR,
      payload: {
        msg: err.response.data,
        status: err.response.status,
      },
    });
  }
};
