import "./styles/reset-modern.css";
import "./styles/styles.css";
import navModule from "./components/Nav/Nav.js";
import ProjectModel from "./data/models/ProjectModel.js";
import ProjectService from "./services/ProjectService.js";
import testData from "./data/test/dummyProjects.json"
import EventBus from "./utilities/EventBus.js";
import Dashboard from "./components/Dashboard/Dashboard.js";
import CreateProjectModal from "./components/modals/CreateProjectModal/CreateProjectModal.js";
import TaskService from "./services/TaskService.js";
import LaneService from "./services/LaneService.js";
import logoIcon from "./res/images/team-icon.jpg";

const navEvents = new EventBus();
const storedProjects = JSON.parse(localStorage.getItem(ProjectService.PROJECT_STORAGE_KEY));

let nav = null;
let currentDashboard = null;

if (storedProjects === null) {
    //testData.projects.forEach(project => ProjectService.saveProject(ProjectModel.fromJSON(project)));
    //ProjectService.setCurrentProject("SAAS");
    CreateProjectModal(navEvents).launchModal();
} else {
    openNav()
    openDashboard();
}


function createProject(data) {
    ProjectService.saveProject(new ProjectModel(data.name, data.type, logoIcon, new TaskService([]), new LaneService([])));
    if (JSON.parse(localStorage.getItem("projectData")).length === 1) {
        localStorage.setItem("currentProject", data.name);
        openDashboard();
        openNav();
    }
}

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

navEvents.on("createProject", (data) => createProject(data));
navEvents.on("switchDashboard", (projectName) => switchDashboard(projectName));




