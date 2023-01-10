import Login from "./views/pages/Login";
import ProjectInquiry from "./views/pages/ProjectInquiry";
import Projects from "./views/pages/Projects";
import Services from "./views/pages/Services";

const routes = [
  {
    path: "/services",
    name: "Services",
    icon: "ni ni-mobile-button text-red",
    component: Services,
    layout: "/admin",
  },
  {
    path: "/projects",
    name: "Projects",
    icon: "ni ni-badge text-blue",
    component: Projects,
    layout: "/admin",
  },
  {
    path: "/project-inquiry",
    name: "Project-Inquiry",
    icon: "ni ni-bullet-list-67",
    component: ProjectInquiry,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    miniName: "L",
    component: Login,
    layout: null,
  },
];

export default routes;
