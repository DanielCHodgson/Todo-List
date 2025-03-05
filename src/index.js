import "./styles/reset-modern.css";
import "./styles/styles.css";
import nav from "./components/Nav/Nav.js";
import ProjectModel from "./data/models/ProjectModel.js";
import teamIcon from './res/images/team-icon.png';
import TaskService from "./data/services/TaskService.js";
import DataUtility from "./utilities/DataUtility.js";
import Task from "./data/models/TaskModel.js";
import testData from "./data/test/dummyTests.json"

if (DataUtility.loadProject("projectData") === null) {
    let dummyTasks = testData.tests.map(Task.fromJSON);
    DataUtility.saveProject(new ProjectModel("SAAS", "software", teamIcon, new TaskService(dummyTasks, 1)));
}

const project = DataUtility.loadProject("projectData");

const navModule = nav(project);
navModule.render();

project.getDashboard().render();


