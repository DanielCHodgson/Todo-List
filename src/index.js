import "./styles/reset-modern.css";
import "./styles/styles.css";
import nav from "./components/Nav/Nav.js";
import ProjectModel from "./data/models/ProjectModel.js";
import teamIcon from './res/images/team-icon.png';
import ProjectService from "./services/ProjectService.js";
import testData from "./data/test/dummyProjects.json"
import EventBus from "./utilities/EventBus.js";


const navEvents = new EventBus();
const storedProjects = JSON.parse(localStorage.getItem(ProjectService.PROJECT_STORAGE_KEY));

if (!storedProjects) {
    localStorage.setItem("currentProject", "SAAS");
    testData.projects.forEach(project => ProjectService.saveProject(ProjectModel.fromJSON(project)));
}


openNav(ProjectService.loadProject(localStorage.getItem("currentProject")))
openDashboard(ProjectService.loadProject(localStorage.getItem("currentProject")));

function openNav(project) {
    const navModule = nav(project, navEvents);
    navModule.render();
}


function openDashboard(project) {
    project.getDashboard().render();
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




