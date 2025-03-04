import "./Dashboard.css";
import FilterPane from "../FilterPane/FilterPane";
import SwimLane from "../SwimLane/SwimLane";
import Utility from "../../utilities/DomUtility";
import Task from "../../data/Models/TaskModel";
import TaskCard from "../TaskCard/TaskCard";
import DataUtility from "../../utilities/DataUtility";

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

    function createTask(data) {
        const task = new Task(taskService.getIndex(), data.project, data.summary, data.description, data.priority, data.date, data.status);
    
        taskService.addTask(task);

        addTaskCard(task);
        DataUtility.saveProject(project);
    }

    function updateTask(data) {
        const { task: originalTask, newData } = data;
        const updatedTask = new Task(originalTask.getId(), newData.project, newData.summary, newData.description, newData.priority, newData.date, newData.status);

        taskService.updateTask(updatedTask);

        if (originalTask.getStatus() !== newData.status) {
            moveTaskCard(originalTask, updatedTask);
        } else {
            updateTaskCard(updatedTask);
        }

        DataUtility.saveProject(project);
    }

    function moveTask(taskId, newStatus) {
        
        const movedTask = taskService.getTaskById(Number(taskId));

        if (movedTask && movedTask.getStatus() !== newStatus) {
          
            const updatedTask = new Task(movedTask.getId(), movedTask.getProject(), movedTask.getSummary(), movedTask.getDescription(), movedTask.getPriority(), movedTask.getDueDate(), newStatus);
            taskService.updateTask(updatedTask);
            moveTaskCard(movedTask, updatedTask);
            DataUtility.saveProject(project);
        }
    }

    function deleteTask(task) {
        taskService.removeTask(task.getId());
        console.log(taskService.getTasks());
        removeTaskCard(task);
        DataUtility.saveProject(project);
    }

    function addTaskCard(task) {
        lanes.find(lane => lane.getStatus() === task.getStatus()).addCard(new TaskCard(task, events));
    }

    function updateTaskCard(updatedTask) {
        lanes.find(lane => lane.getStatus() === updatedTask.getStatus())
            .updateCard(updatedTask.getId(), new TaskCard(updatedTask, events));
    }

    function moveTaskCard(originalTask, updatedTask) {
        removeTaskCard(originalTask);
        addTaskCard(updatedTask);
    }

    function removeTaskCard(task) {
        lanes.find(lane => lane.getStatus() === task.getStatus()).removeCard(task.getId());
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

    events.on("createTask", (data) => createTask(data));
    events.on("updateTask", (data) => updateTask(data));
    events.on("moveTask", ({ taskId, newStatus }) => moveTask(taskId, newStatus));
    events.on("deleteTask", (task) => deleteTask(task));

    return {
        render
    };
}
