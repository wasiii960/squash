import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";

// import store from "../store";
// import { history } from "../utils/History";
// import { CLEAR_FRANCHISE } from "../../tasks/types";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
import { loadSinglePlayer, editPlayer } from "../tasks/playersT";
import Submit from "../components/Submit";
import { SERVER_URL } from "../utils/URLs";

function PlayerSingle({
  isAuthenticated,
  loading,
  user,
  player,
  loadSinglePlayer,
  editPlayer,
}) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadSinglePlayer(localStorage.playerId);

    if (!loading) {
      setStatus(player.status);
    }

    // eslint-disable-next-line
  }, [loadSinglePlayer, loading]);

  const navigate = useNavigate();

  const onChange = (e) => {
    setStatus(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    editPlayer(player._id, status, navigate);
  };

  const onCancelClicked = (e) => {
    // store.dispatch({ type: CLEAR_Coach });
    navigate("/players");
  };

  return loading ? (
    <Spinner />
  ) : (
    <>
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <Sidebar />
      <div className="h-screen overflow-auto">
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="flex flex-col justify-center items-center pt-20 pl-20">
            <div className="flex flex-row space-x-10 m-10">
              <h1 className="text-2xl items-center font-bold py-4">
                {player.name}
              </h1>
              <img
                className="w-24 h-24 rounded-full"
                src={SERVER_URL + player.img}
                alt="player"
              />
            </div>
            <div className="flex flex-row w-1/2 justify-between text-xl font-semibold">
              <h1 className="w-1/2 text-left">Status</h1>
              <div className="w-1/2 flex justify-center">
                <select
                  onChange={(e) => onChange(e)}
                  value={status}
                  className="w-3/3 text-center px-2 py-1.5 rounded cursor-pointer duration-700 bg-zinc-200 border-2 border-zinc-200 focus:border-lime-700 focus:border-2 outline-none"
                >
                  {player.status === "UNAPPROVED" ? (
                    <option
                      value={"UNAPPROVED"}
                      className="text-zinc-400"
                      disabled
                    >
                      Un-Approved
                    </option>
                  ) : (
                    <></>
                  )}
                  <option value={"BANNED"} className="text-red-600">
                    Banned
                  </option>
                  <option value={"ACTIVE"} className="text-green-600">
                    Active
                  </option>
                </select>
              </div>
            </div>

            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Name:</h1>
              <h1 className="w-1/2 text-center font-normal">{player.name}</h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Bio:</h1>
              <h1 className="w-1/2 text-center font-normal">{player.bio}</h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Date of Birth:</h1>
              <h1 className="w-1/2 text-center font-normal">
                {format(new Date(player.dob), "dd/MM/yyyy")}
              </h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Country:</h1>
              <h1 className="w-1/2 text-center font-normal">
                {player.country}
              </h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">City:</h1>
              <h1 className="w-1/2 text-center font-normal">{player.city}</h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Height:</h1>
              <h1 className="w-1/2 text-center font-normal">{player.height}</h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">PlayingHand:</h1>
              <h1 className="w-1/2 text-center font-normal">
                {player.playingHand}
              </h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Experience:</h1>
              <h1 className="w-1/2 text-center font-normal">
                {player.experience} Years
              </h1>
            </div>
            <div className="flex flex-row justify-center space-x-10 m-10 w-1/2 ">
              <Submit />
              <Button
                label={"Cancel"}
                primary="red-700"
                secondry="zinc-900"
                onClick={(e) => onCancelClicked(e)}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

PlayerSingle.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  player: PropTypes.object,
  loadSinglePlayer: PropTypes.func.isRequired,
  editPlayer: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  loading: state.players.singlePlayerLoading,
  player: state.players.singlePlayer,
});

export default connect(mapStateToProps, { loadSinglePlayer, editPlayer })(
  PlayerSingle
);
