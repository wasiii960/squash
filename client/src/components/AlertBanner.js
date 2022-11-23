import PropTypes from "prop-types";
import { connect } from "react-redux";
import { GoAlert } from "react-icons/go";
import { GrStatusGood } from "react-icons/gr";
import { RiCloseFill, RiNotification3Line } from "react-icons/ri";

const AlertBanner = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div
      key={alert.id}
      className={` bg-opacity-95 ${
        alert.alertType === "danger"
          ? "bg-red-500"
          : alert.alertType === "imp"
          ? "bg-yellow-400"
          : alert.alertType === "success"
          ? "bg-green-500"
          : "bg-sky-500"
      } transition-all duration-1000 origin-top ease-linear`}
    >
      <div className="max-w-7xl mx-auto py-1 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center justify-center">
            {alert.alertType === "danger" ? (
              <RiCloseFill className="h-5 w-5 text-white" />
            ) : alert.alertType === "imp" ? (
              <GoAlert className="h-5 w-5 text-white" />
            ) : alert.alertType === "success" ? (
              <GrStatusGood className="h-5 w-5 text-white" />
            ) : (
              <RiNotification3Line className="h-5 w-5 text-white" />
            )}
            <span className="ml-3 font-medium text-white">
              {alert.msg.message ? alert.msg.message : alert.msg}
            </span>
            {/* <p className="ml-3 font-medium text-white truncate">
                  <span className="md:hidden">{alert.msg.message}</span>
                  {alert.msg.message}
                  <span className="hidden md:inline">{alert.msg.message}</span>
                </p> */}
          </div>
        </div>
      </div>
    </div>
  ));

AlertBanner.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});
export default connect(mapStateToProps)(AlertBanner);
