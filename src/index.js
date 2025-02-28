import "./styles/reset-modern.css";
import "./styles/styles.css";
import nav from "./components/Nav/Nav.js"
import dashboard from "./components/Dashboard/Dashboard.js";
import EventBus from "./Utilities/EventBus.js";
import NewTaskModal from "./components/modals/CreateTaskModal/CreateTaskModal.js";
import ViewTaskModal from "./components/modals/ViewTaskModal/ViewTaskModal.js";
import ProjectModel from "./data/Models/ProjectModel.js";
import teamIcon from "./res/images/team-icon.png";

const events = new EventBus();
const project = new ProjectModel("SAAS", "software", teamIcon);

const navModule = nav(project);
navModule.render();

const dashboardModule = dashboard(project, events);
dashboardModule.render();
const newTask = NewTaskModal(events);
const viewTask = ViewTaskModal(events);
