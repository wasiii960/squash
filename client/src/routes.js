import PrivateRoutes from "./utils/PrivateRoutes";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";
import Coaches from "./pages/Coaches";
import CoachSingle from "./pages/CoachSingle";
import Documents from "./pages/Documents";
import DocumentSingle from "./pages/DocumentSingle";
import Players from "./pages/Players";
import PlayerSingle from "./pages/PlayerSingle";
import News from "./pages/News";
import NewsAddArticle from "./pages/NewsAddArticle";
import NewsSingleArticle from "./pages/NewsSingleArticle";
import Packages from "./pages/Packages";
import PackageSingle from "./pages/PackageSingle";
import Videos from "./pages/Videos";
import VideoSingle from "./pages/VideoSingle";
import Admins from "./pages/Admins";
import AdminAdd from "./pages/AdminAdd";

const routes = [
  {
    path: "/",
    component: <Login />,
    exact: true,
  },
  {
    path: "/dashboard",
    component: (
      <PrivateRoutes>
        <Dashboard />
      </PrivateRoutes>
    ),
    exact: true,
  },
  {
    path: "/changePassword",
    component: (
      <PrivateRoutes>
        <ChangePassword />
      </PrivateRoutes>
    ),
    exact: true,
  },
  {
    path: "/users/admins",
    component: (
      <PrivateRoutes>
        <Admins />
      </PrivateRoutes>
    ),
    exact: true,
  },
  {
    path: "/users/admins/add-new",
    component: (
      <PrivateRoutes>
        <AdminAdd />
      </PrivateRoutes>
    ),
    exact: true,
  },
  {
    path: "/coaches",
    component: (
      <PrivateRoutes>
        <Coaches />
      </PrivateRoutes>
    ),
    exact: true,
  },
  {
    path: "/coach-single",
    component: (
      <PrivateRoutes>
        <CoachSingle />
      </PrivateRoutes>
    ),
    exact: true,
  },
  {
    path: "/players",
    component: (
      <PrivateRoutes>
        <Players />
      </PrivateRoutes>
    ),
    exact: true,
  },
  {
    path: "/player-single",
    component: (
      <PrivateRoutes>
        <PlayerSingle />
      </PrivateRoutes>
    ),
    exact: true,
  },
  {
    path: "/packages",
    component: (
      <PrivateRoutes>
        <Packages />
      </PrivateRoutes>
    ),
    exact: true,
  },
  {
    path: "/packages/single",
    component: (
      <PrivateRoutes>
        <PackageSingle />
      </PrivateRoutes>
    ),
    exact: true,
  },
  {
    path: "/documents",
    component: (
      <PrivateRoutes>
        <Documents />
      </PrivateRoutes>
    ),
    exact: true,
  },
  {
    path: "/document-single",
    component: (
      <PrivateRoutes>
        <DocumentSingle />
      </PrivateRoutes>
    ),
    exact: true,
  },
  {
    path: "/news-feed",
    component: (
      <PrivateRoutes>
        <News />
      </PrivateRoutes>
    ),
    exact: true,
  },
  {
    path: "/news-feed/add-new",
    component: (
      <PrivateRoutes>
        <NewsAddArticle />
      </PrivateRoutes>
    ),
    exact: true,
  },
  {
    path: "/news-feed/single",
    component: (
      <PrivateRoutes>
        <NewsSingleArticle />
      </PrivateRoutes>
    ),
    exact: true,
  },
  {
    path: "/videos",
    component: (
      <PrivateRoutes>
        <Videos />
      </PrivateRoutes>
    ),
    exact: true,
  },
  {
    path: "/videos/single",
    component: (
      <PrivateRoutes>
        <VideoSingle />
      </PrivateRoutes>
    ),
    exact: true,
  },
];

export default routes;
