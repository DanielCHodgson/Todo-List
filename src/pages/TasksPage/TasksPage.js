import "./TasksPage.css";
import ProjectService from "../../services/ProjectService";
import DomUtility from "../../utilities/DomUtility";
import Task from "../../data/models/TaskModel";
import TaskRow from "../../components/TaskRow/TaskRow";
import EventBus from "../../utilities/EventBus";

export default class TasksPage {
    #project;
    #tasks;
    #parent;
    #element;
    #rows;
    #taskList;

    constructor() {
        this.#project = ProjectService.loadCurrentProject();
        if (!this.#project) throw new Error("No current project found.");

        this.#tasks = this.#project.getTaskService().getTasks();
        this.#parent = document.querySelector(".content");
        this.#element = this.#createElement();
        this.#rows = this.#createRows();

        this.render();
        EventBus.on("updateRow", (data) => this.#updateRow(data))
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

    
    #replaceRow(rowToReplace) {
        this.#rows = this.#rows.map(row => {
            return row.getTaskData().id === rowToReplace.getTaskData().id ?
                rowToReplace :
                row
        })
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
        EventBus.off("updateRow", () => this.#updateRow(data));
    }
}
