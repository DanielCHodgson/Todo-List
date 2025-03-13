import "./TasksPage.css";
import ProjectService from "../../services/ProjectService";
import DomUtility from "../../utilities/DomUtility";
import Task from "../../data/models/TaskModel";

export default class TasksPage {

    #project
    #taskService;
    #listItems;
    #parent;
    #element;

    constructor() {
        this.#project = ProjectService.CURRENT_PROJECT;
        this.#taskService = this.#project.getTaskService();
        this.#parent = document.querySelector(".content");
        this.#listItems = [];
        this.#element = this.#createElement();
        this.render();
    }


    #updateTaskField(task, originalValue, newValue) {

        //TO DO 
        /*
        if (originalValue === newValue)
            return;

     

        const updatedTask = 

        this.#taskService.updateTask(updatedTask);
        ProjectService.saveProject(this.#project);

        DomUtility.showAlert("Task updated");
        */
    }




    #createElement() {
        const tasksPage = DomUtility.createElement("div", "tasks-page");


        const tasksList = DomUtility.createElement("div", "tasks-list");

        this.#project.getTaskService().getTasks().forEach(task => {
            tasksList.appendChild(this.#createTaskListItem(task));
        });

        tasksPage.appendChild(this.#createHeader());
        tasksPage.appendChild(tasksList);
        return tasksPage;
    }

    #createHeader() {
        const header = DomUtility.createElement("div", "tasks-header");
        header.appendChild(DomUtility.createElement("h2", "title", "Tasks"))
        return header;
    }

    #createTaskListItem(task) {
        const listItem = DomUtility.createElement("div", "task-item");

        const id = DomUtility.createElement("p", "id", task.getId());

        const summary = DomUtility.createInputField("summary", true, 1, 31);
        summary.value = task.getSummary();
        summary.addEventListener("blur", () => this.#updateTaskField(task, task.getSummary(), summary.value));

        const status = DomUtility.createInputField("status", true, 1, 20)
        status.value = task.getStatus();
        status.addEventListener("blur", () => this.#updateTaskField(task, task.getStatus(), status.value));

        listItem.appendChild(id);
        listItem.appendChild(summary);
        listItem.appendChild(status);

        this.#listItems.push(listItem);

        return listItem;
    }

    #handleSubmit(event) {
        console.log("FIRED!")
        console.log(event)
    }

    render() {
        if (this.#element)
            this.#parent.appendChild(this.#element);
    }


    destroy() {
        this.#element.remove();
    }

}