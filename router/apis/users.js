const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const { User } = require("../../models/User");
const {
  validateUser,
  passwordChangeValidation,
  statusValidation,
} = require("../../validators/userValidation");
const { CoachProfile } = require("../../models/CoachProfile");
const { PlayerProfile } = require("../../models/PlayerProfile");
const { connection } = require("../../config/db");

const router = express.Router();

//@route        api/users/
//@desc         get all users
//@access       admin
router.get("/", [auth, admin], async (req, res) => {
  try {
    const users = await User.find().select("-password").sort("-_id");
    res.send(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/users/admins
//@desc         get all admins
//@access       admin
router.get("/admins/", [auth, admin], async (req, res) => {
  try {
    if (req.user.id !== "634e5483a0cf5bb246d0f351") {
      return res.status(403).send("request forbiddden");
    }
    const users = await User.find({ role: "ADMIN" })
      .select("-password")
      .sort("-_id");
    res.send(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/users/
//@desc         add a player/ player signup
//@access       public
router.post("/player/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("User already exists!!");
    }

    const { name, email, password } = req.body;
    user = new User({ name, email });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    const token = user.generateAuthToken();

    user.password = undefined;
    res.send({ user, token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/users/
//@desc         add a coach/ coach signup
//@access       public
router.post("/coach/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("User already exists!!");
    }

    const { name, email, password } = req.body;
    user = new User({ name, email });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.role = "COACH";
    user.status = "ACTIVE";

    await user.save();
    const token = user.generateAuthToken();

    user.password = undefined;
    res.send({ token, user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/users/
//@desc         add an admin
//@access       admin
router.post("/admin/", auth, admin, async (req, res) => {
  try {
    if (req.user.id !== "634e5483a0cf5bb246d0f351") {
      return res.status(403).send("request forbidden");
    }
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("User already exists!!");
    }

    const { name, email, password } = req.body;
    user = new User({ name, email });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.role = "ADMIN";
    user.status = "ACTIVE";

    await user.save();
    const token = user.generateAuthToken();

    user.password = undefined;
    res.send({ token, user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/users/changePassword
//@desc         change password
//@access       auth
router.put("/changePassword/", auth, async (req, res) => {
  try {
    const { error } = passwordChangeValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send("User not found!");
    }

    const { password, passwordNew } = req.body;
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(403).send("invalid credentials");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(passwordNew, salt);

    await User.updateOne({ _id: user._id }, user);
    user.password = undefined;
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/users/status/:id
//@desc         change user status
//@access       admin
router.put("/status/:id", [auth, admin], async (req, res) => {
  const session = await connection.startSession();
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("User not found!");
    }
    const { error } = statusValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found!");
    }
    let profile = {};
    if (user.role === "COACH") {
      profile = await CoachProfile.findById(req.params.id);
    } else {
      profile = await PlayerProfile.findById(req.params.id);
    }
    if (Object.keys(profile).length === 0) {
      return res.status(404).send("User profile not found!");
    }

    const status = req.body.status.toUpperCase();
    user.status = status;
    profile.status = status;

    session.startTransaction();

    await User.updateOne({ _id: user._id }, user, session);
    if (user.role === "COACH") {
      await CoachProfile.updateOne({ _id: profile._id }, profile, session);
    } else {
      await PlayerProfile.updateOne({ _id: profile._id }, profile, session);
    }

    await session.commitTransaction();

    user.password = undefined;
    res.send(user);
  } catch (error) {
    await session.abortTransaction();
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
  session.endSession();
});

//@route        api/users/deleteAccount
//@desc         forward account for deletion
//@access       auth
router.put("/deleteAccount/", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send("User not found!");
    }

    user.status = "DELETED";

    await User.updateOne({ _id: user._id }, user);
    user.password = undefined;
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/users/
//@desc         delete user
//@access       admin
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("User not found!");
    }
    if (req.params.id === "62a879d429104d571a0c984a") {
      return res.status(403).send("request forbidden");
    }
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found!");
    }

    await User.deleteOne({ _id: user._id });
    res.send("user deleted!");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
