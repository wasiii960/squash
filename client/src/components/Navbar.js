import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { IoMdKey } from "react-icons/io";

import AlertBanner from "./AlertBanner";
import { logout } from "../tasks/authT";
// import logo from "../assets/images/simphone Title.png";

const Navbar = ({ isAuthenticated, user, logout }) => {
  const navigate = useNavigate();
  let [open, setOpen] = useState(false);
  return (
    <>
      <div className="w-full fixed top-0 left-0 z-10">
        <div className="md:flex items-center justify-between shadow-2xl h-20 bg-slate-50 py-4 md:px-10 px-7">
          <div
            className={`h-full font-bold text-3xl text-primary cursor-pointer md:flex items-center
          ${!isAuthenticated ? "" : "md:visible hidden"}`}
          >
            <Link to={"/"}>
              <div className="w-72 h-14 rounded overflow-hidden mx-8">
                {/* <img className="w-full h-full" src={logo} alt="logo" /> */}
                SQUASH SITE
              </div>
            </Link>
          </div>
          {isAuthenticated ? (
            <div
              onClick={() => setOpen(!open)}
              className={`flex flex-row justify-center items-center py-1 right-8 top-6 cursor-pointer rounded border-2 text-xl border-primary text-primary duration-500
               ${!open && "hover:bg-primary  hover:text-white"}`}
            >
              <BiUserCircle className="h-6 w-6 mx-2" /> {user.name}
              <MdKeyboardArrowDown className="h-6 w-6 ml-2" />
              {open && <Dropdown logout={logout} navigate={navigate} />}
            </div>
          ) : (
            <>
              {/* <div
                onClick={() => setOpen(!open)}
                className="text-2xl absolute right-8 top-6 cursor-pointer md:hidden"
              >
                {open ? <RiCloseFill /> : <ImMenu />}
              </div>
              <ul
                className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-slate-50 md:z-auto z-[-1]
         left-0 md:w-auto w-full md:pl-0 pl-9 transition-all duration-500 ease-in-out
          ${
            open
              ? "top-20 opacity-100"
              : "top-[-490px] md:opacity-100 opacity-0"
          }`}
              >
                {links.map((link) => (
                  <li key={link.name} className="md:ml-8 text-xl md:my-0 my-7">
                    <Link
                      to={link.link}
                      className="text-secondry hover:text-primary duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <button
                  onClick={(e) => navigate("/login")}
                  className="bg-primary border-2 border-primary text-white text-xl 
                font-bold hover:border-primary hover:bg-white hover:text-primary duration-300
                rounded-lg shadow-xl px-8 py-1.5"
                >
                  Sign In
                </button>
              </ul> */}
            </>
          )}
        </div>
        <AlertBanner />
      </div>
    </>
  );
};

function Dropdown({ logout, navigate }) {
  function MenuItem({ leftIcon, onClick, children }) {
    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className=" h-14 flex items-center rounded duration-500 p-2 hover:bg-primary font-semibold text-white"
      >
        <span className="w-4 h-4 flex items-center mx-1">{leftIcon}</span>
        {children}
      </div>
    );
  }
  return (
    <div className="flex flex-col absolute top-16 w-40 -translate-x-5 duration-1000 bg-secondry text-white rounded overflow-hidden text-sm">
      <MenuItem
        onClick={(e) => navigate("/changePassword")}
        leftIcon={<IoMdKey />}
      >
        Change Password
      </MenuItem>
      <MenuItem onClick={(e) => logout()} leftIcon={<RiLogoutBoxLine />}>
        Logout
      </MenuItem>
    </div>
  );
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default connect(null, { logout })(Navbar);
