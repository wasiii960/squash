import PropTypes from "prop-types";
import { connect } from "react-redux";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Submit from "../components/Submit";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import Sidebar from "../components/Sidebar";
import TextArea from "../components/TextArea";
import TextInput from "../components/TextInput";
import { addNewsArticle } from "../tasks/newsT";

function NewsAddArticle({ isAuthenticated, loading, user, addNewsArticle }) {
  const [cover, setCover] = useState();
  const [data, setData] = useState({
    title: "",
    details: "",
  });

  const navigate = useNavigate();

  const { title, details } = data;

  const formData = new FormData();
  const onChange = (e) => setData({ ...data, [e.target.name]: e.target.value });
  const onChangeImg = (e) => setCover(e.target.files[0]);

  const onSubmit = (e) => {
    e.preventDefault();

    formData.append("title", title);
    formData.append("details", details);
    if (cover) {
      formData.append("img", cover);
    }
    addNewsArticle(formData, navigate);
  };
  return loading ? (
    <Spinner />
  ) : (
    <>
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <Sidebar />
      <div className=" h-screen overflow-auto  bg-zinc-50">
        <div className="flex flex-col justify-center items-center pt-20 pl-20">
          <h1 className="text-2xl font-semibold py-4">Add News Article </h1>
          <div className="w-5/12 bg-white rounded-lg p-10 my-5">
            <form onSubmit={(e) => onSubmit(e)} encType="multipart/form-data">
              <TextInput
                label="Title"
                name="title"
                placeholder="i.e. 2022 Tournament Incident"
                type="text"
                required={true}
                onChange={onChange}
                Value={title}
              />
              <TextArea
                label="Details"
                name="details"
                placeholder="A detailed description of the incident."
                required={true}
                onChange={onChange}
                Value={details}
              />
              <div className="flex w-full flex-row ">
                <input
                  className="my-4"
                  type="file"
                  name="cover"
                  accept=".jpg, .png"
                  onChange={(e) => onChangeImg(e)}
                />
              </div>
              <div className="flex flex-row space-x-4">
                <Submit />
                <Button
                  primary="red-700"
                  secondry="zinc-200"
                  onClick={(e) => navigate("/news-feed")}
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

NewsAddArticle.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  addNewsArticle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  loading: state.auth.userLoading,
});

export default connect(mapStateToProps, { addNewsArticle })(NewsAddArticle);
