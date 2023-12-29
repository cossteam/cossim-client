import Calls from "../pages/Calls";
import Chats from "../pages/Chats";
import Settings from "../pages/Settings";
import Status from "../pages/Status";
import StatusPrivacy from "../pages/StatusPrivacy";

const routes = [
  {
    path: "/status/",
    component: Status,
  },
  {
    path: "/status-privacy/",
    component: StatusPrivacy,
  },
  {
    path: "/calls/",
    component: Calls,
  },
  {
    path: "/chats/",
    component: Chats,
  },
  {
    path: "/chats/:id/",
    asyncComponent: () => import("../pages/Messages2"),
  },
  {
    path: "/settings/",
    component: Settings,
  },
  {
    path: "/profile/:id/",
    asyncComponent: () => import("../pages/Profile"),
  },
  {
    path: "/contacts/",
    popup: {
      asyncComponent: () => import("../pages/Contacts"),
    },
  },
  {
    path: "/camera/",
    popup: {
      asyncComponent: () => import("../pages/Camera"),
    },
  },
  {
    path: "(.*)",
    asyncComponent: () => import("../pages/404"),
  },
];

export default routes;
