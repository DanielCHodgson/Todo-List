import "./SwimLane.css";
import Utility from "../../Utilities/domUtility";
import Task from "../../data/Models/TaskModel";
import TaskCard from "../TaskCard/TaskCard";

export default class SwimLane {

    #parent
    #taskService;
    #container;
    #status;

    constructor(parent, taskService, events, status) {
        this.#parent = parent;
        this.#taskService = taskService;
        this.#status = status;
        this.#container = Utility.createElement("div", "swim-lane");
        this.#container.dataset.status = this.#status;

        events.on("createTask", (data) => this.addNewTask(data))
    }

    createHeader() {
        const header = Utility.createElement("div", "lane-header");
        const titleStr = this.#status.replace(/-/g, " ")
        const title = Utility.createElement("h3", "", titleStr);
        header.appendChild(title);
        return header;
    }


    createCardList() {

    }

    createCard(task) {
        const card = new TaskCard(task);
        return card.getCard();
    }

    addNewTask(data) {
        const { project, summary, description, priority, date } = data
        const id = `${project}-${this.#taskService.getIndex()}`;
        const task = new Task(id, project, summary, description, priority, date);
        this.#taskService.addTask(task);
        this.render();
    }

    render() {
        this.destroy();
        this.#container.appendChild(this.createHeader())
        const cardsList = Utility.createElement("div", "card-list")

        this.#taskService.getTasks().forEach(task => {
            cardsList.appendChild(this.createCard(task));
        })

        this.#container.appendChild(cardsList);
        this.#parent.appendChild(this.#container);
    }

    destroy() {
        this.#container.innerHTML = "";
    }

    get taskManager() {
        return this.#taskService;
    }

}