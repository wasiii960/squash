const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, call) => {
    call(null, `./assets/playerStats`);
  },
  filename: (req, file, call) => {
    call(null, "document" + Date.now() + ".pdf");
  },
});

const fileFilter = (req, file, call) => {
  if (path.extname(file.originalname) === ".pdf") {
    call(null, true);
  } else {
    call(new Error("wrong document format"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
}).single("playerStats");

module.exports = upload;
