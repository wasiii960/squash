const mongoose = require("mongoose");

const DashSchema = new mongoose.Schema({
  totalMoneyRecieved: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPackagesSold: {
    type: Number,
    required: true,
    default: 0,
  },
  currentAccount: {
    type: Number,
    required: true,
    default: 0,
  },
  myReturn: {
    type: Number,
    required: true,
    default: 0,
  },
  currentDebtToCoaches: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Dashboard = mongoose.model("Dashboard", DashSchema);

exports.Dashboard = Dashboard;
