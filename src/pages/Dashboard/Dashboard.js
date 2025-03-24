import "./Dashboard.css";
import FilterPane from "../../components/FilterPane/FilterPane";
import SwimLane from "../../components/SwimLane/SwimLane";
import Utility from "../../utilities/DomUtility";
import Task from "../../data/models/TaskModel";
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
    #events = {};

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
            { event: "moveTask", handler: ({ taskId, newStatus }) => this.#updateTaskStatus(taskId, newStatus) },
            { event: "viewTask", handler: (task) => this.#modals[1].open(task) },

            { event: "createSwimLane", handler: (status) => this.#addSwimLane(status) },
            { event: "deleteSwimLane", handler: (status) => this.#deleteSwimLane(status) },
        ];

        EventBus.registerEvents(this.#events, events);
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

        if (this.#project.getName() === data.project) {
            this.#taskService.createAndSave(task, this.#project);
        } else {
            const otherProject = ProjectService.load(data.project);
            otherProject.getTaskService().createAndSave(task, project);
        }

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

        if (data.newData.project === this.#project.getName()) {
            this.#taskService.updateAndSave(updatedTask, this.#project);
        } else {
            this.#taskService.deleteAndSave(updatedTask, this.#project);
            const otherProject = ProjectService.load(data.newData.project);
            otherProject.getTaskService().createAndSave(updatedTask, otherProject);
        }

        this.#renderUpdatedSwimLanes(updatedTask, data.task);
    }

    #updateTaskStatus(taskId, newStatus) {
        const targetTask = this.#taskService.getTaskById(taskId);

        if (!targetTask || targetTask.getStatus() === newStatus)
            return;

        const updatedTask = new Task(
            targetTask.getId(),
            targetTask.getProject(),
            targetTask.getSummary(),
            targetTask.getDescription(),
            targetTask.getPriority(),
            targetTask.getDate(),
            newStatus
        );
        this.#taskService.updateAndSave(updatedTask, this.#project);
        this.#renderUpdatedSwimLanes(targetTask, updatedTask);
    }

    #deleteTask(task) {
        this.#taskService.deleteAndSave(task, this.#project);
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
        Object.entries(this.#events).forEach(([event, handler]) => {
            EventBus.off(event, handler);
        });
        this.#events = {};
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
