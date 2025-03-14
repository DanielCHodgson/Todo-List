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
import ProjectsPage from "./pages/ProjectsPage/ProjectsPage.js";
import TasksPage from "./pages/TasksPage/TasksPage.js";
import Nav from "./components/Nav/Nav.js";

let nav = null;
let currentPage = null;

let createProjectModal = new CreateProjectModal();

if (ProjectService.CURRENT_PROJECT === null) {
    loadPage("projects")
} else {
    loadNav();
    loadPage("dashboard");
}

function createProject(data) {
    ProjectService.saveProject(new ProjectModel(data.name, data.type, logoIcon, new TaskService([], 1), new LaneService([])));
    if (JSON.parse(localStorage.getItem("projectData")).length === 1) {
        ProjectService.setCurrentProject(data.name);
        loadPage("dashboard");
    }

    if (document.querySelector(".projects-page")) {
        loadPage("projects");
    }

    loadNav()
}

function loadNav() {
    if (nav) nav.destroy();
    nav = new Nav();
}

function loadPage(page) {

    if (currentPage && currentPage.object) {
        currentPage.object.destroy();
    }

    switch (page) {
        case "projects":
            currentPage = {
                "name": page,
                "object": new ProjectsPage(),
            };
            break;
        case "dashboard":
            currentPage = {
                "name": page,
                "object": new Dashboard(),
            };
            break;
        case "tasks":
            currentPage = {
                "name": page,
                "object": new TasksPage(),
            };
            break;
        default:
            console.error("Unknown page: " + page);
            currentPage = {
                "name": "home",
                "object": new ProjectsPage(),
            };
            break;
    }
}



function switchProject(projectName) {
    if (projectName !== ProjectService.getCurrentProjectName()) {
        ProjectService.setCurrentProject(projectName);

        if (document.querySelector(".dashboard")) {
            loadPage("dashboard");
        }
        loadNav();
    }
}


function loadDemoEnv() {
    testData.forEach(project => ProjectService.saveProject(ProjectModel.fromJSON(project)));
    ProjectService.setCurrentProject("SAAS");
    loadPage("dashboard");
    loadNav();
}

EventBus.on("addProject", () => createProjectModal.open());
EventBus.on("createProject", (data) => createProject(data));
EventBus.on("switchProject", (projectName) => switchProject(projectName));
EventBus.on("openProjectsPage", () => loadPage("projects"));
EventBus.on("openTasksPage", () => loadPage("tasks"));
EventBus.on("loadDashboard", () => loadPage("dashboard"));
EventBus.on("loadDemoEnv", () => loadDemoEnv());

