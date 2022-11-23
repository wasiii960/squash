import PropTypes from "prop-types";
import { connect } from "react-redux";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Submit from "../components/Submit";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import Sidebar from "../components/Sidebar";
import { addAdmin } from "../tasks/adminsT";
import TextInput from "../components/TextInput";

function AdminAdd({ isAuthenticated, loading, user, addAdmin }) {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { name, email, password } = data;

  const onChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    addAdmin(name, email, password, navigate);
  };
  return loading ? (
    <Spinner />
  ) : (
    <>
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <Sidebar />
      <div className=" h-screen overflow-auto  bg-zinc-50">
        <div className="flex flex-col justify-center items-center pt-20 pl-20">
          <h1 className="text-2xl font-semibold py-4">Add New Admin Account</h1>
          <div className="w-5/12 bg-white rounded-lg p-10 my-5">
            <form onSubmit={(e) => onSubmit(e)}>
              <TextInput
                label="Name"
                name="name"
                type="text"
                placeholder="i.e. John Doe"
                required={true}
                onChange={(e) => onChange(e)}
                Value={name}
              />
              <TextInput
                label="Email"
                name="email"
                type="email"
                placeholder="johndoe@gmail.com"
                required={true}
                onChange={(e) => onChange(e)}
                Value={email}
              />
              <TextInput
                label="Password"
                name="password"
                type="password"
                required={true}
                onChange={(e) => onChange(e)}
                Value={password}
              />
              <div className="flex flex-row space-x-4 mt-5">
                <Submit />
                <Button
                  primary="red-700"
                  secondry="zinc-200"
                  onClick={(e) => navigate("/users/admins")}
                  label="Cancel"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

AdminAdd.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  addAdmin: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  loading: state.auth.userLoading,
});

export default connect(mapStateToProps, { addAdmin })(AdminAdd);
