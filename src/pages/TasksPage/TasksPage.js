import "./TasksPage.css";
import ProjectService from "../../services/ProjectService";
import DomUtility from "../../utilities/DomUtility";
import Task from "../../data/models/TaskModel";
import TaskRow from "../../components/TaskRow/TaskRow";
import EventBus from "../../utilities/EventBus";
import ViewTaskModal from "../../modals/ViewTaskModal/ViewTaskModal"
import CreateTaskModal from "../../modals/CreateTaskModal/CreateTaskModal"

export default class TasksPage {
    #project;
    #taskService
    #parent;
    #element;
    #taskList;
    #eventListeners = {};
    #createTaskModal;
    #viewTaskModal;

    constructor() {
        this.#project = ProjectService.CURRENT_PROJECT;
        this.#taskService = this.#project.getTaskService();
        this.#parent = document.querySelector(".content");
        this.#element = this.#createElement();
        this.#renderRows();
        this.render();
        this.initModals();
        this.bindEvents();
    }

    initModals() {
        this.#createTaskModal = new CreateTaskModal();
        this.#viewTaskModal = new ViewTaskModal();
    }

    bindEvents() {
        const events = [
            { event: "launchCreateTaskModal", handler: this.#handleCreateTaskOpen },
            { event: "launchViewTaskModal", handler: (task) => this.#handleViewTaskOpen(task) },

            { event: "createTask", handler: (data) => this.#createTask(data) },
            { event: "updateRow", handler: (data) => this.#updateTask(data) },
            { event: "deleteTask", handler: (task) => this.#deleteTask(task) },
        ];

        EventBus.registerEventListeners(this.#eventListeners, events);
    }

    #handleCreateTaskOpen() {
        this.#createTaskModal.open()
    }

    #handleViewTaskOpen(task) {
        this.#viewTaskModal.open(task);
    }

    #createElement() {
        const tasksPage = DomUtility.createElement("div", "tasks-page");
        const container = DomUtility.createElement("div", "container");
        const tasksList = DomUtility.createElement("div", "tasks-list");
        this.#taskList = tasksList;
        container.appendChild(tasksList);
        tasksPage.appendChild(this.#createHeader());
        tasksPage.appendChild(container);
        return tasksPage;
    }

    #createHeader() {
        const header = DomUtility.createElement("div", "tasks-header");
        header.appendChild(DomUtility.createElement("h2", "title", "Tasks"));

        const createBtn = DomUtility.createElement("button", "new-task", "Create");
        createBtn.addEventListener("click", () => this.#handleCreateTaskOpen());
        header.appendChild(createBtn);

        return header;
    }

    #renderRows() {
        this.#taskList.innerHTML = ""
        return this.#taskService.getTasks().map(task => {
            return new TaskRow(this.#taskList, task);
        });
    }

    #createTask(data) {
        const task = new Task(
            `${this.#project.getName()}-${this.#taskService.getIndex()}`,
            data.project,
            data.summary,
            data.description,
            data.priority,
            data.date,
            data.status
        );

        if (ProjectService.CURRENT_PROJECT.getName() === project.getName()) {
            this.#taskService.createAndSave(task, this.#project);
        } else {
            project.getTaskService().createAndSave(task, project);
        }

        this.#taskService.createAndSave(task, ProjectService.load(data.project));
        this.#renderRows();
    }

    #updateTask(data) {
        const fieldName = data.inputField.id;
        const newValue = data.inputField.value;

        if (!(fieldName in data.taskData)) {
            console.error(`Invalid field: ${fieldName}`);
            return;
        }

        if (data.taskData[fieldName] === newValue)
            return;

        const updatedTask = new Task(
            data.taskData.id,
            fieldName === "project" ? newValue : data.taskData.project,
            fieldName === "summary" ? newValue : data.taskData.summary,
            fieldName === "description" ? newValue : data.taskData.description,
            fieldName === "priority" ? newValue : data.taskData.priority,
            fieldName === "date" ? newValue : data.taskData.date,
            fieldName === "status" ? newValue : data.taskData.status
        );


        data.taskData.project === null

        this.#taskService.updateAndSave(updatedTask, ProjectService.load(data.taskData.project))
        this.#renderRows();
        DomUtility.showAlert("Task updated");
    }

    #deleteTask(task) {
        this.#taskService.deleteAndSave(task, this.#project);
        this.#renderRows();
    }

    render() {
        if (this.#parent && this.#element) {
            this.#element.remove();
            this.#parent.appendChild(this.#element);
        }
    }

    destroy() {
        this.unbindEvents();
        if (this.#element) {
            this.#element.remove();
        }
    }

    unbindEvents() {
        Object.entries(this.#eventListeners).forEach(([event, handler]) => {
            EventBus.off(event, handler);
        });
        this.#eventListeners = {};
    }
}