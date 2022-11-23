import React, { useEffect, useRef } from "react";
import { VscEdit } from "react-icons/vsc";
import { AiFillEye } from "react-icons/ai";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { history } from "../utils/History";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import Sidebar from "../components/Sidebar";
import { loadDocuments } from "../tasks/documentsT";
import { PaginationTable } from "../components/PaginationTable";
import { SERVER_URL } from "../utils/URLs";

const COLUMNS = [
  {
    Header: "Cover",
    accessor: "cover",
    Cell: ({ value }) => (
      <div className=" flex justify-center">
        <img width="50" src={SERVER_URL + value} alt="Display" />
      </div>
    ),
  },
  {
    Header: "Title",
    accessor: "title",
  },
  {
    Header: "Type",
    accessor: "type",
  },
  {
    Header: "Access",
    accessor: "access",
  },
  {
    Header: "Open",
    accessor: "file",
    Cell: ({ value }) => (
      <a href={SERVER_URL + value}>
        <button
          className=" bg-emerald-700 text-white font-bold cursor-pointer hover:bg-white
         hover:text-gray-800 rounded p-1 duration-500"
        >
          <AiFillEye className="w-6 h-6" />
        </button>
      </a>
    ),
  },
  {
    Header: "Edit",
    accessor: "_id",
    Cell: ({ value }) => (
      <button
        className="bg-cyan-800 text-white font-bold cursor-pointer hover:bg-white
         hover:text-gray-800 rounded p-1 duration-500"
        onClick={(event) => onEditClicked({ value }, event)}
      >
        <VscEdit className="w-6 h-6" />
      </button>
    ),
  },
];

const onEditClicked = (e, event) => {
  event.stopPropagation();
  localStorage.setItem("documentId", e.value);
  history.push("/document-single");
};

function Documents({
  isAuthenticated,
  loading,
  user,
  documents,
  loadDocuments,
}) {
  const tableInstance = useRef(null);
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleSelection = (e) => {};

  return loading ? (
    <Spinner />
  ) : (
    <>
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <Sidebar />
      <div className=" h-screen overflow-auto">
        <div className="pt-24 pl-20 flex flex-col">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl font-semibold">All Books & Articles</h1>
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
            tableData={documents}
            ref={tableInstance}
            handleSelection={handleSelection}
          />
        </div>
      </div>
    </>
  );
}

Documents.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  documents: PropTypes.array,
  loadDocuments: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  documents: state.documents.documents,
  loading: state.documents.loading,
});

export default connect(mapStateToProps, { loadDocuments })(Documents);
