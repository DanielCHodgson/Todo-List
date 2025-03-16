import "./TasksPage.css";
import ProjectService from "../../services/ProjectService";
import DomUtility from "../../utilities/DomUtility";
import Task from "../../data/models/TaskModel";
import TaskRow from "../../components/TaskRow/TaskRow";
import EventBus from "../../utilities/EventBus";
import ViewTaskModal from "../../modals/ViewTaskModal/ViewTaskModal"

export default class TasksPage {
    #project;
    #tasks;
    #parent;
    #element;
    #rows;
    #taskList;
    #viewTaskModal;
    #updateRowHandler;
    #launchViewTaskModalHandler;

    constructor() {
        this.#project = ProjectService.CURRENT_PROJECT;
        if (!this.#project) throw new Error("No current project found.");

        this.#tasks = this.#project.getTaskService().getTasks();
        this.#parent = document.querySelector(".content");
        this.#element = this.#createElement();
        this.#rows = this.#createRows();

        this.render();

        this.#updateRowHandler = (data) => this.#updateRow(data);
        this.#launchViewTaskModalHandler = (task) => this.#openViewTaskModal(task);

        EventBus.on("updateRow", this.#updateRowHandler);
        EventBus.on("launchViewTaskModal", this.#launchViewTaskModalHandler);

        this.#viewTaskModal = new ViewTaskModal();
    }

    #openViewTaskModal(task) {

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
        return header;
    }


    #updateRow(data) {

        const fieldName = data.inputField.id;
        const newValue = data.inputField.value;

        if (!(fieldName in data.taskData)) {
            console.error(`Invalid field: ${fieldName}`);
            return;
        }

        console.log(`task data: ${data.taskData[fieldName]}`)
        console.log(`new value: ${newValue}`)


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
        this.#project = ProjectService.loadCurrentProject();
        this.#tasks = this.#project.getTaskService().getTasks();
        this.#rows = this.#createRows();

        DomUtility.showAlert("Task updated");
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
        EventBus.off("launchViewTaskModal", this.#launchViewTaskModalHandler);
    }
}
