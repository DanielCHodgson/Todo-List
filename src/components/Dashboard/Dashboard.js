import "./Dashboard.css";
import FilterPane from "../FilterPane/FilterPane";
import SwimLane from "../SwimLane/SwimLane";
import Utility from "../../utilities/DomUtility";
import Task from "../../data/models/TaskModel";
import TaskCard from "../TaskCard/TaskCard";
import EventBus from "../../utilities/EventBus";
import ProjectService from "../../services/ProjectService";
import CreateTaskModal from "../modals/CreateTaskModal/CreateTaskModal";
import ViewTaskModal from "../modals/ViewTaskModal/ViewTaskModal";
import CreateSwimLaneModal from "../modals/CreateSwimLaneModal/CreateSwimLaneModal";

export default class Dashboard {

    #project;
    #container
    #taskService
    #lanes
    #events

    constructor(project) {
        this.#project = project;
        this.#container = document.querySelector(".content");
        this.#taskService = project.getTaskService();
        this.#lanes = [];
        this.#events = new EventBus();

        this.#container.appendChild(this.createDashboard());
        this.initModals();

        this.#events.on("createTask", (data) => this.createTask(data));
        this.#events.on("updateTask", (data) => this.updateTask(data));
        this.#events.on("moveTask", ({ taskId, newStatus }) => this.moveTask(taskId, newStatus));
        this.#events.on("deleteTask", (task) => this.deleteTask(task));
    }

    initModals() {
        CreateTaskModal(this.#events);
        ViewTaskModal(this.#events);
        CreateSwimLaneModal(this.#events);
    }

    createDashboard() {
        const dashboard = Utility.createElement("div", "dashboard");
        dashboard.appendChild(this.createHeader("Board"));

        const filterPane = FilterPane(this.#events);
        filterPane.render(dashboard);

        const lanesContainer = Utility.createElement("div", "swim-lane-list");
        dashboard.appendChild(lanesContainer);

        ["ready to start", "in progress", "in review", "closed"]
            .forEach(status => this.addSwimLane(status, lanesContainer));

        return dashboard;
    }

    addSwimLane(status, lanesContainer) {
        const lane = new SwimLane(
            lanesContainer,
            this.#taskService.getTasksByStatus(status).map(task => new TaskCard(task, this.#events)),
            status,
            this.#events);
        this.#lanes.push(lane);
        lane.render(lanesContainer);
    }

    createHeader(title) {
        const header = Utility.createElement("div", "header");
        const heading = Utility.createElement("h2", "dashboard-title", title);
        const newTaskBtn = Utility.createElement("button", "new-task", "Create");
        newTaskBtn.addEventListener("click", () => this.handleNewTaskClick());
        header.appendChild(heading);
        header.appendChild(newTaskBtn);
        return header;
    }

    createTask(data) {
        const task = new Task(`${data.project}-${this.#taskService.getIndex()}`, data.project, data.summary, data.description, data.priority, data.date, data.status);
        this.#taskService.addTask(task);
        this.addTaskCard(task);
        ProjectService.saveProject(this.#project);
    }

    updateTask(data) {
        const { task: originalTask, newData } = data;
        const updatedTask = new Task(originalTask.getId(), newData.project, newData.summary, newData.description, newData.priority, newData.date, newData.status);

        this.#taskService.updateTask(updatedTask);

        if (originalTask.getProject() !== newData.project) {

            this.changeTaskProject(originalTask, newData.project);

        } else if (originalTask.getStatus() !== newData.status) {
            this.moveTaskCard(originalTask, updatedTask);
        } else {
            this.updateTaskCard(updatedTask);
        }

        ProjectService.saveProject(this.#project);
    }


    changeTaskProject(originalTask, newProjectName) {
        const currentProject = this.#project;
        const newProject = ProjectService.loadProject(newProjectName);

        if (!currentProject || !newProject) {
            console.error("One of the projects does not exist.");
            return;
        }

        this.#taskService.removeTask(originalTask.getId());
        ProjectService.saveProject(currentProject);

        const updatedTask = new Task(
            originalTask.getId(),
            newProjectName,
            originalTask.getSummary(),
            originalTask.getDescription(),
            originalTask.getPriority(),
            originalTask.getDueDate(),
            originalTask.getStatus()
        );

        newProject.getTaskService().addTask(updatedTask);
        ProjectService.saveProject(newProject);

        this.removeTaskCard(originalTask);
    }

    moveTask(taskId, newStatus) {

        const movedTask = this.#taskService.getTaskById(taskId);

        if (movedTask && movedTask.getStatus() !== newStatus) {

            const updatedTask = new Task(movedTask.getId(), movedTask.getProject(), movedTask.getSummary(), movedTask.getDescription(), movedTask.getPriority(), movedTask.getDueDate(), newStatus);
            this.#taskService.updateTask(updatedTask);
            this.moveTaskCard(movedTask, updatedTask);
            ProjectService.saveProject(this.#project);
        }
    }

    deleteTask(task) {
        this.#taskService.removeTask(task.getId());
        this.removeTaskCard(task);
        ProjectService.saveProject(this.#project);
    }

    addTaskCard(task) {
        this.#lanes.find(lane => lane.getStatus() === task.getStatus()).addCard(new TaskCard(task, this.#events));
    }

    updateTaskCard(updatedTask) {
        this.#lanes.find(lane => lane.getStatus() === updatedTask.getStatus())
            .updateCard(updatedTask.getId(), new TaskCard(updatedTask, this.#events));
    }

    moveTaskCard(originalTask, updatedTask) {
        this.removeTaskCard(originalTask);
        this.addTaskCard(updatedTask);
    }

    removeTaskCard(task) {
        this.#lanes.find(lane => lane.getStatus() === task.getStatus()).removeCard(task.getId());
    }

    handleNewTaskClick() {
        if (!document.querySelector(".create-task-modal")) {
            this.#events.emit("openNewTaskModal", {});
        }
    }

    render() {
        this.#container.innerHTML = "";
        this.#container.appendChild(this.createDashboard());
    }

    getEvents() {
        return this.#events;
    }

}
