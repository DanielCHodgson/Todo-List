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
    #lanes;
    #events;

    constructor(project) {
        this.#project = project;
        this.#container = document.querySelector(".content");
        this.#taskService = project.getTaskService();
        this.#lanes = [];
        this.#events = new EventBus();
        this.#element = this.createDashboard();
        this.#container.appendChild(this.#element);

        const lanesContainer = this.#element.querySelector(".swim-lane-list")
        const statuses = ["ready to start", "in progress", "in review", "closed"];
        statuses.forEach(status => this.addSwimLane(status, lanesContainer));

        this.initModals();

        this.#events.on("createTask", (data) => this.createTask(data));
        this.#events.on("updateTask", (id, data) => this.updateTask(id, data));
        this.#events.on("moveTask", ({ taskId, newStatus }) => this.moveTask(taskId, newStatus));
        this.#events.on("deleteTask", (task) => this.deleteTask(task));

        console.log(this.#lanes)
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


        return dashboard;
    }

    addSwimLane(status, lanesContainer) {
        const taskCards = this.#taskService
            .getTasksByStatus(status)
            .map(task => new TaskCard(task, this.#events));
        const lane = new SwimLane(lanesContainer, new CardService(taskCards), status, this.#events);
        this.#lanes.push(lane);
        lane.render();
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

        const lane = this.#lanes.find(lane => lane.getStatus() === task.getStatus());
        lane.getCardService().addCard(new TaskCard(task, this.#events));
        lane.renderCards();

        ProjectService.saveProject(this.#project);
    }

    updateTask(id, data) {

        const updatedTask = new Task(
            id,
            data.newData.project,
            data.newData.summary,
            data.newData.description,
            data.newData.priority,
            data.newData.date,
            data.newData.status
        );
    
        this.#taskService.updateTask(updatedTask);
    
        const lane = this.#lanes.find(lane => lane.getStatus() === data.newData.status);
        const oldLane = this.#lanes.find(lane => lane.getStatus() === data.task.getStatus());
    
        if (lane !== oldLane) {
            oldLane.removeCard(data.task);
            lane.getCardService().addCard(new TaskCard(updatedTask, this.#events));
        } else {
            lane.getCardService().updateCard(data.task, new TaskCard(updatedTask, this.#events));

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

            const originalLane = this.#lanes.find(lane => lane.getStatus() === task.getStatus());
            const newLane = this.#lanes.find(lane => lane.getStatus() === movedTask.getStatus());
            originalLane.getCardService().moveCard(task, newLane.getCardService());

            ProjectService.saveProject(this.#project);
        }
    }

    deleteTask(task) {
        this.#taskService.removeTask(task.getId());
        this.#lanes.find(lane => lane.getStatus() === task.getStatus())
            .getCardService()
            .removeCard(task);
        ProjectService.saveProject(this.#project);
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
