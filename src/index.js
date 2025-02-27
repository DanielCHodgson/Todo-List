import "./styles/reset-modern.css";
import "./styles/styles.css";
import nav from "./components/modules/Nav/Nav.js"
import dashboard from "./components/modules/Dashboard/Dashboard.js";
import EventBus from "./Utilities/EventBus.js";
import NewTaskModal from "./components/modules/NewTaskModal/NewTaskModal.js";

const events = new EventBus();

const navModule = nav();
navModule.render();

const dashboardModule = dashboard(events);
dashboardModule.render();
const modal = NewTaskModal(events);
