import "./Dashboard.css"
import FilterPane from "../FilterPane/FilterPane";
import SwimLane from "../SwimLane/SwimLane";
import Utility from "../../Utilities/domUtility";
import Task from "../../data/Models/TaskModel";
import TaskCard from "../TaskCard/TaskCard";

export default function Dashboard(project, events) {

    const container = document.querySelector(".content");
    const taskService = project.getTaskService();
    let lanes = [];
    const dashboard = createDashboard();

    events.on("createTask", (data) => createTask(data));
    events.on("UpdateTask", (data) => updateTask(data));


    function createDashboard() {
        const dashboard = Utility.createElement("div", "dashboard");
        dashboard.appendChild(createHeader("Board"));

        const filterPane = FilterPane();
        filterPane.render(dashboard);

        const lanesContainer = document.createElement("div");
        lanesContainer.classList.add("swim-lane-list");
        dashboard.appendChild(lanesContainer)

        lanes.push(...createSwimLanes(lanesContainer));

        lanes.forEach(lane => {
            lane.render(lanesContainer)
        });

        return dashboard;
    }

    function createSwimLanes(lanesContainer) {
        const statuses = ["ready to start", "in progress", "in review", "closed"];
    
        return statuses.map(status => {
            const tasks = taskService.getTasksByStatus(status);
            const cards = tasks.map(task => new TaskCard(task, events));
            return new SwimLane(lanesContainer, cards, status);
        });
    }

    function createHeader(title) {
        const header = Utility.createElement("div", "header");
        const heading = Utility.createElement("h2", "dashboard-title", title)
        const newTaskBtn = Utility.createElement("button", "new-task", "create");
        newTaskBtn.addEventListener("click", handleNewTaskClick);
        header.appendChild(heading);
        header.appendChild(newTaskBtn);
        return header;
    }

    function addTask(task) {
        const lane = lanes.find(lane => task.getStatus() === lane.getStatus());
        lane.addTaskCard(task);
    }

    function removeTask(task) {
        const lane = lanes.find(lane => task.getStatus() === lane.getStatus());
        lane.removeTask(task);
    }

    function createTask(data) {
        const { project, summary, description, priority, date, status } = data;
        const id = `${project}-${taskService.getIndex()}`;
        const task = new Task(id, project, summary, description, priority, date, status);
        taskService.addTask(task);
        addTask(task)
    }

    function updateTask(data) {

    }

    function handleNewTaskClick() {
        if (!document.querySelector(".create-task-modal")) {
            events.emit("openNewTaskModal", {})
        }
    }

    function render() {
        container.appendChild(dashboard);
    }

    return {
        render
    }

}