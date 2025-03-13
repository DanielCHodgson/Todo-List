import "./TasksPage.css";
import ProjectService from "../../services/ProjectService";
import DomUtility from "../../utilities/DomUtility";

export default class TasksPage {

    #project
    #fields;
    #parent;
    #element;

    constructor() {
        this.#project = ProjectService.loadCurrentProject()
        console.log(this.#project)
        this.#parent = document.querySelector(".content");
        this.#fields = [];
        this.#element = this.createElement();
        this.render();
    }


    createElement() {
        const tasksPage = DomUtility.createElement("div", "tasks-page");

        const tasksList = DomUtility.createElement("div", "tasks-list");
        
        this.#project.getTaskService().getTasks().forEach(task => {
            tasksList.appendChild(this.createTaskListItem(task));
        }); 
        
        tasksPage.appendChild(tasksList);
        return tasksPage;
    }

    createTaskListItem(task) {
        const listItem = DomUtility.createElement("div", "task-item");

        const id = DomUtility.createElement("p", "id", task.getId());

        const summary = DomUtility.createInputField("summary", "summary", true, 1, 35);
        summary.value = task.getSummary();

        const status = DomUtility.createInputField("status", true, 1, 20)
        status.value = task.getStatus();

        this.#fields.push[id];
        this.#fields.push[summary];
        this.#fields.push[status];

        listItem.appendChild(id);
        listItem.appendChild(summary);
        listItem.appendChild(status);

        return listItem;
    }

    render() {
        if (this.#element)
            this.#parent.appendChild(this.#element);
    }


    destroy() {
        this.#element.remove();
    }

}