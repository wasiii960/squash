import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { logout } from "../tasks/authT";

// const PrivateRoutes = ({ children, isAuthenticated, loading }) =>
//   isAuthenticated || loading ? children : <Navigate to="/" />;

// function PrivateRoutes({ children, loading, isAuthenticated, logout }) {
const PrivateRoutes = ({ children, loading, isAuthenticated, logout }) =>
  !isAuthenticated && !loading ? <Navigate to="/" /> : children;

PrivateRoutes.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});

export default connect(mapStateToProps, { logout })(PrivateRoutes);
