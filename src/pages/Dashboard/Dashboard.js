import "./Dashboard.css";
import FilterPane from "../../components/FilterPane/FilterPane";
import SwimLane from "../../components/SwimLane/SwimLane";
import Utility from "../../utilities/DomUtility";
import Task from "../../data/models/TaskModel";
import TaskCard from "../../components/TaskCard/TaskCard";
import EventBus from "../../utilities/EventBus";
import ProjectService from "../../services/ProjectService";
import CreateTaskModal from "../../modals/CreateTaskModal/CreateTaskModal";
import ViewTaskModal from "../../modals/ViewTaskModal/ViewTaskModal";
import CreateSwimLaneModal from "../../modals/CreateSwimLaneModal/CreateSwimLaneModal";

export default class Dashboard {
    #project;
    #container;
    #element;
    #lanesContainer;
    #taskService;
    #laneService;
    #modals = [];
    #eventListeners = {};

    constructor() {
        this.#project = ProjectService.CURRENT_PROJECT;
        this.#container = document.querySelector(".content");
        this.#element = this.#createElement();
        this.#lanesContainer = this.#element.querySelector(".swim-lane-list");
        this.#taskService = this.#project.getTaskService();
        this.#laneService = this.#project.getLaneService();

        this.#initModals();
        this.#bindEvents();
        this.#renderSwimLanes();
        this.render();
    }

    #initModals() {
        this.#modals = [
            new CreateTaskModal(),
            new ViewTaskModal(),
            new CreateSwimLaneModal(),
        ];
    }

    #bindEvents() {
        const events = [
            { event: "openNewTaskModal", handler: () => this.#modals[0].open(this.#laneService) },
            { event: "openCreateSwimlaneModal", handler: () => this.#modals[2].open() },
            { event: "createTask", handler: (data) => this.#createTask(data) },
            { event: "updateTask", handler: (data) => this.#updateTask(data) },
            { event: "deleteTask", handler: (task) => this.#deleteTask(task) },
            { event: "moveTask", handler: ({ taskId, newStatus }) => this.#moveTask(taskId, newStatus) },
            { event: "viewTask", handler: (task) => this.#modals[1].open(task) },
            { event: "createSwimLane", handler: (status) => this.#addSwimLane(status) },
            { event: "deleteSwimLane", handler: (status) => this.#deleteSwimLane(status) },
        ];

        events.forEach(({ event, handler }) => {
            this.#eventListeners[event] = handler;
            EventBus.on(event, handler);
        });
    }

    #createElement() {
        const dashboard = Utility.createElement("div", "dashboard");
        dashboard.appendChild(this.#createHeader("Board"));
        new FilterPane().render(dashboard);
        dashboard.appendChild(Utility.createElement("div", "swim-lane-list"));
        return dashboard;
    }

    #createHeader(title) {
        const header = Utility.createElement("div", "header");
        const heading = Utility.createElement("h2", "dashboard-title", title);
        const newTaskBtn = Utility.createElement("button", "new-task", "Create");
        newTaskBtn.addEventListener("click", () => this.#handleNewTaskClick());
        header.append(heading, newTaskBtn);
        return header;
    }

    #createTask(data) {
        const task = new Task(
            `${data.project}-${this.#taskService.getIndex()}`,
            data.project,
            data.summary,
            data.description,
            data.priority,
            data.date,
            data.status
        );

        this.#project.getTaskService().addTask(task);
        ProjectService.save(this.#project);
        this.#renderLane(task.getStatus());
    }

    #updateTask(data) {

        const updatedTask = new Task(
            data.task.getId(),
            data.newData.project,
            data.newData.summary,
            data.newData.description,
            data.newData.priority,
            data.newData.date,
            data.newData.status
        );

        this.#taskService.updateTask(updatedTask);
        ProjectService.save(this.#project);
        this.#renderUpdatedSwimLanes(updatedTask, data.task);
    }

    #moveTask(taskId, newStatus) {

        const movedTask = this.#taskService.getTaskById(taskId);
        if (!movedTask || movedTask.getStatus() === newStatus) return;


        const updatedTask = new Task(
            movedTask.getId(),
            movedTask.getProject(),
            movedTask.getSummary(),
            movedTask.getDescription(),
            movedTask.getPriority(),
            movedTask.getDate(),
            newStatus
        );

        this.#taskService.updateTask(updatedTask);
        ProjectService.save(this.#project);
        this.#renderUpdatedSwimLanes(movedTask, updatedTask);
    }

    #deleteTask(task) {
        this.#taskService.removeTask(task.getId());
        ProjectService.save(this.#project);
        this.#laneService.getLaneByStatus(task.getStatus()).renderCards();
    }

    #handleNewTaskClick() {
        if (!document.querySelector(".create-task-modal")) {
            EventBus.emit("openNewTaskModal", this.#laneService);
        }
    }

    #addSwimLane(status) {
        if (this.#laneService.getLanes().some((lane) => lane.getStatus() === status)) {
            alert("Lane already exists");
            return;
        }

        const lane = new SwimLane(status);
        this.#laneService.addLane(lane);
        ProjectService.save(this.#project);
        lane.render(this.#lanesContainer);
    }

    #deleteSwimLane(status) {
        this.#laneService.removeLane(status);
        ProjectService.save(this.#project);
    }

    #renderSwimLanes() {
        this.#laneService.getLanes().forEach((lane) => lane.render(this.#lanesContainer));
    }

    #renderLane(status) {
        console.log(status)
        console.log(this.#laneService.getLaneByStatus(status))
        const lane = this.#laneService.getLaneByStatus(status);
        if (lane !== null)
            lane.renderCards();
    }

    #renderUpdatedSwimLanes(movedTask, updatedTask) {
        const oldLane = this.#laneService.getLaneByStatus(movedTask.getStatus());
        const newLane = this.#laneService.getLaneByStatus(updatedTask.getStatus());
        oldLane.renderCards();
        newLane.renderCards();
    }

    destroy() {
        this.#cleanUp();
        if (this.#element) {
            this.#element.remove();
        }
    }

    #unbindEvents() {
        Object.entries(this.#eventListeners).forEach(([event, handler]) => {
            EventBus.off(event, handler);
        });
        this.#eventListeners = {};
    }

    #cleanUp() {
        this.#unbindEvents();
        this.#modals.forEach((modal) => modal.destroy());
        this.#modals = [];
    }

    render() {
        if (this.#element) {
            this.#container.appendChild(this.#element);
        }
    }
}
