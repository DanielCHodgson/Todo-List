import "./SwimLane.css";
import Utility from "../../Utilities/domUtility";
import Task from "../../data/Models/TaskModel";
import TaskCard from "../TaskCard/TaskCard";

export default class SwimLane {

    #taskService;
    #container;
    #status;
    #parent = null;

    constructor(taskService, status) {
        this.#taskService = taskService;
        this.#status = status;
        this.#container = Utility.createElement("div", "swim-lane");
        this.#container.dataset.status = this.#status;
    }

    #createHeader() {
        const header = Utility.createElement("div", "lane-header");
        const titleStr = this.#status.replace(/-/g, " ")
        const title = Utility.createElement("h3", "", titleStr.toUpperCase());
        header.appendChild(title);
        return header;
    }

    #createCard(task) {
        return new TaskCard(task).getCard();
    }

    #renderCards() {
        const cardsList = Utility.createElement("div", "card-list");
        const tasks = this.#taskService.getTasksByStatus(this.#status);
        tasks.forEach(task => cardsList.appendChild(this.#createCard(task)));
        return cardsList;
    }

    addNewTask(data) {

      
        const { project, summary, description, priority, date, status } = data;
        const id = `${project}-${this.#taskService.getIndex()}`;
        const task = new Task(id, project, summary, description, priority, date, status);
        this.#taskService.addTask(task);
        
        this.#container.querySelector(".card-list").appendChild(this.#createCard(task));
    }

    render(parent) {
        this.#container.innerHTML = "";
        this.#container.appendChild(this.#createHeader());
        this.#container.appendChild(this.#renderCards());
        parent.appendChild(this.#container);
        this.#parent = parent;
    }

    destroy() {
        if (this.#parent && this.#container) {
            this.#parent.removeChild(this.#container);
            this.#parent = null;
        }
    }

    getTaskService() {
        return this.#taskService;
    }

    getStatus() {
        return this.#status;
    }

    getParent() {
        return this.#parent;
    }
    
    setParent(value) {
        this.#parent = value;
    }


}