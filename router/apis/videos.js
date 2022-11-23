const fs = require("fs");
const path = require("path");
const multer = require("multer");
const express = require("express");
const mongoose = require("mongoose");

const auth = require("../../middlewares/auth");
const { Video } = require("../../models/Video");
const coach = require("../../middlewares/coach");
const admin = require("../../middlewares/admin");
const player = require("../../middlewares/player");
const imageUpload = require("../../middlewares/imageUpload");
const {
  videoEditValidation,
  videoValidation,
  videoStatusValidation,
} = require("../../validators/videoValidation");
const { User } = require("../../models/User");

const router = express.Router();

//@route        api/videos/
//@desc         get all videos
//@access       admin
router.get("/", [auth, admin], async (req, res) => {
  try {
    const videos = await Video.find().sort("-_id");
    res.send(videos);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/videos/:id
//@desc         get single videos
//@access       admin
router.get("/:id", [auth, admin], async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    res.send(video);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/videos/self/
//@desc         get all self videos
//@access       auth
router.get("/all/self/", auth, async (req, res) => {
  try {
    const videos = await Video.find({ "user._id": req.user.id }).sort("-_id");
    res.send(videos);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/videos/others/:id
//@desc         get videos of other coaches
//@access       player
router.get("/others/:id", auth, player, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("package not found!");
    }
    // get self player profile
    // get coach / subscription from profile
    //if paid and coach id matches params id
    // then get and return all videos
    //else return only free videos
    const videos = await Video.find({ "user._id": req.user.id }).sort("-_id");
    res.send(videos);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/videos/
//@desc         add a video
//@access       coach
router.post("/", auth, coach, async (req, res) => {
  try {
    imageUpload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log("multer error");
        console.log(err.message);
        return res.status(400).send(err.message);
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log("error" + err.message);
        return res.status(400).send(err.message);
      }

      const { error } = videoValidation(req.body);
      if (error) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send(error.details[0].message);
      }
      const coach = await User.findById(req.user.id);
      if (!coach) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send("coach not found!!");
      }
      if (coach.status !== "ACTIVE") {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(403).send("Action not allowed!!");
      }

      const user = {
        _id: coach._id,
        name: coach.name,
        role: coach.role,
      };

      const { title, description, access, link } = req.body;
      const video = new Video({
        title,
        access,
        link,
        user,
      });

      if (req.body.description) {
        video.description = req.body.description;
      }

      if (req.file) {
        let fileURL = req.file.path.replace(/\\/g, "/");
        video.thumbnail = "./" + fileURL;
      } else {
        video.thumbnail = "./assets/others/video-general.png";
      }

      await video.save();
      res.send(video);
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/videos/edit/:id
//@desc         edit video
//@access       coach
router.put("/edit/:id", auth, coach, async (req, res) => {
  try {
    imageUpload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log("multer error");
        console.log(err.message);
        return res.status(400).send(err.message);
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log("error" + err.message);
        return res.status(400).send(err.message);
      }
      const { error } = videoEditValidation(req.body);
      if (error) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send(error.details[0].message);
      }

      if (!mongoose.isValidObjectId(req.params.id)) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send("package not found!");
      }

      const video = await Video.findById(req.params.id);
      if (!video) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send("video not found!!");
      }

      if (!video.user._id.equals(req.user.id)) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(403).send("no hanky panky!");
      }

      if (req.body.title) {
        video.title = req.body.title;
      }
      if (req.body.description) {
        video.description = req.body.description;
      }
      if (req.body.access) {
        video.access = req.body.access;
      }
      if (req.body.link) {
        video.link = req.body.link;
      }

      if (req.file) {
        if (video.thumbnail !== "./assets/others/video-general.png") {
          await fs.unlink(video.thumbnail, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        let fileURL = req.file.path.replace(/\\/g, "/");
        video.thumbnail = "./" + fileURL;
      }

      await Video.updateOne({ _id: video._id }, video);
      res.send(video);
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/video/status/:id
//@desc         change video status
//@access       admin
router.put("/status/:id", auth, admin, async (req, res) => {
  try {
    const { error } = videoStatusValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("video not found!");
    }

    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(400).send("video not found!!");
    }

    video.status = req.body.status;

    await Video.updateOne({ _id: video._id }, video);
    res.send(video);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/videos/:id
//@desc         remove a video
//@access       private
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("video not found!");
    }

    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(400).send("video not found!!");
    }

    if (video.user._id.equals(req.user.id)) {
      return res.status(403).send("You are not allowed!");
    }

    await video.deleteOne({ _id: video._id });
    if (video.thumbnail !== "./assets/others/video-general.png") {
      await fs.unlink(video.thumbnail, (err) => {
        if (err) return res.status(500).send(err.message);
      });
    }

    res.send(video);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
