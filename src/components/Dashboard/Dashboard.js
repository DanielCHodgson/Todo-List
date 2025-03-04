import "./Dashboard.css";
import FilterPane from "../FilterPane/FilterPane";
import SwimLane from "../SwimLane/SwimLane";
import Utility from "../../utilities/DomUtility";
import Task from "../../data/Models/TaskModel";
import TaskCard from "../TaskCard/TaskCard";

export default function Dashboard(project, events) {
    const container = document.querySelector(".content");
    const taskService = project.getTaskService();
    const lanes = [];

    function createDashboard() {
        const dashboard = Utility.createElement("div", "dashboard");
        dashboard.appendChild(createHeader("Board"));

        const filterPane = FilterPane();
        filterPane.render(dashboard);

        const lanesContainer = Utility.createElement("div", "swim-lane-list");
        dashboard.appendChild(lanesContainer);

        createSwimLanes(lanesContainer);

        return dashboard;
    }

    function createSwimLanes(lanesContainer) {
        ["ready to start", "in progress", "in review", "closed"].forEach(status => {

            console.log(taskService)

            const lane = new SwimLane(
                lanesContainer,
                taskService.getTasksByStatus(status).map(task => new TaskCard(task, events)),
                status,
                events);

            lanes.push(lane);
            lane.render(lanesContainer);
        });
    }

    function createHeader(title) {
        const header = Utility.createElement("div", "header");
        const heading = Utility.createElement("h2", "dashboard-title", title);
        const newTaskBtn = Utility.createElement("button", "new-task", "Create");
        newTaskBtn.addEventListener("click", handleNewTaskClick);
        header.appendChild(heading);
        header.appendChild(newTaskBtn);
        return header;
    }

    function addTaskCard(task) {

        lanes.find(lane => lane.getStatus() === task.getStatus()).addCard(new TaskCard(task, events));
    }

    function removeTaskCard(task) {
        lanes.find(lane => lane.getStatus() === task.getStatus()).removeCard(task.getId());
    }

    function updateTaskCard(updatedTask) {
        taskService.updateTask(updatedTask);

        lanes.find(lane => lane.getStatus() === updatedTask.getStatus())
            .updateCard(updatedTask.getId(), new TaskCard(updatedTask, events));
    }

    function createTask(data) {
        const id = `${data.project}-${taskService.getIndex()}`;
        return new Task(id, data.project, data.summary, data.description, data.priority, data.date, data.status);
    }

    function updateTask(data) {
        const { task: originalTask, newData } = data;
        const updatedTask = new Task(originalTask.getId(), newData.project, newData.summary, newData.description, newData.priority, newData.date, newData.status);

        if (originalTask.getStatus() !== newData.status) {
            moveTaskCard(originalTask, updatedTask)
        } else {
            updateTaskCard(updatedTask);
        }
    }

    function moveTaskCard(originalTask, updatedTask) {
        taskService.updateTask(updatedTask);
        removeTaskCard(originalTask);
        addTaskCard(updatedTask);
    }

    function handleNewTaskClick() {
        if (!document.querySelector(".create-task-modal")) {
            events.emit("openNewTaskModal", {});
        }
    }

    function render() {
        container.innerHTML = "";
        container.appendChild(createDashboard());
    }

    events.on("createTask", (data) => {
        const task = createTask(data);
        taskService.addTask(task);
        addTaskCard(task);
    });

    events.on("updateTask", (data) => {
        updateTask(data);
    });

    events.on("moveTask", ({ taskId, newStatus }) => {
        const task = taskService.getTaskById(taskId);
        if (task && task.getStatus() !== newStatus) {
            const updatedTask = new Task(task.getId(), task.getProject(), task.getSummary(), task.getDescription(), task.getPriority(), task.getDueDate(), newStatus);
            moveTaskCard(task, updatedTask);
        }
    });

    return {
        render
    };
}
