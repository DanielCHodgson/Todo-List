import "./SwimLane.css";
import Utility from "../../Utilities/domUtility";
import TaskCard from "../TaskCard/TaskCard";

export default class SwimLane {

    #taskService;
    #events;
    #container;
    #status;
    #parent;

    constructor(parent, taskService, events, status) {
        this.#parent = parent;
        this.#taskService = taskService;
        this.#events = events;
        this.#status = status;
        this.#container = Utility.createElement("div", "swim-lane");
        this.#container.dataset.status = this.#status;
        this.render();
    }

    #createHeader() {
        const header = Utility.createElement("div", "lane-header");
        const titleStr = this.#status.replace(/-/g, " ")
        const title = Utility.createElement("h3", "", titleStr.toUpperCase());
        header.appendChild(title);
        return header;
    }

    #createCard(task) {
        return new TaskCard(task, this.#events).getCard();
    }

    #renderCards() {
        const cardsList = Utility.createElement("div", "card-list");
        const tasks = this.#taskService.getTasksByStatus(this.#status);
        tasks.forEach(task => cardsList.appendChild(this.#createCard(task)));
        return cardsList;
    }

    addTask(task) {
        this.#container.querySelector(".card-list").appendChild(this.#createCard(task));
    }

    removeTask(task) {
        //To do 
    }

    render() {
        this.#container.innerHTML = "";
        this.#container.appendChild(this.#createHeader());
        this.#container.appendChild(this.#renderCards());
        this.#parent.appendChild(this.#container);
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