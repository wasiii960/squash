import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

// import store from "../store";
// import { history } from "../utils/History";
// import { CLEAR_FRANCHISE } from "../../tasks/types";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
// import Submit from "../components/Submit";
import { SERVER_URL } from "../utils/URLs";
import { loadSingleDocument } from "../tasks/documentsT";

function DocumentSingle({
  isAuthenticated,
  loading,
  user,
  document,
  loadSingleDocument,
}) {
  //   const [status, setStatus] = useState("");

  useEffect(() => {
    loadSingleDocument(localStorage.documentId);

    // if (!loading) {
    //   setStatus(document.status);
    // }

    // eslint-disable-next-line
  }, [loadSingleDocument]);

  const navigate = useNavigate();

  //   const onChange = (e) => {
  //     setStatus(e.target.value);
  //   };

  const onSubmit = (e) => {
    e.preventDefault();
    // editCoach(coach._id, status, navigate);
  };

  const onCancelClicked = (e) => {
    // store.dispatch({ type: CLEAR_Coach });
    navigate("/documents");
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
                {document.title}
              </h1>
              <img
                className="w-24 h-24 rounded-full"
                src={SERVER_URL + document.cover}
                alt="document"
              />
            </div>
            {/* <div className="flex flex-row w-1/2 justify-between text-xl font-semibold">
              <h1 className="w-1/2 text-left">Status</h1>
              <div className="w-1/2 flex justify-center">
                <select
                  onChange={(e) => onChange(e)}
                  value={status}
                  className="w-3/3 text-center px-2 py-1.5 rounded cursor-pointer duration-700 bg-zinc-200 border-2 border-zinc-200 focus:border-lime-700 focus:border-2 outline-none"
                >
                  {document.status === "UNAPPROVED" ? (
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
            </div> */}

            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Description:</h1>
              <h1 className="w-1/2 text-center font-normal">
                {document.description}
              </h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Access:</h1>
              <h1 className="w-1/2 text-center font-normal">
                {document.access}
              </h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Document Type:</h1>
              <h1 className="w-1/2 text-center font-normal">{document.type}</h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Uploaded By:</h1>
              <h1 className="w-1/2 text-center font-normal">
                {document.coach.name}
              </h1>
            </div>
            <div className="flex flex-row justify-center space-x-10 m-10 w-1/2 ">
              {/* <Submit /> */}
              <a
                href={SERVER_URL + document.file}
                className="bg-primarylit py-0.5 px-3 rounded text-white font-semibold text-xl border-2 border-primarylit hover:bg-zinc-200 hover:text-primarylit cursor-pointer duration-300"
              >
                Download
              </a>
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

DocumentSingle.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  document: PropTypes.object,
  loadSingleDocument: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  loading: state.documents.singleDocumentLoading,
  document: state.documents.singleDocument,
});

export default connect(mapStateToProps, { loadSingleDocument })(DocumentSingle);
