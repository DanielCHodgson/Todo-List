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
import ProjectsPage from "./LaunchPage/ProjectsPage.js";

let nav = null;
let currentPage = null;

if (ProjectService.CURRENT_PROJECT === null) {
    //testData.projects.forEach(project => ProjectService.saveProject(ProjectModel.fromJSON(project)));
    //ProjectService.setCurrentProject("SAAS");
    //CreateProjectModal().launchModal();
    ProjectsPage().render();
} else {
    openNav()
    openDashboard();
}

function createProject(data) {
    ProjectService.saveProject(new ProjectModel(data.name, data.type, logoIcon, new TaskService([], 1), new LaneService([])));
    if (JSON.parse(localStorage.getItem("projectData")).length === 1) {
        ProjectService.setCurrentProject(data.name);
        openDashboard();
    }
    openNav();
}

function openNav() {
    nav = navModule();
    nav.render();
}

function openDashboard() {
    currentPage = new Dashboard();
}

function switchProject(projectName) {
    if (projectName !== ProjectService.getCurrentProjectName()) {
        ProjectService.setCurrentProject(projectName);

        currentPage = new Dashboard();

        openDashboard();
        openNav();
    }
}

EventBus.on("addProject", () => CreateProjectModal().launchModal());
EventBus.on("createProject", (data) => createProject(data));
EventBus.on("switchProject", (projectName) => switchProject(projectName));

