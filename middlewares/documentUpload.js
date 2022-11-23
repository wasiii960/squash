const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, call) => {
    if (file.fieldname === "document") {
      call(null, `./assets/documents`);
    } else {
      call(null, `./assets/images/documents`);
    }
  },
  filename: (req, file, call) => {
    if (file.fieldname === "document") {
      call(null, "document" + Date.now() + ".pdf");
    } else {
      call(null, "cover" + Date.now() + ".jpg");
    }
  },
});

const fileFilter = (req, file, call) => {
  if (file.fieldname === "document") {
    if (path.extname(file.originalname) === ".pdf") {
      call(null, true);
    } else {
      call(new Error("wrong document format"), false);
    }
  } else {
    if (file.mimetype.startsWith("image")) {
      call(null, true);
    } else {
      call(new Error("wrong image format"), false);
    }
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
  fileFilter: fileFilter,
}).fields([
  {
    name: "document",
    maxCount: 1,
  },
  {
    name: "cover",
    maxCount: 1,
  },
]);

module.exports = upload;
