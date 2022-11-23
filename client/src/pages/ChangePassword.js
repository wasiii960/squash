import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
import { changePassword } from "../tasks/authT";
// import SidebarFranchise from "../components/SidebarFranchise";

const ChangePassword = ({ isAuthenticated, loading, user, changePassword }) => {
  const conformPasswordRef = useRef();
  const [password, setPassword] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passowrdConform, setPasswordConform] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (passwordNew !== passowrdConform) {
      conformPasswordRef.current.className =
        " text-center text-lg outline-none text-black font-semibold mx-10 ml-20 my-2 px-2 border-2 border-rose-700 rounded bg-gray-300 border-secondry transition-all duration-150 py-0.5";
    } else {
      conformPasswordRef.current.className =
        "text-black font-semibold mx-10 my-2 px-2 border-2 rounded bg-gray-300 border-secondry focus:border-lime-600 transition-all duration-150 py-0.5 text-center text-lg outline-none ml-20 text-center text-lg outline-none";
      changePassword(password, passwordNew);
    }
  };

  const onChangePasswordConform = (e) => {
    setPasswordConform(e.target.value);
  };

  return loading ? (
    <Spinner />
  ) : (
    <>
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      {/* {user.role === "ADMIN" ? <Sidebar /> : <SidebarFranchise />} */}
      <div className="flex flex-col h-screen">
        <div className=" flex justify-center mt-24">
          <h1 className=" text-3xl font-bold text-zinc-800">
            You can change your Account Password
          </h1>
        </div>
        <div className="flex flex-col py-28 justify-center items-center">
          <form onSubmit={(e) => onSubmit(e)}>
            <div className=" flex justify-between items-center mt-16">
              <label className=" text-primary font-semibold px-5 text-lg mr-3">
                Your Current Password:
              </label>
              <input
                className=" text-black font-semibold mx-10 my-2 px-2 border-2 rounded bg-gray-200 border-secondry  
                focus:border-lime-600 transition-all duration-150 py-0.5 text-center text-lg outline-none ml-20"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*******"
                required
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-primary font-semibold px-5 text-lg mr-1">
                Your New Password:
              </label>
              <input
                className=" text-black font-semibold mx-10 my-2 px-2 border-2 rounded bg-gray-200 border-secondry
                focus:border-lime-600 transition-all duration-150 py-0.5 text-center text-lg outline-none ml-20"
                type="password"
                name="passwordNew"
                value={passwordNew}
                onChange={(e) => setPasswordNew(e.target.value)}
                placeholder="*******"
                required
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-primary font-semibold px-5 text-lg">
                Conform Your New Password:
              </label>
              <input
                ref={conformPasswordRef}
                className=" text-black font-semibold mx-10 my-2 px-2 border-2 rounded bg-gray-200 border-secondry 
                focus:border-lime-600 transition-all duration-150 py-0.5 text-center text-lg outline-none ml-20"
                type="password"
                value={passowrdConform}
                onChange={(e) => onChangePasswordConform(e)}
                name="passwordConform"
                placeholder="*******"
                required
              />
            </div>
            <div className="flex w-full justify-center mt-10">
              <input
                type="submit"
                value="Change Password"
                className="px-4 py-2 rounded bg-secondry text-white hover:bg-primary ring-primary cursor-pointer
            hover:ring-2 duration-500 font-semibold"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

ChangePassword.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  changePassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.userLoading,
  user: state.auth.user,
});
export default connect(mapStateToProps, { changePassword })(ChangePassword);
