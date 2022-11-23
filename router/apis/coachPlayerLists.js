const express = require("express");
const mongoose = require("mongoose");

const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const coach = require("../../middlewares/coach");
const { connection } = require("../../config/db");
const player = require("../../middlewares/player");
const { Package } = require("../../models/Package");
const { CoachProfile } = require("../../models/CoachProfile");
const { PlayerProfile } = require("../../models/PlayerProfile");
const { PlayerList } = require("../../models/CoachPlayersList");
const { PlayerPackage } = require("../../models/PlayerPackage");
const {
  requestValidation,
  paymentValidation,
  responseValidation,
} = require("../../validators/playerListsValidation");
const { Dashboard } = require("../../models/Dashboard");

const router = express.Router();

//@route        api/playerlist/
//@desc         get all playerlist
//@access       admin
router.get("/", auth, admin, async (req, res) => {
  try {
    const lists = await PlayerList.find().sort("-id");
    res.send(lists);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/playerlist/self
//@desc         get self playerlist
//@access       coach
router.get("/self/", auth, coach, async (req, res) => {
  try {
    const lists = await PlayerList.findOne({ "coach._id": req.user.id });
    res.send(lists);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/playerlist/player/requests
//@desc         get all requests of a player
//@access       player
router.get("/player/requests/", auth, player, async (req, res) => {
  try {
    const completeList = await PlayerList.find();
    if (!completeList) {
      return res.status(404).send("packages not found!");
    }
    let list = [];
    let requests = [];
    let obj = {};
    for (let i = 0; i < completeList.length; i++) {
      for (let j = 0; j < completeList[i].requests.length; j++) {
        if (completeList[i].requests[j]._id.equals(req.user.id)) {
          requests.unshift(completeList[i].requests[j]);
        }
      }
      if (requests.length > 0) {
        obj.coach = completeList[i].coach;
        obj.requests = requests;
        list.unshift(obj);
      }
      requests = [];
      obj = {};
    }
    res.send(list);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/playerlist/request/:id
//@desc         add request
//@access       player
router.post("/request/", auth, player, async (req, res) => {
  try {
    const { error } = requestValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    if (!mongoose.isValidObjectId(req.body.coachId)) {
      return res.status(400).send("list not found!");
    }
    if (!mongoose.isValidObjectId(req.body.packageId)) {
      return res.status(400).send("list not found!");
    }

    const player = await PlayerProfile.findById(req.user.id);
    if (!player) {
      return res.status(404).send("player not found!");
    }

    const lists = await PlayerList.findOne({
      "coach._id": req.body.coachId,
    });
    if (!lists) {
      return res.status(404).send("list not found!");
    }

    const package = await Package.findById(req.body.packageId);
    if (!package) {
      return res.status(404).send("package not found!");
    }
    if (!package.coach._id.equals(req.body.coachId)) {
      return res
        .status(400)
        .send(
          "Please provide a subscription package that belongs to the coach you are requesting!"
        );
    }
    if (package.status !== "APPROVED") {
      return res.status(400).send("Subscription package not approved!!");
    }

    const request = {
      _id: player._id,
      img: player.img,
      name: player.name,
      packageId: package._id,
      packageName: package.name,
      packageCost: package.totalFee,
      totalTimePeriod: package.timePeriod,
      PackageStartDate: req.body.startDate,
    };

    lists.requests.push(request);

    await PlayerList.updateOne({ _id: lists._id }, lists);

    res.send("request added!");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/playerlist/request-response/:id
//@desc         response to a request
//@access       coach
router.put("/request-response/:id", auth, coach, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("request not found!");
    }

    const { error } = responseValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const list = await PlayerList.findOne({
      "coach._id": req.user.id,
    });
    if (!list) {
      return res.status(404).send("list not found!");
    }

    let request = {};
    let requestIndex = -1;
    for (let i = 0; i < list.requests.length; i++) {
      if (list.requests[i]._id.equals(req.params.id)) {
        request = list.requests[i];
        requestIndex = i;
      }
    }

    if (Object.keys(request).length === 0) {
      return res.status(404).send("request not found!");
    }

    if (!req.body.responseToRequest) {
      list.requests.splice(requestIndex, 1);
      await PlayerList.updateOne({ _id: list._id }, list);
      return res.send("request removed!");
    } else {
      list.requests[requestIndex].status = "ACCEPTED";

      await PlayerList.updateOne({ _id: list._id }, list);

      res.send(
        "request accepted and player will be added to your list after his payment clears!"
      );
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/playerlist/payment-cleared/:id
//@desc         add player after payment is cleared
//@access       player
router.put("/payment-cleared/:id", auth, player, async (req, res) => {
  const session = await connection.startSession();
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("request not found!");
    }

    const { error } = paymentValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const list = await PlayerList.findOne({
      "coach._id": req.params.id,
    });
    if (!list) {
      return res.status(404).send("list not found!");
    }

    let request = {};
    let requestIndex = -1;
    for (let i = 0; i < list.requests.length; i++) {
      if (list.requests[i]._id.equals(req.user.id)) {
        request = list.requests[i];
        requestIndex = i;
      }
    }

    if (Object.keys(request).length === 0) {
      return res.status(404).send("request not found!");
    }

    if (!req.body.moneyRecieved) {
      list.requests.splice(requestIndex, 1);
      await PlayerList.updateOne({ _id: list._id }, list);
      return res.send("request removed!");
    } else {
      const coach = await CoachProfile.findById(req.params.id);
      const profile = await PlayerProfile.findById(req.user.id);
      const package = await Package.findById(request.packageId);
      const playerPackage = await PlayerPackage.findById(req.user.id);
      let dashboard = await Dashboard.findById("63116409d1c7d445c25d2207");

      let player = {};
      //compare dates
      let date = true;
      if (request.PackageStartDate < Date.now()) {
        date = false;
      }

      session.startTransaction();

      if (date) {
        player = {
          _id: profile._id,
          img: profile.img,
          name: profile.name,
          bio: profile.bio,
          packageName: package.name,
          packageCost: package.totalFee,
          totalTimePeriod: package.timePeriod,
          PackageStartDate: request.PackageStartDate,
        };

        PackageToAdd = {
          _id: package._id,
          img: package.img,
          name: package.name,
          cost: package.totalFee,
          timePeriod: package.timePeriod,
          trialDays: package.trialDays,
          startDate: request.PackageStartDate,
          coach: {
            _id: coach._id,
            name: coach.name,
          },
        };
      } else {
        player = {
          _id: profile._id,
          img: profile.img,
          name: profile.name,
          bio: profile.bio,
          packageName: package.name,
          packageCost: package.totalFee,
          totalTimePeriod: package.timePeriod,
          PackageStartDate: Date.now(),
        };

        PackageToAdd = {
          _id: package._id,
          img: package.img,
          name: package.name,
          cost: package.totalFee,
          timePeriod: package.timePeriod,
          trialDays: package.trialDays,
          startDate: Date.now(),
          coach: {
            _id: coach._id,
            name: coach.name,
          },
        };
      }

      package.numberSold += 1;
      coach.creadit += package.coachShare;

      list.requests.splice(requestIndex, 1);
      list.players.unshift(player);

      playerPackage.packages.unshift(PackageToAdd);

      dashboard.totalMoneyRecieved += package.totalFee;
      dashboard.totalPackagesSold += 1;
      dashboard.currentAccount += package.totalFee;
      dashboard.myReturn += package.totalFee - package.coachShare;
      dashboard.currentDebtToCoaches += package.coachShare;

      await PlayerList.updateOne({ _id: list._id }, list, session);
      await Package.updateOne({ _id: package._id }, package, session);
      await CoachProfile.updateOne({ _id: coach._id }, coach, session);
      await Dashboard.updateOne({ _id: dashboard._id }, dashboard, session);
      await PlayerPackage.updateOne(
        { _id: playerPackage._id },
        playerPackage,
        session
      );

      await session.commitTransaction();

      // remember to switch the respose

      // res.send("Payment recieved and package added to your list!");
      res.send({ list, package, coach, dashboard, playerPackage });
    }
  } catch (error) {
    await session.abortTransaction();
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
  session.endSession();
});

module.exports = router;
