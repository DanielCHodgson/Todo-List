import "./styles/reset-modern.css";
import "./styles/styles.css";
import nav from "./components/Nav/Nav.js";
import ProjectModel from "./data/models/ProjectModel.js";
import ProjectService from "./services/ProjectService.js";
import testData from "./data/test/dummyProjects.json"
import EventBus from "./utilities/EventBus.js";


const navEvents = new EventBus();
const storedProjects = JSON.parse(localStorage.getItem(ProjectService.PROJECT_STORAGE_KEY));

if (storedProjects === null) {
    localStorage.setItem("currentProject", "SAAS");
    testData.projects.forEach(project => ProjectService.saveProject(ProjectModel.fromJSON(project)));
}

const project = ProjectService.loadProject(localStorage.getItem("currentProject"));

openDashboard(project);
openNav(project)


function openNav(project) {
    const navModule = nav(project, navEvents);
    navModule.render();
}

function openDashboard(project) {
    project.getDashboard();
}

function switchDashboard(projectName) {
   
    const currentProjectName = localStorage.getItem("currentProject");

    if (projectName !== currentProjectName) {
        localStorage.setItem("currentProject", projectName);
        const project = ProjectService.loadProject(localStorage.getItem("currentProject"));
        openDashboard(project);
        openNav(project);
    }
}

navEvents.on("switchDashboard", (projectName) => switchDashboard(projectName));




