const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { User } = require("../../models/User");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const { connection } = require("../../config/db");
const imageUpload = require("../../middlewares/imageUpload");
const { CoachProfile } = require("../../models/CoachProfile");
const { PlayerList } = require("../../models/CoachPlayersList");
const {
  profileValidation,
  profileUpdateValidation,
} = require("../../validators/coachProfileValidation");

const router = express.Router();

//@route        api/profiles/coaches
//@desc         get all profiles
//@access       admin
router.get("/", [auth, admin], async (req, res) => {
  try {
    const profiles = await CoachProfile.find().sort("-_id");
    res.send(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/profiles/coaches/single/:is
//@desc         get one profiles
//@access       admin
router.get("/single/:id", [auth, admin], async (req, res) => {
  try {
    const profile = await CoachProfile.findById(req.params.id);
    res.send(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/profiles/coaches/active
//@desc         get all active coach profiles
//@access       public
router.get("/active/", async (req, res) => {
  try {
    const profiles = await CoachProfile.find({ status: "ACTIVE" }).sort("-_id");
    res.send(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/profiles/coaches/self
//@desc         get self profiles
//@access       private
router.get("/self/", auth, async (req, res) => {
  try {
    const profile = await CoachProfile.findById(req.user.id);
    if (!profile) {
      return res.status(404).send("profile not found!");
    }
    res.send(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/profiles/coaches
//@desc         add a coach profile
//@access       private
router.post("/", auth, async (req, res) => {
  const session = await connection.startSession();

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

      const { error } = profileValidation(req.body);
      if (error) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send(error.details[0].message);
      }
      let profile = await CoachProfile.findById(req.user.id);
      if (profile) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send("User profile already exists!!");
      }
      const user = await User.findById(req.user.id);
      if (!user) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send("User does not exists!!");
      }
      if (user.role !== "COACH") {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send("Please use other API!!");
      }

      const {
        bio,
        dob,
        height,
        playingHand,
        country,
        city,
        experience,
        qualifications,
        awards,
        clubs,
      } = req.body;

      const _id = user._id;
      const name = user.name;
      const status = user.status;

      profile = new CoachProfile({
        _id,
        name,
        status,
        experience,
        country,
        city,
      });

      if (req.body.bio) {
        profile.bio = bio;
      }
      if (req.body.dob) {
        profile.dob = dob;
      }
      if (req.body.height) {
        profile.height = height;
      }
      if (req.body.playingHand) {
        profile.playingHand = playingHand;
      }
      if (req.body.qualifications) {
        profile.qualifications = qualifications;
      }
      if (req.body.awards) {
        profile.awards = awards;
      }
      if (req.body.clubs) {
        profile.clubs = clubs;
      }
      if (req.body.facebook) {
        profile.facebook = req.body.facebook;
      }
      profile.email = user.email;

      if (req.file) {
        let fileURL = req.file.path.replace(/\\/g, "/");
        profile.img = "./" + fileURL;
      } else {
        profile.img = "./assets/others/general.jpg";
      }

      const playerList = new PlayerList({
        coach: {
          _id: _id,
          name: name,
        },
      });

      session.startTransaction();

      await CoachProfile.create([profile], session);
      await PlayerList.create([playerList], session);

      await session.commitTransaction();
      res.send(profile);
    });
  } catch (error) {
    await session.abortTransaction();
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
  session.endSession();
});

//@route        api/profiles/coaches
//@desc         edit self profile
//@access       private
router.put("/", auth, async (req, res) => {
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

      const { error } = profileUpdateValidation(req.body);
      if (error) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send(error.details[0].message);
      }
      let profile = await CoachProfile.findById(req.user.id);
      if (!profile) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(404).send("User profile does not exists!!");
      }
      const user = await User.findById(req.user.id);
      if (!user) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send("User does not exists!!");
      }
      if (user.role !== "COACH") {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send("Please use other API!!");
      }

      if (req.body.bio) {
        profile.bio = req.body.bio;
      }
      if (req.body.age) {
        profile.age = req.body.age;
      }
      if (req.body.height) {
        profile.height = req.body.height;
      }
      if (req.body.playingHand) {
        profile.playingHand = req.body.playingHand;
      }
      if (req.body.experience) {
        profile.experience = req.body.experience;
      }
      if (req.body.facebook) {
        profile.facebook = req.body.facebook;
      }
      if (req.body.awards) {
        profile.awards = req.body.awards;
      }
      if (req.body.country) {
        profile.country = req.body.country;
      }
      if (req.body.city) {
        profile.city = req.body.city;
      }
      if (req.body.qualifications) {
        profile.qualifications = req.body.qualifications;
      }
      if (req.body.clubs) {
        profile.clubs = req.body.clubs;
      }

      if (req.file) {
        if (profile.img !== "./assets/others/general.jpg") {
          await fs.unlink(profile.img, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        let fileURL = req.file.path.replace(/\\/g, "/");
        profile.img = "./" + fileURL;
      }

      await profile.save();
      res.send(profile);
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
