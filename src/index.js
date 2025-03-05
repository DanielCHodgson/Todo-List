import "./styles/reset-modern.css";
import "./styles/styles.css";
import nav from "./components/Nav/Nav.js";
import ProjectModel from "./data/models/ProjectModel.js";
import teamIcon from './res/images/team-icon.png';
import TaskService from "./data/services/TaskService.js";
import DataUtility from "./utilities/DataUtility.js";
import Task from "./data/models/TaskModel.js";
import testData from "./data/test/dummyTests.json"


const storedProjects = JSON.parse(localStorage.getItem(DataUtility.PROJECT_STORAGE_KEY))


if (!storedProjects) {
    localStorage.setItem("currentProject", "SAAS");
    let dummyTasks = testData.tests.map(Task.fromJSON);
    DataUtility.saveProject(new ProjectModel("SAAS", "software", teamIcon, new TaskService(dummyTasks, 1)));
    DataUtility.saveProject(new ProjectModel("DOCS", "documentation", teamIcon, new TaskService([], 1)));
}


const project = DataUtility.loadProject(localStorage.getItem("currentProject"));

const navModule = nav(project);
navModule.render();

project.getDashboard().render();


