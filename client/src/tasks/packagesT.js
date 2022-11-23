import axios from "axios";
import {
  PACKAGES,
  PACKAGES_CLEAR,
  PACKAGES_ERROR,
  PACKAGES_SINGLE,
  PACKAGES_INIT_STATE,
} from "./types";
import { setAlert } from "./alertT";

export const loadPackages = () => async (dispatch) => {
  try {
    const res = await axios.get(
      "https://squashsiteserver.alliancetechltd.com/api/subPackages"
    );
    dispatch({
      type: PACKAGES,
      payload: res.data,
    });
    dispatch({
      type: PACKAGES_CLEAR,
    });
  } catch (error) {
    dispatch({
      type: PACKAGES_ERROR,
      payload: {
        msg: error.response.data,
        status: error.response.status,
      },
    });
  }
};

export const loadSinglePackage = (id) => async (dispatch) => {
  try {
    const res = await axios.get(
      `https://squashsiteserver.alliancetechltd.com/api/subPackages/single/${id}`
    );
    dispatch({
      type: PACKAGES_SINGLE,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PACKAGES_ERROR,
      payload: {
        msg: error.response.data,
        status: error.response.status,
      },
    });
  }
};

export const ChangePackage =
  (id, status, coachShare, comment, navigate) => async (dispatch) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({ status, coachShare, comment });
      await axios.put(
        `https://squashsiteserver.alliancetechltd.com/api/subPackages/status/${id}`,
        body,
        config
      );
      dispatch({ type: PACKAGES_INIT_STATE });
      dispatch(setAlert("Package Updated Successfully!", "success"));
      navigate("/packages/single");
    } catch (err) {
      const errors = err.response.data;
      if (errors) {
        dispatch(setAlert(errors, "danger"));
      }
      dispatch({
        type: PACKAGES_ERROR,
        payload: {
          msg: err.response.data,
          status: err.response.status,
        },
      });
    }
  };

export const removeComments = (id, navigate) => async (dispatch) => {
  try {
    await axios.put(
      `https://squashsiteserver.alliancetechltd.com/api/subPackages/clearComments/${id}`
    );
    dispatch({ type: PACKAGES_INIT_STATE });
    dispatch(setAlert("Comments Removed Successfully!", "success"));
    navigate("/packages/single");
  } catch (err) {
    const errors = err.response.data;
    if (errors) {
      dispatch(setAlert(errors, "danger"));
    }
    dispatch({
      type: PACKAGES_ERROR,
      payload: {
        msg: err.response.data,
        status: err.response.status,
      },
    });
  }
};
