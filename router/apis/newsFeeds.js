const fs = require("fs");
const path = require("path");
const multer = require("multer");
const express = require("express");
const mongoose = require("mongoose");

const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const imageUpload = require("../../middlewares/imageUpload");
const { NewsFeed } = require("../../models/NewsFeed");
const {
  newsValidation,
  newsEditValidation,
} = require("../../validators/newsFeedValidation");

const router = express.Router();

//@route        api/newsfeed/
//@desc         get all news
//@access       private
router.get("/", auth, async (req, res) => {
  try {
    const news = await NewsFeed.find().sort("-_id");
    res.send(news);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/newsfeed/:id
//@desc         get single news
//@access       private
router.get("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("news not found not found!");
    }
    const news = await NewsFeed.findById(req.params.id);
    if (!news) {
      return res.status(404).send("news not found not found!");
    }
    res.send(news);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/newsfeed/
//@desc         add a news
//@access       admin
router.post("/", auth, admin, async (req, res) => {
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

      const { error } = newsValidation(req.body);
      if (error) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send(error.details[0].message);
      }

      const { title, details } = req.body;

      const news = new NewsFeed({
        title,
        details,
      });

      if (req.file) {
        let fileURL = req.file.path.replace(/\\/g, "/");
        news.cover = "./" + fileURL;
      } else {
        news.cover = "./assets/others/news.jpg";
      }

      await news.save();

      res.send(news);
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/newsfeed/:id
//@desc         edit a news
//@access       admin
router.put("/:id", auth, admin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("news not found!");
    }
    const news = await NewsFeed.findById(req.params.id);
    if (!news) {
      return res.status(404).send("news not found!!");
    }

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

      const { error } = newsEditValidation(req.body);
      if (error) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send(error.details[0].message);
      }

      if (req.body.title) {
        news.title = req.body.title;
      }
      if (req.body.details) {
        news.details = req.body.details;
      }

      if (req.file) {
        if (news.cover !== "./assets/others/news.jpg") {
          await fs.unlink(news.cover, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        let fileURL = req.file.path.replace(/\\/g, "/");
        news.cover = "./" + fileURL;
      }

      await NewsFeed.updateOne({ _id: news._id }, news);

      res.send(news);
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/newsfeed/:id
//@desc         remove a news story
//@access       admin
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("news not found!");
    }

    const news = await NewsFeed.findById(req.params.id);
    if (!news) {
      return res.status(400).send("news not found!!");
    }

    await NewsFeed.deleteOne({ _id: news._id });

    if (news.cover !== "./assets/others/news.jpg") {
      await fs.unlink(news.cover, (err) => {
        if (err) return res.status(500).send(err.message);
      });
    }

    res.send(news);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
