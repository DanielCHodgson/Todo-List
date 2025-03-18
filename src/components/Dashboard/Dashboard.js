import "./Dashboard.css";
import FilterPane from "../FilterPane/FilterPane";
import SwimLane from "../SwimLane/SwimLane";
import Utility from "../../utilities/DomUtility";
import Task from "../../data/models/TaskModel";
import TaskCard from "../TaskCard/TaskCard";
import EventBus from "../../utilities/EventBus";
import ProjectService from "../../services/ProjectService";
import CreateTaskModal from "../../modals/CreateTaskModal/CreateTaskModal";
import ViewTaskModal from "../../modals/ViewTaskModal/ViewTaskModal";
import CreateSwimLaneModal from "../../modals/CreateSwimLaneModal/CreateSwimLaneModal";
import CardService from "../../services/CardService";

export default class Dashboard {

    #project;
    #container
    #element;
    #lanesContainer;
    #taskService;
    #laneService;
    #modals = [];
    #eventListeners = {};

    #createTaskModal = null;
    #viewTaskModal = null;
    #createSwimlaneModal = null;

    constructor() {
        this.#project = ProjectService.CURRENT_PROJECT;
        this.#container = document.querySelector(".content");
        this.#element = this.#createElement();
        this.#lanesContainer = this.#element.querySelector(".swim-lane-list");
        this.#taskService = this.#project.getTaskService();
        this.#laneService = this.#project.getLaneService();

        this.#initModals();
        this.#setupEventListeners();
        this.#renderSwimLanes();
        this.render();

        console.log("opening dashboard in:")
        console.log(this.#project.getName())
    }

    #initModals() {
        this.#modals = [
            this.#createTaskModal = new CreateTaskModal(),
            this.#viewTaskModal = new ViewTaskModal(),
            this.#createSwimlaneModal = new CreateSwimLaneModal(),
        ];
    }

    #setupEventListeners() {
        const events = [
            { event: "createTask", handler: (data) => this.#createTask(data) },
            { event: "openNewTaskModal", handler: (laneService) => this.#createTaskModal.open(laneService) },
            { event: "openCreateSwimlaneModal", handler: () => this.#createSwimlaneModal.open() },
            { event: "viewTask", handler: (task) => this.#viewTaskModal.open(task) },
            { event: "updateTask", handler: (id, data) => this.#updateTask(id, data) },
            { event: "moveTask", handler: ({ taskId, newStatus }) => this.#moveTask(taskId, newStatus) },
            { event: "deleteTask", handler: (task) => this.#deleteTask(task) },
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

        const filterPane = new FilterPane();
        filterPane.render(dashboard);

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

    #addSwimLane(status) {
        if (this.#laneService.getLanes().some((lane) => lane.getStatus() === status)) {
            alert("Lane already exists");
            return;
        }

        const cards = this.#taskService.getTasksByStatus(status).map((task) => new TaskCard(task));
        //const lane = new SwimLane(new CardService(cards), status);
        const lane = new SwimLane(status);
        this.#laneService.addLane(lane);
        lane.render(this.#lanesContainer);
        ProjectService.saveProject(this.#project);
    }

    #renderSwimLanes() {
        this.#laneService.getLanes().forEach((lane) => lane.render(this.#lanesContainer));
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

        this.#taskService.addTask(task);
        this.#addTaskToLane(task);
        ProjectService.saveProject(this.#project);
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
        this.#moveUpdatedTask(updatedTask, data.task);
        ProjectService.saveProject(this.#project);
    }

    #moveTask(taskId, newStatus) {
        const task = this.#taskService.getTaskById(taskId);
        if (!task || task.getStatus() === newStatus) return;

        const movedTask = new Task(
            task.getId(),
            task.getProject(),
            task.getSummary(),
            task.getDescription(),
            task.getPriority(),
            task.getDate(),
            newStatus
        );

        this.#taskService.updateTask(movedTask);
        this.#moveUpdatedTask(movedTask, task);
        ProjectService.saveProject(this.#project);
    }

    #deleteTask(task) {
        this.#taskService.removeTask(task.getId());
        this.#laneService.getLaneByStatus(task.getStatus()).getCardService().removeCard(task.getId());
        ProjectService.saveProject(this.#project);
    }

    #deleteSwimLane(status) {
        this.#laneService.removeLane(status);
        ProjectService.saveProject(this.#project);
    }

    #handleNewTaskClick() {
        if (!document.querySelector(".create-task-modal")) {
            EventBus.emit("openNewTaskModal", this.#laneService);
        }
    }

    #addTaskToLane(task) {
        const lane = this.#laneService.getLaneByStatus(task.getStatus());
        if (lane !== null) {
            lane.getCardService().addCard(new TaskCard(task));
            lane.renderCards();
        }
    }

    #moveUpdatedTask(updatedTask, oldTask) {
        const newLane = this.#laneService.getLaneByStatus(updatedTask.getStatus());
        const oldLane = this.#laneService.getLaneByStatus(oldTask.getStatus());

        if (newLane !== oldLane) {
            oldLane.getCardService().removeCard(oldTask.getId());
            newLane.getCardService().addCard(new TaskCard(updatedTask));
        } else {
            newLane.getCardService().updateCard(oldTask.getId(), new TaskCard(updatedTask));
        }

        newLane.renderCards();
        if (oldLane !== newLane) oldLane.renderCards();
    }

    destroy() {
        this.#element.remove();
        this.#cleanUp();
    }

    #unbindEvents() {
        Object.entries(this.#eventListeners).forEach(([event, handler]) => {
            EventBus.off(event, handler);
        });
    }

    #cleanUp() {
        this.#modals.forEach((modal) => {
            modal.destroy();
        });

        this.#modals = [];
        this.#unbindEvents();
        this.#eventListeners = {};
    }

    render() {
        if (this.#element) {
            this.#element.remove();
        }
        this.#container.appendChild(this.#element);
    }

}
