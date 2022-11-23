const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const auth = require("../../middlewares/auth");
const coach = require("../../middlewares/coach");
const admin = require("../../middlewares/admin");
const player = require("../../middlewares/player");
const Upload = require("../../middlewares/statsFileUpload");
const videoUpload = require("../../middlewares/videoUpload");
const { PlayerPackage } = require("../../models/PlayerPackage");
const {
  statsValidation,
  videoUploadValidation,
} = require("../../validators/playerPackagesValidation");
const { PlayerList } = require("../../models/CoachPlayersList");
const { connection } = require("../../config/db");

const router = express.Router();

//@route        api/playersPackages/
//@desc         get all profiles
//@access       admin
router.get("/", [auth, admin], async (req, res) => {
  try {
    const lists = await PlayerPackage.find().sort("-_id");
    res.send(lists);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/playersPackages/self
//@desc         get self profiles
//@access       private
router.get("/self/", auth, async (req, res) => {
  try {
    const packages = await PlayerPackage.findById(req.user.id);
    if (!packages) {
      return res.status(404).send("packages not found!");
    }
    res.send(packages);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/playersPackages/coach/self
//@desc         get player packages of single coach
//@access       private
router.get("/coach/self/:id", auth, coach, async (req, res) => {
  try {
    const obj = await PlayerPackage.findById(req.params.id);
    if (!obj) {
      return res.status(404).send("packages not found!");
    }
    let packages = [];
    for (let i = 0; i < obj.packages.length; i++) {
      if (obj.packages[i].coach._id.equals(req.user.id)) {
        packages.unshift(obj.packages[i]);
      }
    }
    res.send(packages);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// add unlink in every error return

//@route        api/playerpackages/stats/
//@desc         add player stats file
//@access       coach
router.put("/stats/", auth, coach, async (req, res) => {
  const session = await connection.startSession();
  try {
    Upload(req, res, async function (err) {
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

      const { error } = statsValidation(req.body);
      if (error) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send(error.details[0].message);
      }
      let packageList = await PlayerPackage.findById(req.body.playerId);
      if (!packageList) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send("list not found!!");
      }
      const packageIndex = packageList.packages.findIndex((package) =>
        package._id.equals(req.body.packageId)
      );

      if (!packageList.packages[packageIndex].coach._id.equals(req.user.id)) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(403).send("you are not the player's coach!!");
      }

      let playerList = await PlayerList.findOne({
        "coach._id": req.user.id,
      });
      if (!playerList) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(404).send("list not found!");
      }

      let player = {};
      let playerIndex = -1;
      for (let i = 0; i < playerList.players.length; i++) {
        if (playerList.players[i]._id.equals(req.body.playerId)) {
          player = playerList.players[i];
          playerIndex = i;
        }
      }

      if (Object.keys(player).length === 0) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(404).send("player not found!");
      }

      let fileURL = req.file.path.replace(/\\/g, "/");
      if (packageList.packages[packageIndex].playerStatsFile) {
        fs.unlink(packageList.packages[packageIndex].playerStatsFile, (err) => {
          if (err) return res.status(500).send(err.message);
        });
      }
      packageList.packages[packageIndex].playerStatsFile = "./" + fileURL;
      playerList.players[playerIndex].playerStatsFile = "./" + fileURL;

      session.startTransaction();

      await PlayerPackage.updateOne({ _id: packageList._id }, packageList);
      await PlayerList.updateOne({ _id: playerList._id }, playerList);

      await session.commitTransaction();

      res.send("file has been uploaded successfully");
    });
  } catch (error) {
    await session.abortTransaction();
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
  session.endSession();
});

//@route        api/playerpackages/video/upload
//@desc         upload video
//@access       player
router.put("/video/upload", auth, player, async (req, res) => {
  try {
    videoUpload(req, res, async function (err) {
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

      const { error } = videoUploadValidation(req.body);
      if (error) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send(error.details[0].message);
      }
      let packageList = await PlayerPackage.findById(req.body.playerId);
      if (!packageList) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send("list not found!!");
      }

      const packageIndex = packageList.packages.findIndex((package) =>
        package._id.equals(req.body.packageId)
      );

      const { title, desc } = req.body;

      const video = {
        title,
        desc,
      };

      let fileURL = req.file.path.replace(/\\/g, "/");
      video.video = "./" + fileURL;

      if (!packageList.packages[packageIndex].playerVideos) {
        packageList.packages[packageIndex].playerVideos = [video];
        console.log("created array");
      } else {
        packageList.packages[packageIndex].playerVideos.unshift(video);
      }

      await PlayerPackage.updateOne({ _id: packageList._id }, packageList);

      res.send(packageList);
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
