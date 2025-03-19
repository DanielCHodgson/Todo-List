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
    #tasks;
    #parent;
    #element;
    #rows;
    #taskList;
    #updateRowHandler;

    #createTaskModal;
    #viewTaskModal;

    #launchCreateTaskModalHandler;
    #launchViewTaskModalHandler;

    constructor() {
        this.#project = ProjectService.CURRENT_PROJECT;
        console.log(this.#project)
        if (!this.#project) throw new Error("No current project found.");

        this.#tasks = this.#project.getTaskService().getTasks();
        this.#parent = document.querySelector(".content");
        this.#element = this.#createElement();
        this.#rows = this.#createRows();

        this.render();

        this.#updateRowHandler = (data) => this.#updateRow(data);

        this.#createTaskModal = new CreateTaskModal();
        this.#viewTaskModal = new ViewTaskModal();

        this.#launchCreateTaskModalHandler = () => this.#handleCreateTaskOpen();
        this.#launchViewTaskModalHandler = (task) => this.#handleViewTaskOpen(task);

        EventBus.on("updateRow", this.#updateRowHandler);
        EventBus.on("launchCreateTaskModal", this.#launchCreateTaskModalHandler);
        EventBus.on("launchViewTaskModal", this.#launchViewTaskModalHandler);
        EventBus.on("createTask", (data) => this.#createTask(data));
        EventBus.on("deleteTaskRow", (task) => this.#deleteTaskRow(task));
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

    #createRows() {
        this.#taskList.innerHTML = ""
        return this.#tasks.map(task => {
            return new TaskRow(this.#taskList, task);
        });
    }

    #createHeader() {
        const header = DomUtility.createElement("div", "tasks-header");
        header.appendChild(DomUtility.createElement("h2", "title", "Tasks"));

        const createBtn = DomUtility.createElement("button", "new-task", "Create");
        createBtn.addEventListener("click", () => this.#launchCreateTaskModalHandler());
        header.appendChild(createBtn);
        
        return header;
    }


    #updateRow(data) {

        console.log(data)

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

        this.saveTaskAndProject(updatedTask);
        this.reloadRows();
        DomUtility.showAlert("Task updated");
    }

    #createTask(data) {
        const newTask = new Task(
            `${data.project}-${this.#project.getTaskService().getIndex()}`,
            data.project,
            data.summary,
            data.description,
            data.priority,
            data.date,
            data.status
        );

        this.#project.getTaskService().addTask(newTask);
        ProjectService.saveProject(this.#project);
        this.reloadRows();
    }

    #deleteTaskRow(task) {
        this.#project.getTaskService().removeTask(task.getId());
        ProjectService.saveProject(this.#project);
        this.reloadRows();
    }

    reloadRows() {
        this.#project = ProjectService.CURRENT_PROJECT;
        this.#tasks = this.#project.getTaskService().getTasks();
        this.#rows = this.#createRows();
    }

    saveTaskAndProject(task) {
        this.#project.getTaskService().updateTask(task);
        ProjectService.saveProject(this.#project);
    }

    render() {
        if (this.#parent && this.#element) {
            this.#element.remove();
            this.#parent.appendChild(this.#element);
        }
    }

    destroy() {
        if (this.#element) {
            this.#element.remove();
        }
        
        EventBus.off("updateRow", this.#updateRowHandler);
        EventBus.off("launchCreateTaskModal", this.#launchCreateTaskModalHandler);
        EventBus.off("launchViewTaskModal", this.#launchViewTaskModalHandler);
        EventBus.off("createTask", (data) => this.#createTask(data));
    }
}
