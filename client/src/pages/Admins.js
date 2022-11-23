import React, { useEffect, useRef } from "react";
import { VscTrash } from "react-icons/vsc";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import store from "../store";
import { history } from "../utils/History";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import Sidebar from "../components/Sidebar";
import { loadAdmins, deleteAdmin } from "../tasks/adminsT";
import { PaginationTable } from "../components/PaginationTable";
import { useNavigate } from "react-router-dom";

const COLUMNS = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Delete",
    accessor: "_id",
    Cell: ({ value }) => (
      <button
        className="bg-rose-800 text-white font-bold cursor-pointer hover:bg-white
         hover:text-gray-800 rounded p-1 duration-500"
        onClick={(event) => onEditClicked({ value }, event)}
      >
        <VscTrash className="w-6 h-6" />
      </button>
    ),
  },
];

const onEditClicked = (e, event) => {
  event.stopPropagation();
  store.dispatch(deleteAdmin(e.value));
  history.push("/users/admins");
};

function Admins({
  isAuthenticated,
  loading,
  authloading,
  user,
  admins,
  loadAdmins,
}) {
  const tableInstance = useRef(null);
  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const navigate = useNavigate();

  const handleSelection = (e) => {};

  return loading || authloading ? (
    <Spinner />
  ) : user._id === "634e5483a0cf5bb246d0f351" ? (
    <>
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <Sidebar />
      <div className=" h-screen overflow-auto">
        <div className="pt-24 pl-20 flex flex-col">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl font-semibold">All Admins</h1>
            <input
              className="text-md p-1 text-center font-medium bg-secondry focus:text-secondry rounded-md text-white focus:ring-2 focus:bg-slate-50 focus:ring-primary outline-none transition-all duration-700"
              placeholder="Search"
              onChange={(e) => {
                tableInstance.current.setGlobalFilter(e.target.value);
              }}
            />
          </div>
          <PaginationTable
            COLUMNS={COLUMNS}
            tableData={admins}
            ref={tableInstance}
            handleSelection={handleSelection}
          />
          <div className="flex items-center justify-center">
            <button
              onClick={(e) => navigate("/users/admins/add-new")}
              className="bg-sky-600 w-1/3 py-0.5 px-3 rounded text-white font-semibold text-xl border-2 border-sky-600 hover:bg-zinc-100 hover:text-sky-600 cursor-pointer duration-300"
            >
              Add New Admin
            </button>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <Sidebar />
      <div className=" h-screen overflow-auto">
        <div className="pt-24 pl-20 flex flex-col h-full">
          <div className="flex h-full justify-center items-center text-2xl text-primary font-semibold">
            You Don't Have Access to These Pages, Please Contact Admin!
          </div>
        </div>
      </div>
    </>
  );
}

Admins.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  authloading: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  admins: PropTypes.array,
  loadAdmins: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  admins: state.admins.admins,
  loading: state.admins.loading,
  authloading: state.auth.loading,
});

export default connect(mapStateToProps, { loadAdmins })(Admins);
