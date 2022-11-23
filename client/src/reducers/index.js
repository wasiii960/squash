import { combineReducers } from "redux";

import auth from "./auth";
import news from "./news";
import alert from "./alert";
import admins from "./admins";
import videos from "./videos";
import coaches from "./coach";
import players from "./players";
import packages from "./packages";
import dashboard from "./dashboard";
import documents from "./documents";

export default combineReducers({
  auth,
  news,
  alert,
  admins,
  videos,
  coaches,
  players,
  packages,
  dashboard,
  documents,
});
