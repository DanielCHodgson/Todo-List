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

const storedProjects = JSON.parse(localStorage.getItem(ProjectService.PROJECT_STORAGE_KEY));

let nav = null;
let currentDashboard = null;


console.log(ProjectService.CURRENT_PROJECT)

if (ProjectService.CURRENT_PROJECT === null) {
    //testData.projects.forEach(project => ProjectService.saveProject(ProjectModel.fromJSON(project)));
    //ProjectService.setCurrentProject("SAAS");
    CreateProjectModal().launchModal();
} else {
    openNav()
    openDashboard();
}

function createProject(data) {
    ProjectService.saveProject(new ProjectModel(data.name, data.type, logoIcon, new TaskService([], 1), new LaneService([])));
    if (JSON.parse(localStorage.getItem("projectData")).length === 1) {
        ProjectService.setCurrentProject(data.name);
        openDashboard();
        openNav();
    }
}

function openNav() {
    nav = navModule();
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

EventBus.on("createProject", (data) => createProject(data));
EventBus.on("switchDashboard", (projectName) => switchDashboard(projectName));
