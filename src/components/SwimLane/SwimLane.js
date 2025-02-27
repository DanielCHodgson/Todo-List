import "./SwimLane.css";
import TaskService from "../../data/Models/TaskService";
import Utility from "../../Utilities/domUtility";
import Task from "../../data/Models/TaskModel";
import TaskCard from "../TaskCard/TaskCard";

export default class SwimLane {

    #taskManager;
    #container;
    #status;

    constructor(parent, events, status) {
        this.parent = parent;
        this.#status = status;
        this.#container = Utility.createElement("div", "swim-lane");
        this.#container.dataset.status = this.#status;
        this.#taskManager = new TaskService();
        events.on("createTask", (data) => this.addNewTask(data))
    }

    createCard(task) {
        const card = new TaskCard(task);
        return card.getCard();
    }

    addNewTask(data) {
        const { project, summary, description, priority, date } = data
        const task = new Task(this.#taskManager.getIndex(), project, summary, description, priority, date);
        console.log(task)
        this.#taskManager.addTask(task);
        this.render();
    }

    render() {
        this.destroy();
        this.parent.appendChild(this.#container);
        this.#taskManager.getTasks().forEach(task => {
          this.#container.appendChild(this.createCard(task));
        })
    }

    destroy() {
        this.#container.innerHTML = "";
    }

    get taskManager() {
        return this.#taskManager;
    }

}