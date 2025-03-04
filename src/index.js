import "./styles/reset-modern.css";
import "./styles/styles.css";
import nav from "./components/Nav/Nav.js";
import dashboard from "./components/Dashboard/Dashboard.js";
import EventBus from "./utilities/EventBus.js";
import NewTaskModal from "./components/modals/CreateTaskModal/CreateTaskModal.js";
import ViewTaskModal from "./components/modals/ViewTaskModal/ViewTaskModal.js";
import ProjectModel from "./data/Models/ProjectModel.js";
import teamIcon from './res/images/team-icon.png';
import TaskService from "./data/services/TaskService.js";
import DataUtility from "./utilities/DataUtility.js";
import Task from "./data/Models/TaskModel.js";
import testData from "./data/test/dummyTests.json"

const events = new EventBus();

let dummyTasks = testData.tests.map(Task.fromJSON);

DataUtility.saveProject(new ProjectModel("SAAS", "software", teamIcon, new TaskService(dummyTasks, 1)));

const project = DataUtility.loadProject("projectData");

console.log("project")
console.log(project)

const navModule = nav(project);
navModule.render();

const dashboardModule = dashboard(project, events);
dashboardModule.render();

const newTask = NewTaskModal(events);
const viewTask = ViewTaskModal(events);
