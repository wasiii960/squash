const fs = require("fs");
const path = require("path");
const multer = require("multer");
const express = require("express");
const mongoose = require("mongoose");

const { User } = require("../../models/User");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const coach = require("../../middlewares/coach");
const player = require("../../middlewares/player");
const { Package } = require("../../models/Package");
const imageUpload = require("../../middlewares/imageUpload");
const {
  packageValidation,
  editPackageValidation,
  editPackageStatusValidation,
  packageCommentValidation,
  packageRatingValidation,
} = require("../../validators/packagesValidation");
const { PlayerPackage } = require("../../models/PlayerPackage");
const { connection } = require("../../config/db");

const router = express.Router();

//@route        api/subPackages/
//@desc         get all subscription Packages
//@access       admin
router.get("/", [auth, admin], async (req, res) => {
  try {
    const packages = await Package.find().sort("-_id");
    res.send(packages);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/subPackages/:id
//@desc         get one subscription Package
//@access       admin
router.get("/single/:id", [auth, admin], async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("package not found!");
    }
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).send("package not found!");
    }
    res.send(package);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/subPackages/self/
//@desc         get all self subscription Packages
//@access       coach
router.get("/self/", auth, coach, async (req, res) => {
  try {
    const packages = await Package.find({ "coach._id": req.user.id });
    res.send(packages);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/subPackages/:id
//@desc         get all subscription Packages of a coach
//@access      player
router.get("/coach/:id", auth, player, async (req, res) => {
  try {
    const packages = await Package.find({
      $and: [{ "coach._id": req.params.id }, { status: "APPROVED" }],
    });
    res.send(packages);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/subPackages/
//@desc         add a subscription package
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

      const { error } = packageValidation(req.body);
      if (error) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send(error.details[0].message);
      }
      const user = await User.findById(req.user.id);
      if (!user) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send("User not found!!");
      }

      const coach = {
        _id: user._id,
        name: user.name,
      };

      const { name, description, timePeriod, totalFee, videos } = req.body;
      const package = new Package({
        name,
        description,
        timePeriod,
        totalFee,
        coach,
        videos,
      });

      if (req.file) {
        let fileURL = req.file.path.replace(/\\/g, "/");
        package.cover = "./" + fileURL;
      } else {
        package.cover = "./assets/others/squash-cover.png";
      }

      await package.save();
      res.send(package);
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/subPackages/edit/:id
//@desc         edit subscription package
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
      const { error } = editPackageValidation(req.body);
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

      const package = await Package.findById(req.params.id);
      if (!package) {
        if (req.file) {
          await fs.unlink(req.file.path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send("Package not found!!");
      }

      if (req.body.name) {
        package.name = req.body.name;
      }
      if (req.body.description) {
        package.description = req.body.description;
      }
      if (req.body.timePeriod) {
        package.timePeriod = req.body.timePeriod;
      }
      if (req.body.totalFee) {
        package.totalFee = req.body.totalFee;
      }
      if (req.body.videos) {
        package.videos = req.body.videos;
      }

      if (req.file) {
        if (package.cover !== "./assets/others/squash-cover.png") {
          await fs.unlink(package.cover, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        let fileURL = req.file.path.replace(/\\/g, "/");
        package.cover = "./" + fileURL;
      }

      package.status = "UNAPPROVED";

      await Package.updateOne({ _id: package._id }, package);
      res.send(package);
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/subPackages/status/:id
//@desc         change status and edit subscription package
//@access       admin
router.put("/status/:id", auth, admin, async (req, res) => {
  try {
    const { error } = editPackageStatusValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("package not found!");
    }

    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(400).send("Package not found!!");
    }

    const { status, coachShare } = req.body;
    package.status = status;
    package.coachShare = coachShare;

    if (req.body.comment) {
      const newComment = {
        text: req.body.comment,
        commentor: "Admin",
        time: new Date(),
      };
      package.comments.push(newComment);
    }

    await Package.updateOne({ _id: package._id }, package);
    res.send(package);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/subPackages/clearComments/:id
//@desc         remove all comments
//@access       admin
router.put("/clearComments/:id", auth, admin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("package not found!");
    }

    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(400).send("Package not found!!");
    }

    package.comments = [];

    await Package.updateOne({ _id: package._id }, package);
    res.send(package);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/subPackages/comments/:id
//@desc         add a comment
//@access       coach
router.put("/comments/:id", auth, coach, async (req, res) => {
  try {
    const { error } = packageCommentValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("package not found!");
    }

    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(400).send("Package not found!!");
    }
    if (!package.coach._id.equals(req.user.id)) {
      return res.status(400).send(" not your package!!");
    }

    const newComment = {
      text: req.body.comment,
      commentor: "Coach",
      time: new Date(),
    };
    package.comments.push(newComment);

    await Package.updateOne({ _id: package._id }, package);
    res.send(package);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/subPackages/ratePackage/:id
//@desc         add a rating
//@access       player
router.put("/ratePackage/:id", auth, player, async (req, res) => {
  const session = await connection.startSession();
  try {
    const { error } = packageRatingValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("package not found!");
    }

    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(400).send("Package not found!!");
    }
    const list = await PlayerPackage.findById(req.user.id);

    const packageIndex = list.packages.findIndex((x) =>
      x._id.equals(package._id)
    );

    if (packageIndex < 0) {
      return res
        .status(400)
        .send("you can not rate a package you have not bought!");
    }

    if (list.packages[packageIndex].rated) {
      return res.status(400).send("you can not rate a package twice!");
    }

    package.currentRating =
      (package.currentRating * package.noOfRatings + req.body.rating) /
      (package.noOfRatings + 1);
    package.noOfRatings += 1;

    list.packages[packageIndex].rated = true;
    session.startTransaction();

    await Package.updateOne({ _id: package._id }, package);
    await PlayerPackage.updateOne({ _id: list._id }, list);

    await session.commitTransaction();
    res.send(package);
  } catch (error) {
    await session.abortTransaction();
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
  session.endSession();
});

//@route        api/subPackages/:id
//@desc         remove subscription package
//@access       coach
router.delete("/:id", auth, coach, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("package not found!");
    }

    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(400).send("Package not found!!");
    }

    if (!package.coach._id.equals(req.user.id)) {
      return res.status(403).send("You are not allowed!");
    }

    await Package.deleteOne({ _id: package._id });

    if (package.cover !== "./assets/others/squash-cover.png") {
      await fs.unlink(package.cover, (err) => {
        if (err) return res.status(500).send(err.message);
      });
    }

    res.send(package);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
