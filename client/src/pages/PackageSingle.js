import { format } from "date-fns";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { VscEdit } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

// import store from "../store";
import { history } from "../utils/History";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
import Submit from "../components/Submit";
import { SERVER_URL } from "../utils/URLs";
import TextInput from "../components/TextInput";
import TextArea from "../components/TextArea";
import { PaginationTable } from "../components/PaginationTable";
import {
  loadSinglePackage,
  ChangePackage,
  removeComments,
} from "../tasks/packagesT";

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
    Header: "Description",
    accessor: "description",
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

function PackageSingle({
  isAuthenticated,
  loading,
  user,
  subPackage,
  loadSinglePackage,
  ChangePackage,
  removeComments,
}) {
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [coachShare, setCoachShare] = useState();

  const tableInstance = useRef(null);

  useEffect(() => {
    loadSinglePackage(localStorage.packageId);

    if (!loading) {
      setStatus(subPackage.status);
      setCoachShare(subPackage.coachShare);
    }

    // eslint-disable-next-line
  }, [loadSinglePackage, loading]);

  const navigate = useNavigate();

  const onChangeStatus = (e) => {
    setStatus(e.target.value);
  };

  const onChangeShare = (e) => {
    setCoachShare(e.target.value);
  };

  const onComment = (e) => {
    setComment(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    ChangePackage(subPackage._id, status, coachShare, comment, navigate);
    setComment("");
  };

  const onCancelClicked = (e) => {
    e.preventDefault();
    navigate("/packages");
  };

  const onRemoveComments = (e) => {
    e.preventDefault();
    removeComments(subPackage._id, navigate);
  };

  const handleSelection = (e) => {};

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
                {subPackage.name}
              </h1>
              <img
                className="w-24 h-24 rounded-full"
                src={SERVER_URL + subPackage.cover}
                alt="player"
              />
            </div>
            <div className="flex flex-row w-1/2 justify-between items-center text-xl font-semibold">
              <h1 className="w-1/2 text-left">Status:</h1>
              <div className="w-1/2 flex justify-center">
                <select
                  onChange={(e) => onChangeStatus(e)}
                  value={status}
                  className="w-3/3 text-center px-2 py-1.5 rounded cursor-pointer duration-700 bg-zinc-200 border-2 border-zinc-200 focus:border-lime-700 focus:border-2 outline-none"
                >
                  <option value={"UNAPPROVED"} className="text-rose-600">
                    Un-Approved
                  </option>
                  <option value={"REQUESTCHANGES"} className="text-cyan-600">
                    Request Changes
                  </option>

                  <option value={"APPROVED"} className="text-green-600">
                    Approved
                  </option>
                </select>
              </div>
            </div>
            <div className="flex flex-row w-1/2 justify-between items-center text-xl font-semibold">
              <h1 className="w-1/2 text-left">Coach's Share:</h1>
              <div className="w-1/2 flex justify-center">
                <TextInput
                  className="w-2/3 text-center px-2 py-1.5 rounded cursor-pointer duration-700 bg-zinc-200 border-2 border-zinc-200 focus:border-lime-700 focus:border-2 outline-none"
                  name="coachShare"
                  placeholder="i.e. 20"
                  required={true}
                  type="number"
                  Value={coachShare}
                  onChange={(e) => onChangeShare(e)}
                />
              </div>
            </div>

            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Name:</h1>
              <h1 className="w-1/2 text-center font-normal">
                {subPackage.name}
              </h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Description:</h1>
              <h1 className="w-1/2 text-center font-normal">
                {subPackage.description}
              </h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Time Period:</h1>
              <h1 className="w-1/2 text-center font-normal">
                {subPackage.timePeriod} days
              </h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Cost:</h1>
              <h1 className="w-1/2 text-center font-normal">
                {subPackage.totalFee}
              </h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Coach:</h1>
              <h1 className="w-1/2 text-center font-normal">
                {subPackage.coach.name}
              </h1>
            </div>
            <div className="flex flex-col w-full mt-3 items-center text-xl font-semibold gap-y-5">
              <h1 className="w-1/2 text-left">Comments</h1>
              {subPackage.comments.length > 0 ? (
                <>
                  <div className="flex flex-col gap-y-2 mt-3 w-1/2 bg-gray-300 p-5 rounded-md">
                    {subPackage.comments.map((x) => (
                      <div
                        key={x.time}
                        className="bg-white w-fit p-2 px-4 rounded-lg"
                      >
                        <h1 className="text-base font-semibold">
                          {x.commentor}
                        </h1>
                        <h3 className="text-base font-normal">{x.text}</h3>
                        <h5 className="text-xs font-light">
                          {format(new Date(x.time), "dd/MM/yyyy HH:mm")}
                        </h5>
                      </div>
                    ))}
                  </div>
                  <Button
                    label={"Remove Comments"}
                    primary="red-700"
                    secondry="zinc-900"
                    onClick={(e) => onRemoveComments(e)}
                  />
                </>
              ) : (
                <></>
              )}
              <div className="flex flex-col w-1/2">
                <TextArea
                  label="Add Comment"
                  Value={comment}
                  name="comment"
                  required={false}
                  onChange={(e) => onComment(e)}
                />
              </div>
            </div>
            <PaginationTable
              COLUMNS={COLUMNS}
              tableData={subPackage.videos}
              ref={tableInstance}
              handleSelection={handleSelection}
            />
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

PackageSingle.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  subPackage: PropTypes.object,
  loadSinglePackage: PropTypes.func.isRequired,
  ChangePackage: PropTypes.func.isRequired,
  removeComments: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  loading: state.packages.singlePackageLoading,
  subPackage: state.packages.singlePackage,
});

export default connect(mapStateToProps, {
  loadSinglePackage,
  ChangePackage,
  removeComments,
})(PackageSingle);
