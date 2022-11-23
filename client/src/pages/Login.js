import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

// import image from "../assets/images/squash-cover.png";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";
import { login } from "../tasks/authT";
import TextInput from "../components/TextInput";

function Login({ isAuthenticated, loading, user, login }) {
  const [myLoading, setMyLoading] = useState(false);
  const [formValue, setformValue] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!loading) {
      setMyLoading(false);
    }
  }, [setMyLoading, loading]);

  const { email, password } = formValue;

  const handleChange = (e) => {
    setformValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    setMyLoading(true);
  };

  if (!loading) {
    if (isAuthenticated) {
      return <Navigate to="/dashboard" />;
    }
  }

  return myLoading ? (
    <Spinner />
  ) : (
    <>
      <Navbar isAuthenticated={false} user={null} />
      <div className=" bg-white mb-8 flex h-screen justify-center items-center">
        {/* <div className="max-w-md w-full mx-auto">
          <img className="mt-5" src={image} alt="Loading......" />
        </div> */}
        <div className="max-w-md w-full mx-auto justify-end mt-14 bg-white p-8 shadow-2xl rounded-3xl">
          <form className="space-y-6" onSubmit={(e) => onSubmit(e)}>
            <div>
              <h1 className="text-center font-bold text-3xl mb-12 text-primary">
                Login
              </h1>
              <TextInput
                label={"Email"}
                value={email}
                name={"email"}
                type={"email"}
                required={true}
                onChange={(e) => handleChange(e)}
                placeholder="john@doe.com"
              />
            </div>

            <div>
              <TextInput
                label={"password"}
                value={password}
                onChange={(e) => handleChange(e)}
                name="password"
                type="password"
                required={true}
                placeholder="Enter Your Password"
                autoComplete="true"
              />
            </div>

            <div>
              <input
                type="submit"
                value="LOG IN"
                className="w-full py-2 px-2 bg-primary hover:bg-white hover:text-primary border-primary border-2 rounded-xl text-white text-lg font-semibold duration-500 cursor-pointer"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

Login.propTypes = {
  loading: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  role: PropTypes.object,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  user: state.auth.user,
});

export default connect(mapStateToProps, { login })(Login);
