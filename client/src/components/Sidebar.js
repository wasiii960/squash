import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { ImUser, ImNewspaper } from "react-icons/im";
import { MdLibraryBooks, MdOndemandVideo } from "react-icons/md";
import { BsChevronDown } from "react-icons/bs";

const Sidebar = () => {
  let navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className={`z-1 fixed left-0 text-3xl pt-20 w-20 h-screen flex flex-col bg-zinc-800 text-white shadow-2xl overflow-y-auto`}
      >
        <SideBarIcon
          open={open}
          onClick={(e) => navigate("/dashboard")}
          icon={<FaChartLine size="33" />}
          text={"Dashboard"}
        />
        <SideBarIcon
          open={open}
          onClick={(e) =>
            open === "users" ? setOpen(false) : setOpen("users")
          }
          icon={<ImUser size="33" />}
          text="Users"
        />
        <SideBarIcon
          open={open}
          onClick={(e) => navigate("/packages")}
          icon={<GiMoneyStack size="35" />}
          text="Packages"
        />
        <SideBarIcon
          open={open}
          onClick={(e) => navigate("/documents")}
          icon={<MdLibraryBooks size="33" />}
          text="Books & Articles"
        />
        {/* <SideBarIcon
          open={open}
          onClick={(e) => navigate("/customers")}
          icon={<FaUserTag size="30" />}
          text="Customers"
        /> */}
        <SideBarIcon
          open={open}
          onClick={(e) => (open === "news" ? setOpen(false) : setOpen("news"))}
          icon={<ImNewspaper size="33" />}
          text="News Feed"
        />
        <SideBarIcon
          open={open}
          onClick={(e) => navigate("/videos")}
          icon={<MdOndemandVideo size="33" />}
          text="Videos"
        />
      </div>
      <>
        {open === "news" ? (
          <OpenBar open={open} head="News Feed">
            <OpenBarTab onClick={(e) => navigate("/news-feed")}>
              All News Articles
            </OpenBarTab>
            <OpenBarTab onClick={(e) => navigate("/news-feed/add-new")}>
              Add News Article
            </OpenBarTab>
          </OpenBar>
        ) : open === "users" ? (
          <OpenBar open={open} head="Users">
            <OpenBarTab onClick={(e) => navigate("/users/admins")}>
              Admins
            </OpenBarTab>
            <OpenBarTab onClick={(e) => navigate("/coaches")}>
              Coaches
            </OpenBarTab>
            <OpenBarTab onClick={(e) => navigate("/players")}>
              Players
            </OpenBarTab>
          </OpenBar>
        ) : (
          <OpenBar open={open} head="Micellinious">
            <OpenBarTab> Do this </OpenBarTab>
            <OpenBarTab> Do That </OpenBarTab>
          </OpenBar>
        )}
      </>
    </>
  );
};

export default Sidebar;

function SideBarIcon({ open, icon, onClick, text = "tooltip" }) {
  return (
    <div className="group cursor-pointer" onClick={(e) => onClick(e)}>
      <div className="sidebar-icon">
        {icon}
        {/* <span
          className={`sidebar-tooltip ${open ? "" : "group-hover:scale-100"}`}
        >
          {text}
        </span> */}
      </div>
      <span
        className={`flex justify-center md:mx-1 group-hover:text-primarylit group-hover:font-semibold text-xs text-center font-thin "
        `}
      >
        {text}
      </span>
    </div>
  );
}

function OpenBar({ open, children, head }) {
  return (
    <div
      className={`fixed left-0 text-xl mt-20 w-40 h-screen flex flex-col z-20
     bg-zinc-700 text-gray-300 ml-20 shadow-2xl items-center ease-linear
     duration-75 origin-top-left scale-0 ${open ? "scale-100" : "scale-0"}`}
    >
      <div className="p-2 flex flex-row text-center justify-center items-center gap-x-2 text-primarylit bg-zinc-800 w-full">
        {head} <BsChevronDown className="h-4 w-4 mt-1" />
      </div>
      {children}
    </div>
  );
}

function OpenBarTab({ children, onClick }) {
  return (
    <div
      onClick={(e) => onClick(e)}
      className="flex justify-center  py-2 w-full cursor-pointer text-sm transition-all duration-500
     hover:text-primary hover:bg-zinc-600"
    >
      {children}
    </div>
  );
}
