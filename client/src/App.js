import { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Routes } from "react-router-dom";

import routes from "./routes";
import { loadUser } from "./tasks/authT";
import { history } from "./utils/History";
import setAuthToken from "./utils/setAuthToken";
import { CustomRouter } from "./utils/CustomRouter";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App({ loadUser, isAuthenticated }) {
  useEffect(() => {
    if (localStorage.token) {
      loadUser();
    }
  }, [loadUser, isAuthenticated]);
  return (
    <CustomRouter history={history}>
      <Routes>
        {routes.map((route) => (
          <Route
            exact
            key={route.path}
            path={route.path}
            element={route.component}
          />
        ))}
      </Routes>
    </CustomRouter>
  );
}

App.propTypes = {
  loadUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { loadUser })(App);
