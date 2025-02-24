import "./styles/reset-modern.css";
import "./styles/styles.css";
import nav from "./components/Nav/Nav.js"
import dashboard from "./components/Dashboard/Dashboard.js";

const navModule = nav();
navModule.render();

const dashboardModule = dashboard();
dashboardModule.render();