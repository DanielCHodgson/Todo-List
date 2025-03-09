import "./styles/reset-modern.css";
import "./styles/styles.css";
import navModule from "./components/Nav/Nav.js";
import ProjectModel from "./data/models/ProjectModel.js";
import ProjectService from "./services/ProjectService.js";
import testData from "./data/test/dummyProjects.json"
import EventBus from "./utilities/EventBus.js";
import Dashboard from "./components/Dashboard/Dashboard.js";

const navEvents = new EventBus();
const storedProjects = JSON.parse(localStorage.getItem(ProjectService.PROJECT_STORAGE_KEY));

let nav = null;
let currentDashboard = null;

if (storedProjects === null) {
    testData.projects.forEach(project => ProjectService.saveProject(ProjectModel.fromJSON(project)));
    ProjectService.setCurrentProject("SAAS");
}

//openDashboard();
//openNav()

function openNav() {
    nav = navModule(navEvents);
    nav.render();
}

function openDashboard() {
    currentDashboard = new Dashboard();
}

function switchDashboard(projectName) {

    if (projectName !== ProjectService.getCurrentProjectName()) {
        ProjectService.setCurrentProject(projectName)
        openDashboard();
        openNav();
    }
}

navEvents.on("switchDashboard", (projectName) => switchDashboard(projectName));




