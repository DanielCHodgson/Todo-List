import "./Dashboard.css"
import FilterPane from "../FilterPane/FilterPane";
import SwimLane from "../SwimLane/SwimLane";
import Utility from "../../Utilities/domUtility";
import Task from "../../data/Models/TaskModel";
import TaskCard from "../TaskCard/TaskCard";

export default function Dashboard(project, events) {

    const container = document.querySelector(".content");
    const taskService = project.getTaskService();
    const lanes = [];
    const dashboard = createDashboard();

    events.on("createTask", (data) => {
        const task = createTask(data);
        taskService.addTask(task);
        addTaskToSwimLane(task);
    });

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
        return ["ready to start", "in progress", "in review", "closed"].map(status => {
            return new SwimLane(
                lanesContainer,
                taskService.getTasksByStatus(status).map(task => new TaskCard(task, events)),
                status
            );
        });
    }

    function createHeader(title) {
        const header = Utility.createElement("div", "header");
        const heading = Utility.createElement("h2", "dashboard-title", title);
        const newTaskBtn = Utility.createElement("button", "new-task", "create");
        newTaskBtn.addEventListener("click", handleNewTaskClick);
        header.appendChild(heading);
        header.appendChild(newTaskBtn);
        return header;
    }

    function addTaskToSwimLane(task) {
        const lane = lanes.find(lane => task.getStatus() === lane.getStatus());
        if (lane) lane.addCard(new TaskCard(task, events));
    }

    function removeCard(task) {
        const lane = lanes.find(lane => task.getStatus() === lane.getStatus());
        if (lane) lane.removeTask(task);
    }

    function createTask(data) {
        const { project, summary, description, priority, date, status } = data;
        const id = `${project}-${taskService.getIndex()}`;
        return new Task(id, project, summary, description, priority, date, status);
    }

    function updateTask(data) {

    }

    function handleNewTaskClick() {
        if (!document.querySelector(".create-task-modal")) {
            events.emit("openNewTaskModal", {})
        }
    }

    function render() {
        container.innerHTML = "";
        container.appendChild(dashboard);
    }

    return {
        render
    }

}