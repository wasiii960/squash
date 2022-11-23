import React, { useEffect, useRef } from "react";
import { VscEdit } from "react-icons/vsc";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { history } from "../utils/History";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import Sidebar from "../components/Sidebar";
import { loadPlayers } from "../tasks/playersT";
import { PaginationTable } from "../components/PaginationTable";
import { SERVER_URL } from "../utils/URLs";

const COLUMNS = [
  {
    Header: "Pic",
    accessor: "img",
    Cell: ({ value }) => (
      <div className=" flex justify-center">
        <img width="50" src={SERVER_URL + value} alt="Display" />
      </div>
    ),
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Country",
    accessor: "country",
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
  localStorage.setItem("playerId", e.value);
  history.push("/player-single");
};

function Players({ isAuthenticated, loading, user, players, loadPlayers }) {
  const tableInstance = useRef(null);
  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

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
            <h1 className="text-2xl font-semibold">All Players</h1>
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
            tableData={players}
            ref={tableInstance}
            handleSelection={handleSelection}
          />
        </div>
      </div>
    </>
  );
}

Players.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  players: PropTypes.array,
  loadPlayers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  players: state.players.players,
  loading: state.players.loading,
});

export default connect(mapStateToProps, { loadPlayers })(Players);
