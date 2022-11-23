const express = require("express");
const config = require("config");
const cors = require("cors");

const { connect } = require("./config/db");
const auth = require("./router/apis/auth");
const users = require("./router/apis/users");
const videos = require("./router/apis/videos");
const packages = require("./router/apis/packages");
const newsfeed = require("./router/apis/newsFeeds");
const dashboard = require("./router/apis/dashboard");
const documents = require("./router/apis/documents");
const coachProfiles = require("./router/apis/coachProfiles");
const playerList = require("./router/apis/coachPlayerLists");
const playerPackages = require("./router/apis/playerPackages");
const playerProfiles = require("./router/apis/playerProfiles");

const app = express();
connect();

if (!config.get("jwtPrivateKey")) {
  console.log(config.get("jwtPrivateKey"));
  console.error(
    "Fatal Error: Encryption key for the authentication token is not defined"
  );
  process.exit(1);
}

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use("/assets", express.static("assets"));

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/videos", videos);
app.use("/api/dash", dashboard);
app.use("/api/newsfeed", newsfeed);
app.use("/api/documents", documents);
app.use("/api/subPackages", packages);
app.use("/api/playerlist", playerList);
app.use("/api/playerPackages", playerPackages);
app.use("/api/profiles/coaches", coachProfiles);
app.use("/api/profiles/players", playerProfiles);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
