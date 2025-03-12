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

let createProjectModal = new CreateProjectModal();

if (ProjectService.CURRENT_PROJECT === null) {
    //testData.projects.forEach(project => ProjectService.saveProject(ProjectModel.fromJSON(project)));
    //ProjectService.setCurrentProject("SAAS");
    //CreateProjectModal().launchModal();
    openProjectsPage()
} else {
    nav = openNav()
    openDashboard();
}

function createProject(data) {

    ProjectService.saveProject(new ProjectModel(data.name, data.type, logoIcon, new TaskService([], 1), new LaneService([])));
    if (JSON.parse(localStorage.getItem("projectData")).length === 1) {
        ProjectService.setCurrentProject(data.name);
        currentPage = openDashboard();
    }
    nav.render();
}

function openNav() {
    nav = navModule();
    nav.render();
}

function openProjectsPage() {
    if (!document.querySelector(".projects-page")) {
        if (currentPage) {
            currentPage.destroy();
        }
        currentPage = ProjectsPage().open();
    }
}

function openDashboard() {
    if (!document.querySelector(".dashboard")) {
        if (currentPage) {
            console.log(currentPage)
            currentPage.destroy();
        }
        currentPage = new Dashboard();
    }
}

function switchProject(projectName) {
    if (projectName !== ProjectService.getCurrentProjectName()) {
        ProjectService.setCurrentProject(projectName);
        currentPage = openDashboard();
        nav.render();
    }
}

EventBus.on("addProject", () => createProjectModal.open());
EventBus.on("createProject", (data) => createProject(data));
EventBus.on("switchProject", (projectName) => switchProject(projectName));
EventBus.on("openProjectsPage", () => openProjectsPage());
EventBus.on("openDashboard", () => openDashboard());

