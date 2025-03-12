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
import CardService from "../../services/CardService";

export default class Dashboard {

    #project;
    #container;
    #element;
    #taskService;
    #laneService;
    #lanesContainer;
    #modals = [];
    #eventListeners = {};

    constructor() {
        this.#project = ProjectService.CURRENT_PROJECT;

        this.#taskService = this.#project.getTaskService();
        this.#laneService = this.#project.getLaneService();

        this.#container = document.querySelector(".content");
        this.#element = this.createDashboard();
        this.#lanesContainer = this.#element.querySelector(".swim-lane-list");

        this.initModals();

        this.storeEventListeners();
        this.registerEventListeners();

        this.renderSwimLanes();
        this.render();
    }

    storeEventListeners() {
        this.#eventListeners.createTask = (data) => this.createTask(data);
        this.#eventListeners.updateTask = (id, data) => this.updateTask(id, data);
        this.#eventListeners.moveTask = ({ taskId, newStatus }) => this.moveTask(taskId, newStatus);
        this.#eventListeners.deleteTask = (task) => this.deleteTask(task);
        this.#eventListeners.createSwimLane = (status) => this.addSwimLane(status);
        this.#eventListeners.deleteSwimlane = (status) => this.deleteSwimlane(status);
    }

    registerEventListeners() {
        EventBus.on("createTask", this.#eventListeners.createTask);
        EventBus.on("updateTask", this.#eventListeners.updateTask);
        EventBus.on("moveTask", this.#eventListeners.moveTask);
        EventBus.on("deleteTask", this.#eventListeners.deleteTask);
        EventBus.on("createSwimLane", this.#eventListeners.createSwimLane);
        EventBus.on("deleteSwimLane", this.#eventListeners.deleteSwimlane);
    }

    initModals() {
        this.#modals = [
            new CreateTaskModal(),
            new ViewTaskModal(),
            new CreateSwimLaneModal()
        ];
    }

    createDashboard() {

        const dashboard = Utility.createElement("div", "dashboard");
        dashboard.appendChild(this.createHeader("Board"));

        const filterPane = FilterPane(EventBus);
        filterPane.render(dashboard);

        const lanesContainer = Utility.createElement("div", "swim-lane-list");
        dashboard.appendChild(lanesContainer);

        return dashboard;
    }


    addSwimLane(status) {

        if (this.#laneService.getLanes().some(lane => lane.getStatus() === status)) {
            alert("Lane already exists");
            return;
        }

        const cards = this.#taskService
            .getTasksByStatus(status)
            .map(task => {
                return new TaskCard(task);
            });


        const lane = new SwimLane(new CardService(cards), status);
        this.#laneService.addLane(lane);
        lane.render(this.#lanesContainer);
        ProjectService.saveProject(this.#project);
    }

    renderSwimLanes() {
        this.#laneService.getLanes().forEach(lane => lane.render(this.#lanesContainer));
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

        const task = new Task(`${data.project}-${this.#taskService.getIndex()}`,
            data.project,
            data.summary,
            data.description,
            data.priority,
            data.date,
            data.status
        );
        this.#taskService.addTask(task);

        const lane = this.#laneService.getLaneByStatus(task.getStatus());
        lane.getCardService().addCard(new TaskCard(task, EventBus));
        lane.renderCards();

        ProjectService.saveProject(this.#project);
    }

    updateTask(data) {

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

        const lane = this.#laneService.getLaneByStatus(data.newData.status);
        const oldLane = this.#laneService.getLaneByStatus(data.task.getStatus());

        if (lane !== oldLane) {
            oldLane.getCardService().removeCard(data.task.getId());
            lane.getCardService().addCard(new TaskCard(updatedTask, EventBus));
        } else {
            lane.getCardService().updateCard(data.task.getId(), new TaskCard(updatedTask, EventBus));
        }

        lane.renderCards();
        if (oldLane !== lane) oldLane.renderCards();

        ProjectService.saveProject(this.#project);
    }


    moveTask(taskId, newStatus) {
        const task = this.#taskService.getTaskById(taskId);

        if (task && task.getStatus() !== newStatus) {
            const movedTask = new Task(
                task.getId(),
                task.getProject(),
                task.getSummary(),
                task.getDescription(),
                task.getPriority(),
                task.getDueDate(),
                newStatus
            );

            this.#taskService.updateTask(movedTask);

            const originalLane = this.#laneService.getLaneByStatus(task.getStatus());
            const newLane = this.#laneService.getLaneByStatus(movedTask.getStatus());

            originalLane.getCardService().moveCard(new TaskCard(movedTask, EventBus), newLane.getCardService());

            originalLane.renderCards();
            newLane.renderCards();

            ProjectService.saveProject(this.#project);
        }
    }

    deleteTask(task) {
        this.#taskService.removeTask(task.getId());
        this.#laneService.getLaneByStatus(task.getStatus())
            .getCardService()
            .removeCard(task.getId());
        ProjectService.saveProject(this.#project);
    }

    handleNewTaskClick() {
        if (!document.querySelector(".create-task-modal")) {
            EventBus.emit("openNewTaskModal", this.#laneService);
        }
    }


    deleteSwimlane(status) {
        this.#laneService.removeLane(status);
        ProjectService.saveProject(this.#project);
    }

    destroy() {
        this.#element.remove();
        this.cleanUp();
    }

    cleanUp() {
        this.#modals.forEach(modal => {
            modal.cleanUp();
        });
        this.#modals = [];

        Object.entries(this.#eventListeners).forEach(([event, handler]) => {
            EventBus.off(event, handler);
        });
        this.#eventListeners = {};
    }

    render() {
        this.#container.innerHTML = "";
        if (this.#element)
            this.#container.appendChild(this.#element);
    }

    getEvents() {
        return EventBus;
    }

}
