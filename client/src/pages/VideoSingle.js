import { format } from "date-fns";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

// import store from "../store";
// import { history } from "../utils/History";
// import { CLEAR_FRANCHISE } from "../../tasks/types";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
import Submit from "../components/Submit";
import { SERVER_URL } from "../utils/URLs";
import { loadSingleVideo, ChangeVideo } from "../tasks/videosT";

function VideoSingle({
  isAuthenticated,
  loading,
  user,
  video,
  loadSingleVideo,
  ChangeVideo,
}) {
  const [status, setStatus] = useState("");
  const [youtubeId, setYoutubeId] = useState("");

  useEffect(() => {
    loadSingleVideo(localStorage.videoId);

    if (!loading) {
      setStatus(video.status);
      setYoutubeId(video.link.substring(video.link.indexOf("v=") + 2));
    }

    // eslint-disable-next-line
  }, [loadSingleVideo, loading]);

  const navigate = useNavigate();

  const onChangeStatus = (e) => {
    setStatus(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    ChangeVideo(video._id, status, navigate);
  };

  const onCancelClicked = (e) => {
    // store.dispatch({ type: CLEAR_Coach });
    navigate("/videos");
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
                {video.title}
              </h1>
              <img
                className="w-24 h-24 rounded-full"
                src={SERVER_URL + video.thumbnail}
                alt="thumbnail"
              />
            </div>
            <div className="flex flex-row w-1/2 justify-between text-xl font-semibold">
              <h1 className="w-1/2 text-left">Status</h1>
              <div className="w-1/2 flex justify-center">
                <select
                  onChange={(e) => onChangeStatus(e)}
                  value={status}
                  className="w-3/3 text-center px-2 py-1.5 rounded cursor-pointer duration-700 bg-zinc-200 border-2 border-zinc-200 focus:border-lime-700 focus:border-2 outline-none"
                >
                  <option value={"HIDDEN"} className="text-rose-600">
                    Hide
                  </option>
                  <option value={"LIVE"} className="text-green-600">
                    Live
                  </option>
                </select>
              </div>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Title:</h1>
              <h1 className="w-1/2 text-center font-normal">{video.title}</h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Description:</h1>
              <h1 className="w-1/2 text-center font-normal">
                {video.description}
              </h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Access:</h1>
              <h1 className="w-1/2 text-center font-normal">{video.access}</h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Uploaded By:</h1>
              <h1 className="w-1/2 text-center font-normal">
                {video.user.name}
              </h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Uploader's Role:</h1>
              <h1 className="w-1/2 text-center font-normal">
                {video.user.role}
              </h1>
            </div>
            <div className="flex flex-row mt-3 w-1/2 justify-around text-xl font-semibold">
              <h1 className="w-1/2 text-left">Uploaded At:</h1>
              <h1 className="w-1/2 text-center font-normal">
                {format(new Date(video.createdAt), "dd/MM/yyyy")}
              </h1>
            </div>
            <iframe
              width="853"
              height="480"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
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

VideoSingle.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  video: PropTypes.object,
  loadSingleVideo: PropTypes.func.isRequired,
  ChangeVideo: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  loading: state.videos.singleVideoLoading,
  video: state.videos.singleVideo,
});

export default connect(mapStateToProps, { loadSingleVideo, ChangeVideo })(
  VideoSingle
);
