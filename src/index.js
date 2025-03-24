import "./styles/reset-modern.css";
import "./styles/styles.css";
import ProjectModel from "./data/models/ProjectModel.js";
import ProjectService from "./services/ProjectService.js";
import testData from "./data/test/dummyProjects.json"
import EventBus from "./utilities/EventBus.js";
import CreateProjectModal from "./modals/CreateProjectModal/CreateProjectModal.js";
import TaskService from "./services/TaskService.js";
import LaneService from "./services/LaneService.js";
import logoIcon from "./res/images/team-icon.png";
import PageService from "./services/PageService.js";


let pageService = null;
let createProjectModal = null;

init();

function init() {
    pageService = new PageService();
    createProjectModal = new CreateProjectModal();
    setDisplayMode();
    registerEvents();
}

function setDisplayMode() {
    if (localStorage.getItem("isDarkMode") === null) {
        localStorage.setItem("isDarkMode", "false");
    } else if (localStorage.getItem("isDarkMode") === "true") {
        document.body.classList.toggle("dark-mode", "true");
    } else
        return;
}

function createProject(data) {
    ProjectService.save(new ProjectModel(data.name, data.type, logoIcon, new TaskService([], 1), new LaneService([])));

    if (ProjectService.loadFromLocalStorage().length === 1) {
        ProjectService.switchProject(data.name);
        pageService.loadPage("dashboard");
    } else {
        pageService.reloadPage();
    }

    pageService.loadNav()
}

function switchProject(projectName) {
    if (projectName !== ProjectService.CURRENT_PROJECT.getName()) {
        ProjectService.switchProject(projectName);
        pageService.reloadPage();
        pageService.loadNav();
    }
}

function deleteProject(name) {

    ProjectService.delete(name);

    if (ProjectService.loadFromLocalStorage().length === 0) {
        localStorage.clear();
        location.reload();
        return;
    }
    if (localStorage.getItem(PageService.CURR_PROJECT_NAME_KEY) === null) {
        ProjectService.CURRENT_PROJECT = ProjectService.loadFirst().getName();
        pageService.loadNav();
        pageService.reloadPage();
    }
}

function loadDemoEnv() {
    testData.forEach(project => ProjectService.save(ProjectModel.fromJSON(project)));
    ProjectService.switchProject("SAAS");
    pageService.loadPage("dashboard");
    pageService.loadNav();
}

function registerEvents() {
    EventBus.on("addProject", () => createProjectModal.open());
    EventBus.on("createProject", (data) => createProject(data));
    EventBus.on("switchProject", (projectName) => switchProject(projectName));
    EventBus.on("openProjectsPage", () => pageService.loadPage("projects"));
    EventBus.on("openTasksPage", () => pageService.loadPage("tasks"));
    EventBus.on("openSettingsPage", (name) => pageService.loadPage("settings"));
    EventBus.on("openDashboardPage", () => pageService.loadPage("dashboard"));
    EventBus.on("loadDemoEnv", () => loadDemoEnv());
    EventBus.on("deleteProject", (name) => deleteProject(name));
}


