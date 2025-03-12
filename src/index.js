import "./styles/reset-modern.css";
import "./styles/styles.css";
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
import Nav from "./components/Nav/Nav.js";

let nav = null;
let currentPage = null;

let createProjectModal = new CreateProjectModal();

if (ProjectService.CURRENT_PROJECT === null) {
    //testData.projects.forEach(project => ProjectService.saveProject(ProjectModel.fromJSON(project)));
    //ProjectService.setCurrentProject("SAAS");
    //CreateProjectModal().launchModal();
    loadProjectsPage()
} else {
    loadNav();
    loadDashboard();
}

function createProject(data) {
    ProjectService.saveProject(new ProjectModel(data.name, data.type, logoIcon, new TaskService([], 1), new LaneService([])));
    if (JSON.parse(localStorage.getItem("projectData")).length === 1) {
        ProjectService.setCurrentProject(data.name);
        currentPage = loadDashboard();
    }

    if (document.querySelector(".projects-page")) {
        loadProjectsPage();
    }

    loadNav()
}

function loadNav() {
    if (nav) nav.destroy();
    nav = new Nav();
}


function loadProjectsPage() {
    if (currentPage !== null) currentPage.destroy();
    currentPage = new ProjectsPage();
}

function loadDashboard() {
    if (currentPage !== null) currentPage.destroy();
    currentPage = new Dashboard();
}

function switchProject(projectName) {
    if (projectName !== ProjectService.getCurrentProjectName()) {
        ProjectService.setCurrentProject(projectName);

        if (document.querySelector(".dashboard")) {
            loadDashboard();
        }
        loadNav();
    }
}

EventBus.on("addProject", () => createProjectModal.open());
EventBus.on("createProject", (data) => createProject(data));
EventBus.on("switchProject", (projectName) => switchProject(projectName));
EventBus.on("openProjectsPage", () => loadProjectsPage());
EventBus.on("loadDashboard", () => loadDashboard());

