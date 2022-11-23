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
const { Document } = require("../../models/Document");
const imageUpload = require("../../middlewares/imageUpload");
const documentUpload = require("../../middlewares/documentUpload");
const {
  documentValidation,
  documentEditValidation,
} = require("../../validators/documentValidation");

const router = express.Router();

//@route        api/documents/
//@desc         get all books and articles
//@access       admin
router.get("/", [auth, admin], async (req, res) => {
  try {
    const documents = await Document.find().sort("-_id");
    res.send(documents);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/documents/single/:id
//@desc         get one doc
//@access       admin
router.get("/single/:id", [auth, admin], async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    res.send(document);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/documents/books
//@desc         get all books
//@access       private
router.get("/books/", auth, player, async (req, res) => {
  try {
    const documents = await Document.find({ type: "BOOK" }).sort("-_id");
    res.send(documents);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/documents/articles
//@desc         get all articles
//@access       private
router.get("/articles/", auth, player, async (req, res) => {
  try {
    const documents = await Document.find({ type: "ARTICLE" }).sort("-_id");
    res.send(documents);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/documents/self/
//@desc         get all self documents
//@access       private
router.get("/self/", auth, coach, async (req, res) => {
  try {
    const documents = await Document.find({ "coach._id": req.user.id }).sort(
      "-_id"
    );
    res.send(documents);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/documents/
//@desc         add a document
//@access       coach
router.post("/", auth, coach, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).send("User does not exists!!");
    }
    if (user.status !== "ACTIVE") {
      return res.status(403).send("Action not allowed!!");
    }

    documentUpload(req, res, async function (err) {
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

      const { error } = documentValidation(req.body);
      if (error) {
        if (req.files.cover) {
          await fs.unlink(req.files.cover[0].path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        if (req.files.document) {
          await fs.unlink(req.files.document[0].path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send(error.details[0].message);
      }

      const { title, access, type } = req.body;
      const _id = user._id;
      const name = user.name;

      const document = new Document({
        title,
        access,
        type,
      });

      if (req.body.description) {
        document.description = req.body.description;
      }

      if (req.files.cover) {
        let fileURL = req.files.cover[0].path.replace(/\\/g, "/");
        document.cover = "./" + fileURL;
      } else {
        if (req.files.document) {
          await fs.unlink(req.files.document[0].path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res
          .status(400)
          .send("you need to provide a cover Image for the document");
      }
      if (req.files.document) {
        let fileURL = req.files.document[0].path.replace(/\\/g, "/");
        document.file = "./" + fileURL;
      } else {
        if (req.files.cover) {
          await fs.unlink(req.files.cover[0].path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res
          .status(400)
          .send("you need to provide a file for the document");
      }

      document.coach = {
        _id: _id,
        name: name,
      };

      await document.save();

      res.send(document);
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/documents/
//@desc         edit your document
//@access       coach
router.put("/:id", auth, coach, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).send("User does not exists!!");
    }
    if (user.status !== "ACTIVE") {
      return res.status(403).send("Action not allowed!!");
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("document not found!");
    }
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).send("document bot found!!");
    }
    if (!document.coach._id.equals(req.user.id)) {
      return res.status(403).send("Action Forbidden!!");
    }

    documentUpload(req, res, async function (err) {
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

      const { error } = documentEditValidation(req.body);
      if (error) {
        if (req.files.cover) {
          await fs.unlink(req.files.cover[0].path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        if (req.files.document) {
          await fs.unlink(req.files.document[0].path, (err) => {
            if (err) return res.status(500).send(err.message);
          });
        }
        return res.status(400).send(error.details[0].message);
      }

      if (req.body.title) {
        document.title = req.body.title;
      }
      if (req.body.description) {
        document.description = req.body.description;
      }
      if (req.body.access) {
        document.access = req.body.access;
      }
      if (req.body.type) {
        document.type = req.body.type;
      }

      if (req.files.cover) {
        await fs.unlink(document.cover, (err) => {
          if (err) return res.status(500).send(err.message);
        });
        let fileURL = req.files.cover[0].path.replace(/\\/g, "/");
        document.cover = "./" + fileURL;
      }

      if (req.files.document) {
        await fs.unlink(document.file, (err) => {
          if (err) return res.status(500).send(err.message);
        });
        let fileURL = req.files.document[0].path.replace(/\\/g, "/");
        document.file = "./" + fileURL;
      }

      await Document.updateOne({ _id: document._id }, document);

      res.send(document);
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/documents/:id
//@desc         remove a document
//@access       admin
router.delete("/:id", auth, coach, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("document not found!");
    }

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(400).send("document not found!!");
    }

    if (!document.coach._id.equals(req.user.id)) {
      return res.status(400).send("not your document to delete!!");
    }

    await Document.deleteOne({ _id: document._id });

    await fs.unlink(document.file, (err) => {
      if (err) return res.status(500).send(err.message);
    });
    await fs.unlink(document.cover, (err) => {
      if (err) return res.status(500).send(err.message);
    });

    res.send(document);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
