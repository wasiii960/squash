import { GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import { FaDollarSign, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { Table } from "../components/Table";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
import DashboardCard from "../components/DashboardCard";
import { loadDashData, clearAccount } from "../tasks/dashboasrdT";

const COLUMNS = [
  {
    Header: "Packages Sold",
    accessor: "totalPackagesSold",
  },
  {
    Header: "Total Player",
    accessor: "totalPlayers",
  },
  {
    Header: "Total Coaches",
    accessor: "totalCoaches",
  },
  {
    Header: "Total Videos",
    accessor: "totalVideos",
  },
];

const COLUMNS2 = [
  {
    Header: "Active PLayers",
    accessor: "activePlayers",
  },
  {
    Header: "Banned Players",
    accessor: "bannedPlayers",
  },
  {
    Header: "Active Coaches",
    accessor: "activeCoaches",
  },
  {
    Header: "Un-Approved Coaches",
    accessor: "unactiveCoaches",
  },
  {
    Header: "Banned Coaches",
    accessor: "bannedCoaches",
  },
];

function Dashboard({
  isAuthenticated,
  loading,
  user,
  dashboard,
  loadDashData,
  clearAccount,
}) {
  useEffect(() => {
    loadDashData();
  }, [loadDashData]);

  const navigate = useNavigate();

  const onClearClicked = (e) => {
    e.preventDefault();
    clearAccount(navigate);
  };

  return loading ? (
    <Spinner />
  ) : (
    <>
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <Sidebar />
      <div className="h-screen overflow-auto bg-gray-300">
        <div className="pt-24 pl-20 flex flex-col">
          <div className=" flex flex-col justify-center items-center">
            <h1 className="text-4xl font-semibold mb-7">Dashboard</h1>
            <DashboardCard
              head="Total Amount"
              desc="Total amount recieved while using this system"
              val={"$ " + dashboard.totalMoneyRecieved}
            >
              <GiReceiveMoney className="mr-4 text-3xl" />
            </DashboardCard>
            <DashboardCard
              head="Current Account"
              desc="Total amount in system since you last cleared it"
              val={"$ " + dashboard.currentAccount}
            >
              <GiTakeMyMoney className="mr-4 text-3xl" />
            </DashboardCard>
            <DashboardCard
              head="Coaches Money"
              desc="Amount in current account that belongs to coaches"
              val={"$ " + dashboard.currentDebtToCoaches}
            >
              <FaUsers className="mr-4 text-3xl" />
            </DashboardCard>
            <DashboardCard
              head="My Return"
              desc="Your return in current Account"
              val={"$ " + dashboard.myReturn}
            >
              <FaDollarSign className="mr-4 text-3xl" />
            </DashboardCard>

            <div className="mt-8">
              <Button
                label="Clear Current Accounts"
                onClick={(e) => onClearClicked(e)}
              />
            </div>
            <div className="mt-5">
              <Table dashData={[dashboard]} COLUMNS={COLUMNS} bodyBg="#ddd" />
            </div>
            <div className="mb-5">
              <Table dashData={[dashboard]} COLUMNS={COLUMNS2} bodyBg="#ddd" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.propTypes = {
  loading: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object,
  dashboard: PropTypes.object,
  loadDashData: PropTypes.func.isRequired,
  clearAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.dashboard.loading,
  user: state.auth.user,
  dashboard: state.dashboard.dashboard,
});

export default connect(mapStateToProps, { loadDashData, clearAccount })(
  Dashboard
);
