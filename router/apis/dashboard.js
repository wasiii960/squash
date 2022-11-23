const express = require("express");

const { Dashboard } = require("../../models/Dashboard");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const { PlayerProfile } = require("../../models/PlayerProfile");
const { CoachProfile } = require("../../models/CoachProfile");
const { Video } = require("../../models/Video");

const router = express.Router();

//@route        api/dash/
//@desc         add dashboard
//@access       admin
router.post("/", auth, admin, async (req, res) => {
  try {
    let dash = await Dashboard.findOne();
    if (dash) {
      return res.status(404).send("dashboard already exists!!");
    }

    dash = new Dashboard({});

    dash.save();

    res.json(dash);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/dash/
//@desc         get dashboard data
//@access       admin
router.get("/", auth, admin, async (req, res) => {
  try {
    let dash = await Dashboard.findOne();
    if (!dash) {
      return res.status(404).send("dashboard does not exists!!");
    }

    const totalPlayers = await PlayerProfile.countDocuments();

    const totalCoaches = await CoachProfile.countDocuments();

    const activeCoaches = await CoachProfile.countDocuments({
      status: "ACTIVE",
    });
    const unactiveCoaches = await CoachProfile.countDocuments({
      status: "UNAPPROVED",
    });
    const bannedCoaches = await CoachProfile.countDocuments({
      status: "BANNED",
    });
    const activePlayers = await PlayerProfile.countDocuments({
      status: "ACTIVE",
    });
    const bannedPlayers = await PlayerProfile.countDocuments({
      status: "BANNED",
    });
    const totalVideos = await Video.countDocuments();

    // const recentVideos = await Video.find().sort("-id").limit("5");

    const data = {
      totalMoneyRecieved: dash.totalMoneyRecieved,
      totalPackagesSold: dash.totalPackagesSold,
      currentAccount: dash.currentAccount,
      myReturn: dash.myReturn,
      currentDebtToCoaches: dash.currentDebtToCoaches,
      totalPlayers,
      totalCoaches,
      activeCoaches,
      unactiveCoaches,
      bannedCoaches,
      activePlayers,
      bannedPlayers,
      totalVideos,
      // recentVideos,
    };

    res.send(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/dash/
//@desc         clear dashboard data
//@access       admin
router.put("/", auth, admin, async (req, res) => {
  try {
    let dash = await Dashboard.findOne();
    if (!dash) {
      return res.status(404).send("dashboard not found exists!!");
    }

    dash.currentAccount = 0;
    dash.myReturn = 0;
    dash.currentDebtToCoaches = 0;

    await Dashboard.updateOne({ _id: dash._id }, dash);

    res.json(dash);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
