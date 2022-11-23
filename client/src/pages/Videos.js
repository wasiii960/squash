import React, { useEffect, useRef } from "react";
import { VscEdit } from "react-icons/vsc";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { format } from "date-fns";

import { history } from "../utils/History";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import Sidebar from "../components/Sidebar";
import { loadVideos } from "../tasks/videosT";
import { SERVER_URL } from "../utils/URLs";
import { PaginationTable } from "../components/PaginationTable";

const COLUMNS = [
  {
    Header: "Thumbnail",
    accessor: "thumbnail",
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
    Header: "Access",
    accessor: "access",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Uploaded by",
    accessor: "user.name",
  },
  {
    Header: "uploaded At",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd/MM/yyyy");
    },
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
  localStorage.setItem("videoId", e.value);
  history.push("/videos/single");
};

function Videos({ isAuthenticated, loading, user, videos, loadVideos }) {
  const tableInstance = useRef(null);
  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

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
            <h1 className="text-2xl font-semibold">All Videos</h1>
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
            tableData={videos}
            ref={tableInstance}
            handleSelection={handleSelection}
          />
        </div>
      </div>
    </>
  );
}

Videos.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  videos: PropTypes.array,
  loadVideos: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  videos: state.videos.videos,
  loading: state.videos.loading,
});

export default connect(mapStateToProps, { loadVideos })(Videos);
