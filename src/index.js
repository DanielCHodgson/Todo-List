import "./styles/reset-modern.css";
import "./styles/styles.css";
import ProjectModel from "./data/models/ProjectModel.js";
import ProjectService from "./services/ProjectService.js";
import testData from "./data/test/dummyProjects.json"
import EventBus from "./utilities/EventBus.js";
import CreateProjectModal from "./modals/CreateProjectModal/CreateProjectModal.js";
import TaskService from "./services/TaskService.js";
import LaneService from "./services/LaneService.js";
import logoIcon from "./res/images/team-icon.jpg";
import PageService from "./services/PageService.js";

let pageService = new PageService();
let createProjectModal = new CreateProjectModal();

function createProject(data) {
    ProjectService.saveProject(new ProjectModel(data.name, data.type, logoIcon, new TaskService([], 1), new LaneService([])));

    if (ProjectService.getProjects().length === 1) {
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

    const currentProjectName = ProjectService.CURRENT_PROJECT.getName();
    ProjectService.deleteProject(name);

    if (ProjectService.getProjects().length === 0) {
        localStorage.clear();
        location.reload();
        return;
    }
    else if (currentProjectName === name) {
        ProjectService.CURRENT_PROJECT = ProjectService.loadFirstProject();
        pageService.loadNav();
    }

    pageService.reloadPage();
}

function loadDemoEnv() {
    testData.forEach(project => ProjectService.saveProject(ProjectModel.fromJSON(project)));
    ProjectService.switchProject("SAAS");
    pageService.loadPage("dashboard");
    pageService.loadNav();
}

EventBus.on("addProject", () => createProjectModal.open());
EventBus.on("createProject", (data) => createProject(data));
EventBus.on("switchProject", (projectName) => switchProject(projectName));
EventBus.on("openProjectsPage", () => pageService.loadPage("projects"));
EventBus.on("openTasksPage", () => pageService.loadPage("tasks"));
EventBus.on("loadDashboard", () => pageService.loadPage("dashboard"));
EventBus.on("loadDemoEnv", () => loadDemoEnv());
EventBus.on("deleteProject", (name) => deleteProject(name));

